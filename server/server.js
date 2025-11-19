import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Rooms } from "./rooms.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const rooms = new Rooms();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinLobby", () => {
        io.emit("roomsUpdate", rooms.getRooms());
    });

    socket.on("createRoom", (data) => {
        const room = rooms.createRoom(data);
        io.emit("roomsUpdate", rooms.getRooms());
        socket.emit("roomCreated", room);
    });

    socket.on("joinRoom", ({ roomId, name }) => {
        const room = rooms.joinRoom(roomId, name, socket.id);
        socket.join(roomId);
        io.to(roomId).emit("roomUpdate", room);
    });

    socket.on("disconnect", () => {
        rooms.removePlayer(socket.id);
        io.emit("roomsUpdate", rooms.getRooms());
    });
});

app.get("/", (req, res) => {
    res.send("Blef backend is running");
});

server.listen(3001, () => console.log("Server running on :3001"));
