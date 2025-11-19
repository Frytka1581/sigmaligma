const socket = io();

const lobby = document.getElementById('lobby');
const gameDiv = document.getElementById('game');
const playersList = document.getElementById('players');
const handList = document.getElementById('hand');

document.getElementById('join').onclick = () => {
  const name = document.getElementById('name').value;
  const room = document.getElementById('room').value;
  if (!name || !room) return alert('Podaj imię i ID pokoju!');
  socket.emit('joinRoom', room, name);
  lobby.style.display = 'none';
  gameDiv.style.display = 'block';
};

document.getElementById('start').onclick = () => {
  const room = document.getElementById('room').value;
  socket.emit('startGame', room);
};

socket.on('updatePlayers', (players) => {
  playersList.innerHTML = '';
  players.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    playersList.appendChild(li);
  });
});

socket.on('gameStarted', (hands) => {
  const playerId = socket.id;
  const hand = hands[playerId] || [];
  handList.innerHTML = '';
  hand.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    handList.appendChild(li);
  });
});
