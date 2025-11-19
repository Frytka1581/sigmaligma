// Game logic client-side
const socket = io();
let currentRoom, playerHand = [], currentBid = null;

// On load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentRoom = urlParams.get('room');
  document.getElementById('roomName').textContent = currentRoom;
  socket.on('roomUpdate', (data) => {
    const list = document.getElementById('playersList');
    list.innerHTML = data.players.map(p => `<p>${p.name} (${p.cardCount} cards) ${p.eliminated ? '(Out)' : ''}</p>`).join('');
  });
  socket.on('roundStart', (data) => {
    document.getElementById('lobby').classList.add('hidden');
    document.getElementById('gameBoard').classList.remove('hidden');
    playerHand = data.hands[socket.id]; // Assume socket.id known
    renderHand();
    document.getElementById('poolSize').textContent = data.poolSize;
  });
  socket.on('bidMade', (data) => {
    currentBid = data.bid;
    renderBidHistory(data.bid, data.bidder);
    if (data.turn === socket.id) {
      showBidOptions();
    }
  });
  socket.on('challengeResult', (data) => {
    // Show animation/reveal
    if (data.isValid) {
      // Challenger lost
    } else {
      // Bidder lost
    }
  });
  // Challenge button
  // Dynamic: Generate bid buttons based on possible hands from your hand (bluff)
  function showBidOptions() {
    const controls = document.getElementById('controls');
    controls.innerHTML = `
      <button onclick="socket.emit('challenge', {room: currentRoom})">Blef! (Challenge)</button>
      <button onclick="makeBid('pair', '7')">Pair of 7s</button>
      <!-- More dynamic based on hand -->
    `;
  }
});

function renderHand() {
  const handDiv = document.getElementById('hand');
  handDiv.innerHTML = playerHand.map(card => `<div class="card">${card.rank}${card.suit}</div>`).join('');
}

function renderBidHistory(bid, bidder) {
  const history = document.getElementById('bidHistory');
  history.innerHTML += `<p>${bidder}: ${bid.type} ${bid.value || bid.suit || ''}</p>`;
}

function makeBid(type, value) {
  socket.emit('bid', { room: currentRoom, bid: { type, value } });
}