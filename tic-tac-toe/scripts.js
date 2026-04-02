// Get handles on the DOM elements
const cells = document.querySelectorAll(".cell");
const turnDisplay = document.querySelector("#turnDisplay");
const statusText = document.querySelector("#status");
const resetBtn = document.querySelector("#resetBtn");

// Track current turn and game state
let currentPlayer = "x";
let gameActive = true;

// Store board data in 3 arrays
// "-" means unmarked, "x" means player X, "o" means player O
let rowA = ["-", "-", "-"];
let rowB = ["-", "-", "-"];
let rowC = ["-", "-", "-"];

// Check whether 3 spaces match and are not blank
function compareSpaces(a, b, c) {
  return a === b && a === c && a !== "-";
}

// Check rows, columns, and diagonals for a winner
function checkGameboard(a, b, c) {
  let result = "d";

  // Check rows
  if (compareSpaces(a[0], a[1], a[2])) return a[0];
  if (compareSpaces(b[0], b[1], b[2])) return b[0];
  if (compareSpaces(c[0], c[1], c[2])) return c[0];

  // Check columns
  if (compareSpaces(a[0], b[0], c[0])) return a[0];
  if (compareSpaces(a[1], b[1], c[1])) return a[1];
  if (compareSpaces(a[2], b[2], c[2])) return a[2];

  // Check diagonals
  if (compareSpaces(a[0], b[1], c[2])) return a[0];
  if (compareSpaces(a[2], b[1], c[0])) return a[2];

  return result;
}

// Update the turn display on the page
function updateTurnDisplay() {
  turnDisplay.textContent = `TURN: PLAYER ${currentPlayer.toUpperCase()}`;

  turnDisplay.classList.remove("player-x", "player-o");
  turnDisplay.classList.add(currentPlayer === "x" ? "player-x" : "player-o");
}

// Check whether there are still blank spaces on the board
function boardHasEmptySpaces() {
  return rowA.includes("-") || rowB.includes("-") || rowC.includes("-");
}

// Place a move into the correct row array
function placeMove(index, player) {
  if (index <= 2) {
    rowA[index] = player;
  } else if (index <= 5) {
    rowB[index - 3] = player;
  } else {
    rowC[index - 6] = player;
  }
}

// Handle a click on one board cell
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = Number(clickedCell.getAttribute("data-index"));

  // Ignore clicks if game is over or cell is already filled
  if (!gameActive || clickedCell.textContent !== "") {
    return;
  }

  // Update board display
  clickedCell.textContent = currentPlayer.toUpperCase();
  clickedCell.classList.add(currentPlayer, "disabled");

  // Update board arrays
  placeMove(clickedIndex, currentPlayer);

  // Check for winner or draw
  const winState = checkGameboard(rowA, rowB, rowC);

  if (winState === "x" || winState === "o") {
    statusText.textContent = `PLAYER ${winState.toUpperCase()} WINS!`;
    statusText.classList.remove("winner-x", "winner-o");
    statusText.classList.add(winState === "x" ? "winner-x" : "winner-o");

    turnDisplay.textContent = "GAME OVER";
    turnDisplay.classList.remove("player-x", "player-o");

    gameActive = false;
    return;
  }

  // Only call draw if no blank spaces remain
  if (winState === "d" && !boardHasEmptySpaces()) {
    statusText.textContent = "IT'S A DRAW!";
    statusText.classList.remove("winner-x", "winner-o");

    turnDisplay.textContent = "GAME OVER";
    turnDisplay.classList.remove("player-x", "player-o");

    gameActive = false;
    return;
  }

  // Switch players
  currentPlayer = currentPlayer === "x" ? "o" : "x";
  updateTurnDisplay();
}

// Reset everything for a new game
function restartGame() {
  currentPlayer = "x";
  gameActive = true;

  rowA = ["-", "-", "-"];
  rowB = ["-", "-", "-"];
  rowC = ["-", "-", "-"];

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "disabled");
  });

  statusText.textContent = "";
  statusText.classList.remove("winner-x", "winner-o");

  updateTurnDisplay();
}

// Add click listeners to every cell
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

// Add reset button listener
resetBtn.addEventListener("click", restartGame);

// Show initial turn on page
updateTurnDisplay();
