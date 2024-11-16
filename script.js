document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const tileGrid = document.getElementById('tile-grid');
    const team1Score = document.querySelector('#team1-score span');
    const team2Score = document.querySelector('#team2-score span');
    const correctionPopup = document.createElement('div');
    correctionPopup.classList.add('correction');
    document.body.appendChild(correctionPopup);
    correctionPopup.style.display = 'none';

    const NUM_TILES = 16;
    const questions = [
        {
            question: "What is the capital of France?",
            answers: ["Paris", "Rome", "Berlin", "Madrid"],
            correct: 0,
            gif: "paris.gif",
        },
        // Add more questions here
    ];

    const gifs = {
        correct: "correct.gif",
        incorrect: "incorrect.gif",
    };

    let currentPlayer = 1;

    document.getElementById('start-game').addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initializeGame();
    });

    function initializeGame() {
        tileGrid.innerHTML = '';
        for (let i = 1; i <= NUM_TILES; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.innerHTML = `<span>${i}</span>`;
            tile.addEventListener('click', () => handleTileClick(i));
            tileGrid.appendChild(tile);
        }
    }

    function handleTileClick(tileNumber) {
        const question = questions[tileNumber % questions.length];
        const userAnswer = promptQuestion(question);

        if (userAnswer === question.correct) {
            displayGif(gifs.correct);
            updateScore();
        } else {
            displayCorrection(question.answers[question.correct]);
            displayGif(gifs.incorrect);
        }
    }

    function promptQuestion(question) {
        // Display the question and answers, return the selected answer index
        const answer = prompt(
            `${question.question}\n${question.answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
        );
        return parseInt(answer) - 1;
    }

    function updateScore() {
        const scoreElement = currentPlayer === 1 ? team1Score : team2Score;
        const currentScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = currentScore + 1;
        scoreElement.classList.add('animate');
        setTimeout(() => scoreElement.classList.remove('animate'), 500);
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    function displayCorrection(correctAnswer) {
        correctionPopup.textContent = `Correct Answer: ${correctAnswer}`;
        correctionPopup.style.display = 'block';
        setTimeout(() => {
            correctionPopup.style.display = 'none';
        }, 3000);
    }

    function displayGif(gif) {
        // Replace this with a modal or dynamic gif display
        alert(`GIF: ${gif}`);
    }
});
