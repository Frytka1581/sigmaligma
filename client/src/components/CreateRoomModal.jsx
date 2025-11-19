import { useState } from "react";

export default function CreateRoomModal({ onClose, onCreate }) {
  const [name, setName] = useState("Friday Night Blef");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [cardLimit, setCardLimit] = useState(6);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 14,
          width: 400,
        }}
      >
        <h2>Create New Game</h2>
        <p>Set up your Blef game room and invite friends to join</p>

        <label>Room Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            marginBottom: 18,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <label>Max Players: {maxPlayers}</label>
        <input
          type="range"
          min="2"
          max="10"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          style={{ width: "100%" }}
        />

        <br /><br />

        <label>Card Limit (Elimination): {cardLimit}</label>
        <input
          type="range"
          min="3"
          max="15"
          value={cardLimit}
          onChange={(e) => setCardLimit(e.target.value)}
          style={{ width: "100%" }}
        />

        <p style={{ fontSize: 12 }}>
          Players are eliminated when they reach this many cards
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 25 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              background: "#ddd",
              border: 0,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => onCreate({ name, maxPlayers, cardLimit })}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              background: "lightgreen",
              border: 0,
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
