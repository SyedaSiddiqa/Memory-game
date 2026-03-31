// Select DOM elements
const gameBoard = document.getElementById('gameBoard');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const flipSound = document.getElementById('flipSound');

// Game variables
let cardsArray = ['🍎','🍌','🍇','🍉','🍓','🥝','🍒','🍍'];
let gameCards = [...cardsArray, ...cardsArray]; // duplicate for pairs
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let time = 60;
let timerInterval;

// Shuffle array
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// Create game board
function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(gameCards).forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = symbol;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '?';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // Add click event
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip card logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Play flip sound
    flipSound.currentTime = 0; // Reset to start
    flipSound.play().catch(e => {});

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

// Check for match
function checkMatch() {
    const firstSymbol = firstCard.querySelector('.card-front').textContent;
    const secondSymbol = secondCard.querySelector('.card-front').textContent;

    if (firstSymbol === secondSymbol) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score++;
        scoreEl.textContent = score;
        resetBoard();
        if(score === cardsArray.length){
            endGame(true);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 800);
    }
}

// Reset board variables
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Timer countdown
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time--;
        timeEl.textContent = time;
        if(time <= 0){
            endGame(false);
        }
    }, 1000);
}

// End game
function endGame(won){
    clearInterval(timerInterval);
    lockBoard = true;
    message.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    message.textContent = won ? `You Won! Score: ${score}` : `Time's Up! Score: ${score}`;
}

// Restart game
restartBtn.addEventListener('click', () => {
    score = 0;
    time = 60;
    scoreEl.textContent = score;
    timeEl.textContent = time;
    message.classList.add('hidden');
    restartBtn.classList.add('hidden');
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    createBoard();
    startTimer();
});

// Initialize game
createBoard();
startTimer();