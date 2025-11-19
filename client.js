const socket = io();

function joinGame() {
  const name = document.getElementById("name").value;
  socket.emit("join", name);

  document.getElementById("join").style.display = "none";
  document.getElementById("game").style.display = "block";
}

socket.on("players", (players) => {
  const list = document.getElementById("players");
  list.innerHTML = "";
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name + " (" + p.cards + " cards)";
    list.appendChild(li);
  });
});

function play() {
  const count = parseInt(document.getElementById("count").value);
  const value = document.getElementById("value").value;

  socket.emit("playCards", { count, value });
}

socket.on("played", (data) => {
  log(`${data.name} claims ${data.count} × ${data.value}`);
});

function callBluff() {
  socket.emit("callBluff");
}

socket.on("bluffResult", (r) => {
  if (r.bluff) {
    log(`BLEF! ${r.lastPlayer} lied.`);
  } else {
    log(`No bluff. Claim was true.`);
  }
});

function log(msg) {
  const box = document.getElementById("log");
  box.innerHTML += `<p>${msg}</p>`;
}
