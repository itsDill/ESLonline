const quizData = [
    {
        word: "Benevolent",
        definition: "Well-meaning and kindly",
        options: ["Cruel", "Kind", "Selfish", "Rude"]
    },
    {
        word: "Ephemeral",
        definition: "Lasting for a very short time",
        options: ["Eternal", "Brief", "Permanent", "Long-lasting"]
    },
    {
        word: "Meticulous",
        definition: "Showing great attention to detail",
        options: ["Careless", "Sloppy", "Thorough", "Hasty"]
    },
    {
        word: "Ostentatious",
        definition: "Characterized by vulgar or pretentious display",
        options: ["Modest", "Showy", "Simple", "Plain"]
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');

function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    questionElement.innerText = `What is the meaning of "${currentQuizData.word}"?`;
    optionsElement.innerHTML = '';
    currentQuizData.options.forEach(option => {
        const button = document.createElement('div');
        button.innerText = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(option));
        optionsElement.appendChild(button);
    });
}

function selectOption(selectedOption) {
    const currentQuizData = quizData[currentQuestion];
    if (selectedOption === currentQuizData.definition) {
        score++;
        resultElement.innerText = 'Correct!';
    } else {
        resultElement.innerText = `Incorrect! The correct answer is "${currentQuizData.definition}".`;
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    questionElement.innerText = `Quiz Over! Your score is ${score}/${quizData.length}.`;
    optionsElement.innerHTML = '';
    resultElement.innerText = '';
}

loadQuestion();