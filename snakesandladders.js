document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const board = document.createElement('div');
    board.id = 'snakes-ladders-board';

    // Game variables
    const players = [];
    const avatars = ['🐱', '🐶', '🐸', '🐵', '🐧']; // Customize your avatars
    const boardSize = 100; // 10x10 board
    const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 87: 24, 93: 73, 95: 75, 98: 78 };
    const ladders = { 3: 22, 5: 8, 15: 25, 18: 45, 21: 82, 28: 76, 36: 44, 50: 67, 63: 81, 71: 91 };
    let currentPlayerIndex = 0;

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        gameScreen.appendChild(board);
        for (let i = 1; i <= boardSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = i;
            board.appendChild(tile);
        }
    }

    // Add players
    function initializePlayers(numPlayers) {
        for (let i = 0; i < numPlayers; i++) {
            players.push({ name: `Player ${i + 1}`, position: 0, avatar: avatars[i] });
        }
    }

    // Roll the dice
    function rollDice() {
        return Math.floor(Math.random() * 6) + 1; // 1-6
    }

    // Move player
    function movePlayer(player, steps) {
        let newPosition = player.position + steps;
        if (newPosition > boardSize) newPosition = boardSize;
        if (snakes[newPosition]) {
            newPosition = snakes[newPosition];
        } else if (ladders[newPosition]) {
            newPosition = ladders[newPosition];
        }
        player.position = newPosition;
        updateBoard();
    }

    // Update board with player positions
    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => (tile.textContent = ''));

        players.forEach(player => {
            const tile = tiles[player.position - 1];
            tile.textContent += ` ${player.avatar}`;
        });
    }

    // Start the game
    document.getElementById('start-game').addEventListener('click', () => {
        const numPlayers = parseInt(prompt('Enter the number of players (1-5):'));
        if (numPlayers < 1 || numPlayers > 5) {
            alert('Please select between 1 and 5 players.');
            return;
        }

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        initializeBoard();
        initializePlayers(numPlayers);
        playGame();
    });

    // Play the game
    function playGame() {
        const diceRoll = rollDice();
        const currentPlayer = players[currentPlayerIndex];
        alert(`${currentPlayer.name} rolled a ${diceRoll}!`);
        movePlayer(currentPlayer, diceRoll);

        // Check for win
        if (currentPlayer.position === boardSize) {
            alert(`${currentPlayer.name} wins!`);
            resultScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
        }

        // Switch to next player
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    document.getElementById('restart-game').addEventListener('click', () => {
        window.location.reload();
    });
});
