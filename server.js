const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(".")); // serwuje index.html i client.js

let players = [];
let currentPile = [];
let lastClaim = null;

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join", (name) => {
    players.push({ id: socket.id, name, cards: 5 });
    io.emit("players", players);
  });

  socket.on("playCards", (data) => {
    const { count, value } = data;
    lastClaim = { count, value, player: socket.id };
    currentPile.push(...Array(count).fill(value));

    io.emit("played", {
      name: players.find((p) => p.id === socket.id).name,
      count,
      value,
    });
  });

  socket.on("callBluff", () => {
    const bluff = Math.random() < 0.5; // 50% że blef (prosta wersja)

    io.emit("bluffResult", {
      bluff,
      lastPlayer: players.find((p) => p.id === lastClaim.player).name,
    });

    currentPile = [];
    lastClaim = null;
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit("players", players);
  });
});

server.listen(3000, () => console.log("Server running on 3000"));
    