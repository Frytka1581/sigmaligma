import { useState } from "react";
import Welcome from "./pages/Welcome";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);

  if (screen === "welcome")
    return <Welcome onContinue={(name) => { setPlayer(name); setScreen("lobby"); }} />;

  if (screen === "lobby")
    return <Lobby player={player} enterRoom={(room) => { setRoom(room); setScreen("room"); }} />;

  if (screen === "room")
    return <Room room={room} player={player} />;
}
