// Wait until the page has loaded before starting the game
document.addEventListener('DOMContentLoaded', function () {
  // Grab the main elements needed for gameplay
  const gameBoard = document.querySelector('#gameBoard');
  const cards = Array.from(document.querySelectorAll('.card'));
  const turnOutput = document.querySelector('#turnCount span');
  const winningOutput = document.querySelector('#winning');
  const countdownOutput = document.querySelector('#countdown');

  // Track overall game state
  let turns = 0;
  let boardLocked = true;

  // Timing settings in milliseconds
  const timeDelay = 1000;
  const previewDelay = 10000;

  // Start the game setup
  shuffleCards();
  addCardListeners();
  showPreviewAtStart();

  // Randomize the order of the cards when the page loads
  function shuffleCards() {
    const shuffledCards = [...cards].sort(function () {
      return Math.random() - 0.5;
    });

    // Put shuffled cards back into the board and reset classes
    shuffledCards.forEach(function (card) {
      gameBoard.appendChild(card);
      card.classList.remove('matched');
      card.classList.remove('clicked');
    });
  }

  // Add a click listener to each card
  function addCardListeners() {
    cards.forEach(function (card) {
      card.addEventListener('click', flipCard);
    });
  }

  // Show all cards briefly at the start for memorization
  function showPreviewAtStart() {
    cards.forEach(function (card) {
      card.classList.add('clicked');
    });

    let secondsLeft = previewDelay / 1000;
    countdownOutput.textContent = `Memorize the board... ${secondsLeft}`;

    // Update the countdown once per second
    const countdownTimer = setInterval(function () {
      secondsLeft--;

      if (secondsLeft > 0) {
        countdownOutput.textContent = `Memorize the board... ${secondsLeft}`;
      } else {
        countdownOutput.textContent = 'Go!';
      }
    }, 1000);

    // After preview time, flip everything back down and unlock play
    setTimeout(function () {
      cards.forEach(function (card) {
        card.classList.remove('clicked');
      });

      clearInterval(countdownTimer);
      countdownOutput.textContent = 'Game started';
      boardLocked = false;

      // Clear the status message shortly after the game begins
      setTimeout(function () {
        countdownOutput.textContent = '';
      }, 1200);
    }, previewDelay);
  }

  // Handle each card click
  function flipCard() {
    // Ignore clicks while the board is locked
    if (boardLocked) {
      return;
    }

    // Ignore cards that already matched
    if (this.classList.contains('matched')) {
      return;
    }

    // Ignore cards that are already flipped
    if (this.classList.contains('clicked')) {
      return;
    }

    // Flip the selected card
    this.classList.add('clicked');

    // Find all currently flipped cards that are not already matched
    const clickedCards = document.querySelectorAll('.card.clicked:not(.matched)');

    // One turn happens after the second card is clicked
    if (clickedCards.length === 2) {
      boardLocked = true;
      turns++;
      turnOutput.textContent = turns;
      checkMatch(clickedCards[0], clickedCards[1]);
    }
  }

  // Compare the two flipped cards
  function checkMatch(card1, card2) {
    const pairClass1 = getPairClass(card1);
    const pairClass2 = getPairClass(card2);

    // If the pair class matches, mark both cards as matched
    if (pairClass1 === pairClass2) {
      setTimeout(function () {
        card1.classList.add('matched');
        card2.classList.add('matched');

        clearClickedCards();
        boardLocked = false;
        checkForWin();
      }, timeDelay);
    } else {
      // If they do not match, flip them back over
      setTimeout(function () {
        clearClickedCards();
        boardLocked = false;
      }, timeDelay);
    }
  }

  // Remove the clicked class so cards flip back down
  function clearClickedCards() {
    const clickedCards = document.querySelectorAll('.card.clicked:not(.matched)');

    clickedCards.forEach(function (card) {
      card.classList.remove('clicked');
    });
  }

  // Check if all cards are now matched
  function checkForWin() {
    const matchedCards = document.querySelectorAll('.card.matched');

    if (matchedCards.length === cards.length) {
      winningOutput.innerHTML = `✨  YOU WIN ✨`;
      boardLocked = true;
    }
  }

  // Helper function to find the pair class on a card
  function getPairClass(card) {
    const classList = Array.from(card.classList);

    return classList.find(function (className) {
      return className.startsWith('pair');
    });
  }
});