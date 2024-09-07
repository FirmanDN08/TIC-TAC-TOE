const startScreen = document.getElementById('start-screen');
const playerSelectionScreen = document.getElementById('player-selection');
const gameScreen = document.getElementById('game-screen');
const board = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const difficultySelect = document.getElementById('difficulty');
const playerSelect = document.getElementById('player');
let currentPlayer = 'X';
let userPlayer = 'X';
let gameActive = true;
let gameBoard = ['', '', '', '', '', '', '', '', ''];

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

board.forEach(cell => cell.addEventListener('click', handleCellClick));

function goToPlayerSelection() {
    startScreen.classList.remove('active');
    playerSelectionScreen.classList.add('active');
}

function startGame() {
    userPlayer = playerSelect.value;
    currentPlayer = 'X';
    playerSelectionScreen.classList.remove('active');
    gameScreen.classList.add('active');
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    if (currentPlayer === userPlayer) {
        updateCell(clickedCell, clickedCellIndex);
        checkResult();
    }
}

function updateCell(cell, index) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const a = gameBoard[condition[0]];
        const b = gameBoard[condition[1]];
        const c = gameBoard[condition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Pemain ${currentPlayer} Menang!`;
        gameActive = false;
        return;
    }

    if (!gameBoard.includes('')) {
        statusText.textContent = 'Seri!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer !== userPlayer) {
        makeComputerMove();
    }
}

function makeComputerMove() {
    const difficulty = difficultySelect.value;
    let move;

    if (difficulty === 'easy') {
        move = availableRandomMove();
    } else if (difficulty === 'medium') {
        move = findBestMoveMedium();
    } else {
        move = findBestMoveHard();
    }

    if (move !== undefined) {
        gameBoard[move] = 'O';
        board[move].textContent = 'O';
        checkResult();
    }
}

function findBestMoveMedium() {
    const blockMove = findWinningMove(userPlayer);
    return blockMove !== undefined ? blockMove : availableRandomMove();
}

function findBestMoveHard() {
    // AI prioritizes winning moves, then blocking, and lastly random moves
    const winningMove = findWinningMove('O');
    const blockMove = findWinningMove(userPlayer);
    
    if (winningMove !== undefined) {
        return winningMove;
    } else if (blockMove !== undefined) {
        return blockMove;
    } else if (gameBoard[4] === '') {
        return 4;  // Prioritize center if available
    } else {
        return findBestCornerOrSideMove();
    }
}

function findWinningMove(player) {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const a = gameBoard[condition[0]];
        const b = gameBoard[condition[1]];
        const c = gameBoard[condition[2]];

        if (a === player && b === player && c === '') return condition[2];
        if (a === player && b === '' && c === player) return condition[1];
        if (a === '' && b === player && c === player) return condition[0];
    }
    return undefined;
}

function findBestCornerOrSideMove() {
    const corners = [0, 2, 6, 8];
    const sides = [1, 3, 5, 7];
    let availableCorners = corners.filter(index => gameBoard[index] === '');
    let availableSides = sides.filter(index => gameBoard[index] === '');

    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    } else {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
}

function availableRandomMove() {
    const availableCells = [];

    gameBoard.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = '';
    board.forEach(cell => (cell.textContent = ''));
    startScreen.classList.add('active');
    gameScreen.classList.remove('active');
}
