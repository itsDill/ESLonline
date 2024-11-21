document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { word: "apple", meaning: "a fruit" },
        { word: "run", meaning: "to move quickly" },
        { word: "blue", meaning: "a color" },
        { word: "happy", meaning: "feeling joy" }
    ];

    const gameContainer = document.getElementById('game');
    const restartButton = document.getElementById('restart');
    let selectedWord = null;

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function initializeGame() {
        gameContainer.innerHTML = '';
        selectedWord = null;

        const shuffledWords = shuffleArray([...words]);
        const shuffledMeanings = shuffleArray([...words]);

        shuffledWords.forEach((entry, index) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'item';
            wordDiv.textContent = entry.word;
            wordDiv.dataset.type = 'word';
            wordDiv.dataset.value = entry.word;
            gameContainer.appendChild(wordDiv);
        });

        shuffledMeanings.forEach((entry, index) => {
            const meaningDiv = document.createElement('div');
            meaningDiv.className = 'item';
            meaningDiv.textContent = entry.meaning;
            meaningDiv.dataset.type = 'meaning';
            meaningDiv.dataset.value = entry.word;
            gameContainer.appendChild(meaningDiv);
        });
    }

    gameContainer.addEventListener('click', (e) => {
        const clickedItem = e.target;
        if (!clickedItem.classList.contains('item')) return;

        if (!selectedWord && clickedItem.dataset.type === 'word') {
            // First selection is a word
            selectedWord = clickedItem;
            clickedItem.classList.add('selected');
        } else if (selectedWord && clickedItem.dataset.type === 'meaning') {
            // Match the selected word with a meaning
            if (selectedWord.dataset.value === clickedItem.dataset.value) {
                selectedWord.classList.add('correct');
                clickedItem.classList.add('correct');
            } else {
                selectedWord.classList.add('incorrect');
                clickedItem.classList.add('incorrect');
            }

            setTimeout(() => {
                selectedWord.classList.remove('selected', 'correct', 'incorrect');
                clickedItem.classList.remove('correct', 'incorrect');
                selectedWord = null;
            }, 1000);
        }
    });

    restartButton.addEventListener('click', initializeGame);

    initializeGame();
});
