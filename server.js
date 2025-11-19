const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let rooms = {}; // { roomId: { players: [], hands: {}, deck: [], currentTurn: 0 } }

function shuffleDeck() {
  const suits = ['♠','♥','♦','♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let deck = [];
  for (let s of suits) for (let r of ranks) deck.push(r+s);
  return deck.sort(() => Math.random() - 0.5);
}

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('joinRoom', (roomId, playerName) => {
    if (!rooms[roomId]) rooms[roomId] = { players: [], hands: {}, deck: [], currentTurn: 0 };
    const room = rooms[roomId];
    room.players.push({ id: socket.id, name: playerName });
    socket.join(roomId);
    io.to(roomId).emit('updatePlayers', room.players);
  });

  socket.on('startGame', (roomId) => {
    const room = rooms[roomId];
    room.deck = shuffleDeck();
    room.hands = {};
    room.players.forEach(p => room.hands[p.id] = []);
    let i = 0;
    while(room.deck.length) {
      const card = room.deck.pop();
      const playerId = room.players[i % room.players.length].id;
      room.hands[playerId].push(card);
      i++;
    }
    io.to(roomId).emit('gameStarted', room.hands);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      io.to(roomId).emit('updatePlayers', rooms[roomId].players);
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
