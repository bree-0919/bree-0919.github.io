// ==============================
// 🎮 DOM ELEMENTS
// ==============================
const cells = document.querySelectorAll(".cell");
const turnDisplay = document.querySelector("#turnDisplay");
const statusText = document.querySelector("#status");
const resetBtn = document.querySelector("#resetBtn");

// ==============================
// 🧠 GAME STATE
// ==============================
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// ==============================
// 🏆 WINNING COMBINATIONS
// ==============================
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// ==============================
// 🔄 UPDATE TURN DISPLAY
// ==============================
function updateTurnDisplay() {
  turnDisplay.textContent = `TURN: PLAYER ${currentPlayer}`;

  // Remove previous styling
  turnDisplay.classList.remove("player-x", "player-o");

  // Add styling for current player
  turnDisplay.classList.add(currentPlayer === "X" ? "player-x" : "player-o");
}

// ==============================
// 🖱 HANDLE CELL CLICK
// ==============================
function handleCellClick(e) {
  const cell = e.target;
  const index = Number(cell.getAttribute("data-index"));

  // Ignore click if cell is already used or game is over
  if (gameState[index] !== "" || !gameActive) return;

  // Update game state + UI
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "disabled");

  // Check if game ended
  checkResult();
}

// ==============================
// 🧪 CHECK GAME RESULT
// ==============================
function checkResult() {
  let winner = null;

  // Check all winning combinations
  for (const [a, b, c] of winningConditions) {
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      winner = gameState[a];
      break;
    }
  }

  // 🏆 WIN CASE
  if (winner) {
    statusText.textContent = `PLAYER ${winner} WINS!`;

    // Apply winner styling
    statusText.classList.remove("winner-x", "winner-o");
    statusText.classList.add(winner === "X" ? "winner-x" : "winner-o");

    turnDisplay.textContent = "GAME OVER";
    turnDisplay.classList.remove("player-x", "player-o");

    gameActive = false;
    return;
  }

  // 🤝 DRAW CASE
  if (!gameState.includes("")) {
    statusText.textContent = "IT'S A DRAW!";
    statusText.classList.remove("winner-x", "winner-o");

    turnDisplay.textContent = "GAME OVER";
    turnDisplay.classList.remove("player-x", "player-o");

    gameActive = false;
    return;
  }

  // 🔁 SWITCH PLAYER
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

// ==============================
// 🔄 RESET GAME
// ==============================
function restartGame() {
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

  // Clear status text + styling
  statusText.textContent = "";
  statusText.classList.remove("winner-x", "winner-o");

  // Reset all cells
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "disabled");
  });

  updateTurnDisplay();
}

// ==============================
// 🚀 EVENT LISTENERS
// ==============================
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", restartGame);

// ==============================
// 🟢 INITIALIZE GAME
// ==============================
updateTurnDisplay();
