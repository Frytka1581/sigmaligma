export default function RoomCard({ room, onJoin }) {
    return (
      <div
        style={{
          background: "#f1f1f1",
          padding: 20,
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3>{room.name}</h3>
          <p>
            {room.players.length}/{room.maxPlayers} players
          </p>
          <p>Card limit: {room.cardLimit}</p>
        </div>
  
        <button
          onClick={onJoin}
          style={{
            padding: "10px 18px",
            background: "lightgreen",
            borderRadius: 8,
            border: 0,
          }}
        >
          Join
        </button>
      </div>
    );
  }
  