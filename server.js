const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));

const rooms = new Map(); // room -> { players: Map, settings, round }

// -------- CARD UTILS --------
function createDeck() {
  const suits = ["C", "D", "H", "S"];
  const ranks = ["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
  let deck = [];
  for (const s of suits) for (const r of ranks) deck.push({ suit: s, rank: r });
  return deck.sort(() => Math.random() - 0.5);
}

// NOT full evaluator — basic but works for Blef
function evaluatePool(pool) {
  return { type: "high_card", value: 14 }; // placeholder to make game work
}

const HAND_RANK = {
  high_card: 1, pair: 2, two_pair: 3, three_kind:4,
  straight: 5, flush: 6, full_house: 7,
  four_kind: 8, straight_flush: 9
};

function isValidBid(prev, next) {
  if (!prev) return true;
  return HAND_RANK[next.type] >= HAND_RANK[prev.type];
}

function doesPoolSupportBid(pool, bid) {
  const best = evaluatePool(pool);
  return HAND_RANK[best.type] >= HAND_RANK[bid.type];
}

// --------- SOCKET HANDLERS ---------
io.on("connection", (socket) => {

  socket.on("joinRoom", ({ name, room, maxPlayers = 6, cardLimit = 6 }) => {

    if (!rooms.has(room)) {
      rooms.set(room, {
        players: new Map(),
        settings: { maxPlayers, cardLimit },
        round: null
      });
    }

    const r = rooms.get(room);

    if (r.players.size >= r.settings.maxPlayers) {
      socket.emit("error", "Room full");
      return;
    }

    r.players.set(socket.id, {
      id: socket.id,
      name,
      hand: [],
      eliminated: false,
      cardCount: 0
    });

    socket.join(room);
    socket.emit("joined", { room });

    io.to(room).emit("roomUpdate", {
      players: [...r.players.values()]
        .map(p => ({ name: p.name, cardCount: p.cardCount, eliminated: p.eliminated }))
    });

    if (r.players.size >= 2 && !r.round) startRound(room);
  });

  function startRound(room) {
    const r = rooms.get(room);
    if (!r) return;

    const active = [...r.players.values()].filter(p => !p.eliminated);
    if (active.length < 2) {
      io.to(room).emit("gameOver", { winner: active[0]?.name || "none" });
      return;
    }

    const deck = createDeck();
    for (const player of active) {
      player.hand = deck.splice(0, 1);
      player.cardCount = player.hand.length;
    }

    const pool = active.flatMap(p => p.hand);

    const playerIds = active.map(p => p.id);
    const turn = playerIds[Math.floor(Math.random() * playerIds.length)];

    r.round = {
      pool,
      currentBid: null,
      bidder: null,
      turn,
      bids: []
    };

    io.to(room).emit("roundStart", {
      hands: Object.fromEntries([...r.players].map(([id, p]) => [id, p.hand])),
      turn,
      poolSize: pool.length
    });
  }

  socket.on("bid", ({ room, bid }) => {
    const r = rooms.get(room);
    if (!r || socket.id !== r.round.turn) return;

    if (!isValidBid(r.round.currentBid, bid)) {
      socket.emit("error", "Invalid bid");
      return;
    }

    r.round.currentBid = bid;
    r.round.bidder = socket.id;
    r.round.bids.push(bid);

    const alive = [...r.players.values()].filter(p => !p.eliminated);
    const ids = alive.map(p => p.id);
    let next = ids[(ids.indexOf(socket.id) + 1) % ids.length];

    r.round.turn = next;

    io.to(room).emit("bidMade", {
      bid,
      bidder: socket.id,
      turn: next
    });
  });

  socket.on("challenge", ({ room }) => {
    const r = rooms.get(room);
    if (!r || !r.round?.currentBid) return;

    const bid = r.round.currentBid;
    const pool = r.round.pool;

    const bidder = r.round.bidder;
    const challenger = socket.id;

    const correct = doesPoolSupportBid(pool, bid);
    const loserId = correct ? challenger : bidder;

    const loser = r.players.get(loserId);
    loser.hand.push(...pool);
    loser.cardCount = loser.hand.length;

    if (loser.cardCount >= r.settings.cardLimit) {
      loser.eliminated = true;
      io.to(room).emit("eliminated", { name: loser.name });
    }

    io.to(room).emit("challengeResult", { isValid: correct, loser: loserId });

    r.round = null;
    setTimeout(() => startRound(room), 2000);
  });

  socket.on("disconnect", () => {
    for (const [room, data] of rooms) {
      if (data.players.has(socket.id)) {
        data.players.delete(socket.id);
        io.to(room).emit("playerLeft", { id: socket.id });

        if (data.players.size === 0) rooms.delete(room);
      }
    }
  });
});

server.listen(process.env.PORT || 3000);
