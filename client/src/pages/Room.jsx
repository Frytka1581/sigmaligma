export default function Room({ room, player }) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Room: {room.name}</h1>
        <p>Player: {player}</p>
  
        <h2>Players</h2>
  
        <ul>
          {room.players.map((p) => (
            <li key={p.socketId}>{p.name}</li>
          ))}
        </ul>
  
        <hr style={{ margin: "30px 0" }} />
  
        <p>Gameplay UI coming next…</p>
      </div>
    );
  }
  