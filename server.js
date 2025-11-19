const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // public folder z front-endem

const rooms = {};

io.on('connection', (socket) => {
    console.log('Nowy gracz:', socket.id);

    socket.on('createRoom', (roomId, playerName) => {
        if (rooms[roomId]) {
            socket.emit('roomExists');
            return;
        }
        rooms[roomId] = { players: [{ id: socket.id, name: playerName }], gameStarted: false, deck: [] };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        io.to(roomId).emit('updatePlayers', rooms[roomId].players);
    });

    socket.on('joinRoom', (roomId, playerName) => {
        const room = rooms[roomId];
        if (!room) {
            socket.emit('roomNotFound');
            return;
        }
        room.players.push({ id: socket.id, name: playerName });
        socket.join(roomId);
        io.to(roomId).emit('updatePlayers', room.players);
    });

    socket.on('startGame', (roomId) => {
        const room = rooms[roomId];
        if (!room) return;
        room.gameStarted = true;
        room.deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        io.to(roomId).emit('gameStarted', room.deck);
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            room.players = room.players.filter(p => p.id !== socket.id);
            io.to(roomId).emit('updatePlayers', room.players);
            if (room.players.length === 0) delete rooms[roomId];
        }
    });
});

server.listen(process.env.PORT || 3000, () => console.log('Serwer działa'));
