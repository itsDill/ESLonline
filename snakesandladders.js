document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const board = document.getElementById('snakes-ladders-board');
    const questions = [
        "What is your favorite color?",
        "What color is the grass?",
        "How are you today?",
        "How were you yesterday?",
        "What is the color of the sky?"
    ];

    // Game variables
    const players = [];
    const avatars = ['🐱', '🐶', '🐸', '🐵', '🐧'];
    const boardSize = 100;
    let snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 87: 24, 93: 73, 95: 75, 98: 78 };
    let ladders = { 3: 22, 5: 8, 15: 25, 18: 45, 21: 82, 28: 76, 36: 44, 50: 67, 63: 81, 71: 91 };
    let currentPlayerIndex = 0;

    // Tile images
    const tileImages = Array(boardSize).fill("tile.jpg");
    for (const snake in snakes) tileImages[snake - 1] = "snake.jpg";
    for (const ladder in ladders) tileImages[ladder - 1] = "ladder.jpg";

    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 1; i <= boardSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.backgroundImage = `url(${tileImages[i - 1]})`;
            tile.textContent = i;
            board.appendChild(tile);
        }
    }

    // Add players
    function initializePlayers(numPlayers) {
        players.length = 0;
        for (let i = 0; i < numPlayers; i++) {
            const name = prompt(`Enter name for Player ${i + 1}:`) || `Player ${i + 1}`;
            const avatar = avatars[i];
            const color = prompt(`Choose a color for ${name}:`) || "black";
            players.push({ name, position: 0, avatar, color });
        }
        updateBoard();
    }

    // Display random question before dice roll
    function askQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        alert(questions[randomIndex]);
    }

    // Dice roll animation
    function rollDiceAnimation(callback) {
        const dice = document.getElementById('dice');
        let roll = 1;
        const interval = setInterval(() => {
            dice.textContent = `🎲 ${roll}`;
            roll = roll === 6 ? 1 : roll + 1;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const result = Math.floor(Math.random() * 6) + 1;
            dice.textContent = `🎲 ${result}`;
            callback(result);
        }, 2000);
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
                const playerElem = document.createElement('span');
                playerElem.textContent = player.avatar;
                playerElem.style.color = player.color;
                tile.appendChild(playerElem);
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
        askQuestion();
        rollDiceAnimation(diceRoll => {
            alert(`${currentPlayer.name} rolled a ${diceRoll}!`);
            movePlayer(currentPlayer, diceRoll);
            updateBoard();

            if (currentPlayer.position === boardSize) {
                alert(`${currentPlayer.name} wins!`);
                resultScreen.classList.remove('hidden');
                gameScreen.classList.add('hidden');
                return;
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            setTimeout(playGame, 1000);
        });
    }

    // Allow editing snakes and ladders layout
    document.getElementById('edit-board').addEventListener('click', () => {
        const newSnakes = prompt("Enter new snakes as JSON (e.g., {16:6, 47:26}):");
        const newLadders = prompt("Enter new ladders as JSON (e.g., {3:22, 5:8}):");

        try {
            snakes = JSON.parse(newSnakes);
            ladders = JSON.parse(newLadders);

            initializeBoard();
            alert("Board layout updated!");
        } catch (e) {
            alert("Invalid JSON format. Try again.");
        }
    });

    // Restart game
    document.getElementById('restart-game').addEventListener('click', () => {
        window.location.reload();
    });
});
