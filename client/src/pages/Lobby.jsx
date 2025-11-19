import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateRoomModal from "../components/CreateRoomModal";
import RoomCard from "../components/RoomCard";

const socket = io("https://YOUR_BACKEND_URL"); // <-- TU WSTAW URL BACKENDU

export default function Lobby({ player, enterRoom }) {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    socket.emit("joinLobby");

    socket.on("roomsUpdate", (data) => {
      setRooms(data);
    });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {player}</h1>

      <button
        onClick={() => setShowCreate(true)}
        style={{
          padding: "12px 20px",
          background: "lightgreen",
          borderRadius: 10,
          border: 0,
          marginTop: 20,
        }}
      >
        + Create New Game
      </button>

      <h2 style={{ marginTop: 30 }}>Available Rooms</h2>

      {rooms.length === 0 && <p>No rooms yet — create one!</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onJoin={() => {
              socket.emit("joinRoom", { roomId: room.id, name: player });
              socket.on("roomUpdate", (updatedRoom) => {
                enterRoom(updatedRoom);
              });
            }}
          />
        ))}
      </div>

      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreate={(data) => {
            socket.emit("createRoom", data);
            socket.on("roomCreated", (room) => {
              setShowCreate(false);
              enterRoom(room);
            });
          }}
        />
      )}
    </div>
  );
}
