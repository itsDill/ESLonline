document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const board = document.getElementById('snakes-ladders-board');

    // Game variables
    const players = [];
    const avatars = ['🐱', '🐶', '🐸', '🐵', '🐧']; // Player avatars
    const boardSize = 100;
    const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 87: 24, 93: 73, 95: 75, 98: 78 };
    const ladders = { 3: 22, 5: 8, 15: 25, 18: 45, 21: 82, 28: 76, 36: 44, 50: 67, 63: 81, 71: 91 };
    let currentPlayerIndex = 0;

    // Tile images (you can customize these)
    const tileImages = Array(boardSize).fill("tile.jpg"); // Default image
    for (const snake in snakes) tileImages[snake - 1] = "snake.jpg";
    for (const ladder in ladders) tileImages[ladder - 1] = "ladder.jpg";

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 1; i <= boardSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.backgroundImage = `url(${tileImages[i - 1]})`;
            tile.textContent = i; // Tile number
            board.appendChild(tile);
        }
    }

    // Add players
    function initializePlayers(numPlayers) {
        for (let i = 0; i < numPlayers; i++) {
            players.push({ name: `Player ${i + 1}`, position: 0, avatar: avatars[i] });
        }
        updateBoard(); // Display initial positions
    }

    // Roll the dice
    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Move player
    function movePlayer(player, steps) {
        let newPosition = player.position + steps;
        if (newPosition > boardSize) newPosition = boardSize;

        if (snakes[newPosition]) {
            newPosition = snakes[newPosition];
            alert(`${player.name} hit a snake! Sliding down to ${newPosition}`);
        } else if (ladders[newPosition]) {
            newPosition = ladders[newPosition];
            alert(`${player.name} climbed a ladder! Moving up to ${newPosition}`);
        }

        player.position = newPosition;
    }

    // Update board with player positions
    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => (tile.textContent = ''));

        players.forEach(player => {
            const tile = tiles[player.position - 1];
            if (tile) {
                tile.textContent += `${player.avatar}`;
            }
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
        const currentPlayer = players[currentPlayerIndex];
        const diceRoll = rollDice();
        alert(`${currentPlayer.name} rolled a ${diceRoll}!`);
        movePlayer(currentPlayer, diceRoll);
        updateBoard();

        // Check for win
        if (currentPlayer.position === boardSize) {
            alert(`${currentPlayer.name} wins!`);
            resultScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setTimeout(playGame, 1000); // Continue after delay
    }

    // Restart game
    document.getElementById('restart-game').addEventListener('click', () => {
        window.location.reload();
    });
});
