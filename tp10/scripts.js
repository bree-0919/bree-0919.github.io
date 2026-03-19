const spaces = document.querySelectorAll(".gameSpace");
const turnDisplay = document.querySelector("#turnDisplay");
const statusMessage = document.querySelector("#statusMessage");
const resetBtn = document.querySelector("#resetBtn");

let currentPlayer = "x";
let gameActive = true;

let rowA = ["-", "-", "-"];
let rowB = ["-", "-", "-"];
let rowC = ["-", "-", "-"];

// checks whether 3 spaces match and are not blank
function compareSpaces(a, b, c) {
    return a === b && a === c && a !== "-";
}

// checks rows, columns, and diagonals for a winner
function checkGameboard(a, b, c) {
    if (compareSpaces(a[0], a[1], a[2])) return a[0];
    if (compareSpaces(b[0], b[1], b[2])) return b[0];
    if (compareSpaces(c[0], c[1], c[2])) return c[0];

    if (compareSpaces(a[0], b[0], c[0])) return a[0];
    if (compareSpaces(a[1], b[1], c[1])) return a[1];
    if (compareSpaces(a[2], b[2], c[2])) return a[2];

    if (compareSpaces(a[0], b[1], c[2])) return a[0];
    if (compareSpaces(a[2], b[1], c[0])) return a[2];

    return "d";
}

// updates the turn message on the page
function updateTurnDisplay() {
    turnDisplay.textContent = `TURN: PLAYER ${currentPlayer.toUpperCase()}`;
}

// checks whether any blank spaces remain
function boardHasEmptySpaces() {
    return rowA.includes("-") || rowB.includes("-") || rowC.includes("-");
}

// updates the correct row array based on the clicked index
function placeMove(index, player) {
    if (index <= 2) {
        rowA[index] = player;
    } else if (index <= 5) {
        rowB[index - 3] = player;
    } else {
        rowC[index - 6] = player;
    }
}

// handles a click on one game square
function handleSpaceClick(event) {
    const clickedSpace = event.target;
    const clickedIndex = Number(clickedSpace.getAttribute("data-index"));

    if (!gameActive || clickedSpace.textContent !== "") {
        return;
    }

    clickedSpace.textContent = currentPlayer.toUpperCase();
    clickedSpace.classList.add(currentPlayer, "disabled");

    placeMove(clickedIndex, currentPlayer);

    const result = checkGameboard(rowA, rowB, rowC);

    if (result === "x" || result === "o") {
        statusMessage.textContent = `PLAYER ${result.toUpperCase()} WINS!`;
        turnDisplay.textContent = "GAME OVER";
        gameActive = false;
        return;
    }

    if (result === "d" && !boardHasEmptySpaces()) {
        statusMessage.textContent = "IT'S A DRAW!";
        turnDisplay.textContent = "GAME OVER";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "x" ? "o" : "x";
    updateTurnDisplay();
}

// resets the whole game
function resetGame() {
    currentPlayer = "x";
    gameActive = true;

    rowA = ["-", "-", "-"];
    rowB = ["-", "-", "-"];
    rowC = ["-", "-", "-"];

    spaces.forEach((space) => {
        space.textContent = "";
        space.classList.remove("x", "o", "disabled");
    });

    statusMessage.textContent = "";
    updateTurnDisplay();
}

spaces.forEach((space) => {
    space.addEventListener("click", handleSpaceClick);
});

resetBtn.addEventListener("click", resetGame);

updateTurnDisplay();