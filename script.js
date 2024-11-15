document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-game");
    const restartButton = document.getElementById("restart-game");
    const gameScreen = document.getElementById("game-screen");
    const startScreen = document.getElementById("start-screen");
    const resultScreen = document.getElementById("result-screen");
    const tileGrid = document.getElementById("tile-grid");
    const scoreboard = {
        team1: 0,
        team2: 0,
    };
    let currentPlayer = "team1";

    // Example questions
    const questions = [
        { question: "What is 2 + 2?", answer: 4, options: [3, 4, 5] },
        { question: "What color is the sky?", answer: "Blue", options: ["Green", "Blue", "Red"] },
        // Add more questions
    ];

    // Start game
    startButton.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        renderTiles();
    });

    // Restart game
    restartButton.addEventListener("click", () => {
        location.reload();
    });

    function renderTiles() {
        tileGrid.innerHTML = "";
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.addEventListener("click", () => handleTileClick(i));
            tileGrid.appendChild(tile);
        }
    }

    function handleTileClick(index) {
        const tile = document.querySelectorAll(".tile")[index];
        tile.style.pointerEvents = "none";

        // Simulate showing a question
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const userAnswer = prompt(randomQuestion.question);

        if (userAnswer == randomQuestion.answer) {
            scoreboard[currentPlayer] += 25;
        } else {
            scoreboard[currentPlayer] -= 5;
        }

        updateScoreboard();
        switchPlayer();
    }

    function updateScoreboard() {
        document.getElementById("team1-score").querySelector("span").innerText = scoreboard.team1;
        document.getElementById("team2-score").querySelector("span").innerText = scoreboard.team2;

        if (Object.values(scoreboard).reduce((a, b) => a + b, 0) >= 100) {
            endGame();
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === "team1" ? "team2" : "team1";
    }

    function endGame() {
        gameScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        const winner = scoreboard.team1 > scoreboard.team2 ? "Player 1" : "Player 2";
        document.getElementById("winner").innerText = `Winner: ${winner}`;
    }
});
