document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const tileGrid = document.getElementById("tile-grid");
    const team1Score = document.querySelector("#team1-score span");
    const team2Score = document.querySelector("#team2-score span");
    const correctionPopup = document.createElement("div");
    correctionPopup.classList.add("correction");
    document.body.appendChild(correctionPopup);
    correctionPopup.style.display = "none";

    const gifModal = document.getElementById("gif-modal");
    const gifModalImg = gifModal.querySelector("img");

    const NUM_TILES = 16;
    const questions = [
        {
            question: "What is the capital of France?",
            answers: ["Paris", "Rome", "Berlin", "Madrid"],
            correct: 0,
            gif: "paris.gif",
        },
        {
            question: "Which animal barks?",
            answers: ["Dog", "Cat", "Cow", "Horse"],
            correct: 0,
            gif: "dog.gif",
        },
    ];

    const gifs = {
        correct: "correct.gif",
        incorrect: "incorrect.gif",
    };

    let currentPlayer = 1;

    document.getElementById("start-game").addEventListener("click", () => {
        startScreen.classList.remove("active");
        gameScreen.classList.add("active");
        initializeGame();
    });

    function initializeGame() {
        tileGrid.innerHTML = "";
        for (let i = 0; i < NUM_TILES; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.innerHTML = `<span>${i + 1}</span>`;
            tile.addEventListener("click", () => handleTileClick(i));
            tileGrid.appendChild(tile);
        }
    }

    function handleTileClick(tileIndex) {
        const question = questions[tileIndex % questions.length];
        const userAnswer = promptQuestion(question);

        if (userAnswer === question.correct) {
            displayGif(question.gif || gifs.correct);
            updateScore();
        } else {
            displayCorrection(question.answers[question.correct]);
            displayGif(gifs.incorrect);
        }
    }

    function promptQuestion(question) {
        const answer = prompt(
            `${question.question}\n${question.answers
                .map((a, i) => `${i + 1}. ${a}`)
                .join("\n")}`
        );
        return isNaN(answer) ? -1 : parseInt(answer) - 1;
    }

    function updateScore() {
        const scoreElement = currentPlayer === 1 ? team1Score : team2Score;
        const currentScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = currentScore + 1;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    function displayCorrection(correctAnswer) {
        correctionPopup.textContent = `Correct Answer: ${correctAnswer}`;
        correctionPopup.style.display = "block";
        setTimeout(() => {
            correctionPopup.style.display = "none";
        }, 3000);
    }

    function displayGif(gifSrc) {
        gifModalImg.src = gifSrc;
        gifModal.style.display = "block";
        setTimeout(() => (gifModal.style.display = "none"), 3000);
    }

    // Function to set a JPEG background
    function setBackground(imageUrl) {
        document.body.style.background = `url(${imageUrl}) no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
    }

    // Example: Set a default background
    setBackground("background.jpg");
});
