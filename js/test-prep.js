// Test Preparation JavaScript

// Initialize test preparation functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeTestPrep();
});

let currentTest = null;
let testTimer = null;
let testResults = [];

function initializeTestPrep() {
  // Initialize test selection
  initializeTestSelection();

  // Initialize practice modes
  initializePracticeModes();

  // Initialize progress tracking
  initializeProgressTracking();

  // Initialize timer functionality
  initializeTimer();

  // Initialize results display
  initializeResultsDisplay();
}

// Test selection functionality
function initializeTestSelection() {
  const testCards = document.querySelectorAll(".test-card");

  testCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const testType = card.dataset.testType;
      startTest(testType);
    });
  });
}

function startTest(testType) {
  currentTest = {
    type: testType,
    questions: generateQuestions(testType),
    currentQuestion: 0,
    answers: [],
    startTime: Date.now(),
    timeLimit: getTimeLimit(testType),
  };

  displayTest();
  startTimer();
}

function generateQuestions(testType) {
  const questionSets = {
    toefl: generateTOEFLQuestions(),
    ielts: generateIELTSQuestions(),
    toeic: generateTOEICQuestions(),
    cambridge: generateCambridgeQuestions(),
    eiken: generateEikenQuestions(),
  };

  return questionSets[testType] || generateGeneralQuestions();
}

function generateTOEFLQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question:
        'Choose the best answer to complete the sentence: "The professor _____ the lecture when the fire alarm rang."',
      options: ["was giving", "had given", "gives", "will give"],
      correct: 0,
      explanation:
        "Past continuous tense is used for an ongoing action that was interrupted.",
    },
    {
      id: 2,
      type: "multiple-choice",
      question: 'Which word is closest in meaning to "comprehensive"?',
      options: ["incomplete", "thorough", "simple", "brief"],
      correct: 1,
      explanation:
        "Comprehensive means complete and including everything that is necessary.",
    },
    {
      id: 3,
      type: "reading-comprehension",
      passage:
        "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is natural, human activities have been the main driver since the 1800s.",
      question:
        "According to the passage, what has been the main cause of climate change since the 1800s?",
      options: [
        "Natural weather patterns",
        "Solar activity",
        "Human activities",
        "Ocean currents",
      ],
      correct: 2,
      explanation:
        "The passage clearly states that human activities have been the main driver since the 1800s.",
    },
  ];
}

function generateIELTSQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question:
        'Choose the correct form: "If I _____ more time, I would have finished the project."',
      options: ["have", "had", "had had", "would have"],
      correct: 2,
      explanation:
        'Third conditional requires "had" + past participle in the if-clause.',
    },
    {
      id: 2,
      type: "gap-fill",
      question:
        'Complete the sentence with the correct word: "The company\'s profits have _____ significantly this year."',
      options: ["increased", "decreased", "remained", "fluctuated"],
      correct: 0,
      explanation:
        'Context suggests positive change, making "increased" the best choice.',
    },
  ];
}

function generateTOEICQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question: "What time does the meeting _____ tomorrow?",
      options: ["start", "starts", "starting", "to start"],
      correct: 0,
      explanation:
        'After auxiliary verb "does", use the base form of the verb.',
    },
    {
      id: 2,
      type: "listening-comprehension",
      question:
        "Listen to the conversation and choose the best answer: What is the main topic?",
      options: [
        "Business strategy",
        "Marketing campaign",
        "Financial report",
        "Staff meeting",
      ],
      correct: 1,
      explanation: "The speakers discussed launching a new marketing campaign.",
    },
  ];
}

function generateCambridgeQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question: "Which sentence is grammatically correct?",
      options: [
        "I am working here since 2020.",
        "I work here since 2020.",
        "I have been working here since 2020.",
        "I was working here since 2020.",
      ],
      correct: 2,
      explanation:
        'Present perfect continuous is used with "since" for actions that started in the past and continue to the present.',
    },
  ];
}

function generateEikenQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question:
        '次の文を英語に訳してください: "私は毎日英語を勉強しています。"',
      options: [
        "I study English every day.",
        "I am studying English every day.",
        "I studied English every day.",
        "I will study English every day.",
      ],
      correct: 0,
      explanation: "Present simple tense is used for habitual actions.",
    },
  ];
}

function generateGeneralQuestions() {
  return [
    {
      id: 1,
      type: "multiple-choice",
      question:
        'Choose the correct answer: "She _____ to the store yesterday."',
      options: ["go", "goes", "went", "going"],
      correct: 2,
      explanation:
        "Past simple tense is used for completed actions in the past.",
    },
  ];
}

function getTimeLimit(testType) {
  const timeLimits = {
    toefl: 60, // 60 minutes
    ielts: 60,
    toeic: 120,
    cambridge: 90,
    eiken: 45,
  };

  return timeLimits[testType] || 30;
}

// Display test interface
function displayTest() {
  const testContainer =
    document.getElementById("test-container") || createTestContainer();
  testContainer.innerHTML = generateTestHTML();

  displayCurrentQuestion();
  updateProgressBar();
}

function createTestContainer() {
  const container = document.createElement("div");
  container.id = "test-container";
  container.className = "test-container";

  const mainContent = document.querySelector("main") || document.body;
  mainContent.appendChild(container);

  return container;
}

function generateTestHTML() {
  return `
        <div class="test-header">
            <div class="test-info">
                <h2>${currentTest.type.toUpperCase()} Practice Test</h2>
                <div class="question-counter">
                    Question <span id="current-question">1</span> of ${
                      currentTest.questions.length
                    }
                </div>
            </div>
            <div class="timer" id="timer">
                <i class="fas fa-clock"></i>
                <span id="time-remaining">${formatTime(
                  currentTest.timeLimit * 60
                )}</span>
            </div>
        </div>
        
        <div class="progress-section">
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            </div>
            <div class="progress-stats">
                <div class="stat">
                    <div class="stat-number" id="answered-count">0</div>
                    <div class="stat-label">Answered</div>
                </div>
                <div class="stat">
                    <div class="stat-number" id="remaining-count">${
                      currentTest.questions.length
                    }</div>
                    <div class="stat-label">Remaining</div>
                </div>
            </div>
        </div>
        
        <div class="question-container" id="question-container">
            <!-- Question content will be inserted here -->
        </div>
        
        <div class="test-controls">
            <button class="btn btn-secondary" id="prev-btn" disabled>Previous</button>
            <button class="btn btn-primary" id="next-btn">Next</button>
            <button class="btn btn-success" id="submit-btn" style="display: none;">Submit Test</button>
        </div>
    `;
}

function displayCurrentQuestion() {
  const question = currentTest.questions[currentTest.currentQuestion];
  const questionContainer = document.getElementById("question-container");

  questionContainer.innerHTML = generateQuestionHTML(question);

  // Add event listeners
  addQuestionEventListeners();

  // Update navigation
  updateNavigation();
}

function generateQuestionHTML(question) {
  let html = `
        <div class="question-number">${question.id}</div>
        <div class="question-text">${question.question}</div>
    `;

  if (question.passage) {
    html += `<div class="reading-passage">${question.passage}</div>`;
  }

  if (
    question.type === "multiple-choice" ||
    question.type === "listening-comprehension" ||
    question.type === "reading-comprehension"
  ) {
    html += '<ul class="answer-options">';
    question.options.forEach((option, index) => {
      const isSelected =
        currentTest.answers[currentTest.currentQuestion] === index;
      html += `
                <li class="answer-option ${
                  isSelected ? "selected" : ""
                }" data-index="${index}">
                    <span class="option-letter">${String.fromCharCode(
                      65 + index
                    )}</span>
                    ${option}
                </li>
            `;
    });
    html += "</ul>";
  } else if (question.type === "gap-fill") {
    html += `
            <div class="gap-fill-container">
                <input type="text" class="form-control gap-fill-input" 
                       placeholder="Type your answer here..." 
                       value="${
                         currentTest.answers[currentTest.currentQuestion] || ""
                       }">
            </div>
        `;
  }

  return html;
}

function addQuestionEventListeners() {
  // Multiple choice options
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option) => {
    option.addEventListener("click", () => {
      selectAnswer(parseInt(option.dataset.index));
    });
  });

  // Gap fill input
  const gapFillInput = document.querySelector(".gap-fill-input");
  if (gapFillInput) {
    gapFillInput.addEventListener("input", (e) => {
      currentTest.answers[currentTest.currentQuestion] = e.target.value;
    });
  }

  // Navigation buttons
  document
    .getElementById("prev-btn")
    ?.addEventListener("click", previousQuestion);
  document.getElementById("next-btn")?.addEventListener("click", nextQuestion);
  document.getElementById("submit-btn")?.addEventListener("click", submitTest);
}

function selectAnswer(index) {
  // Remove previous selection
  document
    .querySelectorAll(".answer-option")
    .forEach((opt) => opt.classList.remove("selected"));

  // Add selection to clicked option
  document.querySelector(`[data-index="${index}"]`).classList.add("selected");

  // Store answer
  currentTest.answers[currentTest.currentQuestion] = index;

  // Update progress
  updateProgressBar();
}

function previousQuestion() {
  if (currentTest.currentQuestion > 0) {
    currentTest.currentQuestion--;
    displayCurrentQuestion();
    updateProgressBar();
  }
}

function nextQuestion() {
  if (currentTest.currentQuestion < currentTest.questions.length - 1) {
    currentTest.currentQuestion++;
    displayCurrentQuestion();
    updateProgressBar();
  } else {
    // Show submit button on last question
    document.getElementById("submit-btn").style.display = "inline-block";
    document.getElementById("next-btn").style.display = "none";
  }
}

function updateNavigation() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");

  prevBtn.disabled = currentTest.currentQuestion === 0;

  if (currentTest.currentQuestion === currentTest.questions.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
  }
}

function updateProgressBar() {
  const answeredCount = currentTest.answers.filter(
    (answer) => answer !== undefined
  ).length;
  const progress = (answeredCount / currentTest.questions.length) * 100;

  document.getElementById("progress-bar").style.width = `${progress}%`;
  document.getElementById("current-question").textContent =
    currentTest.currentQuestion + 1;
  document.getElementById("answered-count").textContent = answeredCount;
  document.getElementById("remaining-count").textContent =
    currentTest.questions.length - answeredCount;
}

// Timer functionality
function initializeTimer() {
  // Timer is initialized when test starts
}

function startTimer() {
  let timeRemaining = currentTest.timeLimit * 60; // Convert to seconds

  testTimer = setInterval(() => {
    timeRemaining--;
    document.getElementById("time-remaining").textContent =
      formatTime(timeRemaining);

    const timerElement = document.getElementById("timer");
    if (timeRemaining <= 300) {
      // 5 minutes warning
      timerElement.classList.add("warning");
    }
    if (timeRemaining <= 60) {
      // 1 minute critical
      timerElement.classList.add("critical");
    }

    if (timeRemaining <= 0) {
      clearInterval(testTimer);
      submitTest(true); // Auto-submit when time runs out
    }
  }, 1000);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }
}

// Test submission and results
function submitTest(autoSubmit = false) {
  if (testTimer) {
    clearInterval(testTimer);
  }

  const endTime = Date.now();
  const totalTime = endTime - currentTest.startTime;

  // Calculate results
  const results = calculateResults();

  // Store results
  testResults.push({
    testType: currentTest.type,
    score: results.score,
    percentage: results.percentage,
    totalTime: totalTime,
    completedAt: new Date(),
    autoSubmit: autoSubmit,
  });

  // Display results
  displayResults(results, totalTime, autoSubmit);

  // Save to localStorage
  saveTestResults();
}

function calculateResults() {
  let correctAnswers = 0;
  const totalQuestions = currentTest.questions.length;

  currentTest.questions.forEach((question, index) => {
    const userAnswer = currentTest.answers[index];
    if (userAnswer === question.correct) {
      correctAnswers++;
    }
  });

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return {
    score: correctAnswers,
    total: totalQuestions,
    percentage: percentage,
    grade: getGrade(percentage),
  };
}

function getGrade(percentage) {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Good";
  if (percentage >= 70) return "Satisfactory";
  if (percentage >= 60) return "Needs Improvement";
  return "Poor";
}

function displayResults(results, totalTime, autoSubmit) {
  const testContainer = document.getElementById("test-container");

  testContainer.innerHTML = `
        <div class="results-section">
            <h2>Test Results</h2>
            ${
              autoSubmit
                ? '<p class="alert alert-warning">Time expired - test submitted automatically</p>'
                : ""
            }
            
            <div class="score-display ${results.grade
              .toLowerCase()
              .replace(" ", "-")}">
                ${results.percentage}%
            </div>
            
            <div class="results-details">
                <p><strong>Score:</strong> ${results.score} out of ${
    results.total
  }</p>
                <p><strong>Grade:</strong> ${results.grade}</p>
                <p><strong>Time Taken:</strong> ${formatTime(
                  Math.floor(totalTime / 1000)
                )}</p>
            </div>
            
            <div class="study-tips">
                <h3>📚 Study Tips</h3>
                ${generateStudyTips(results.percentage, currentTest.type)}
            </div>
            
            <div class="results-actions">
                <button class="btn btn-primary" onclick="reviewAnswers()">Review Answers</button>
                <button class="btn btn-secondary" onclick="restartTest()">Take Again</button>
                <button class="btn btn-success" onclick="viewProgress()">View Progress</button>
            </div>
        </div>
    `;
}

function generateStudyTips(percentage, testType) {
  const tips = {
    toefl: [
      "Practice academic vocabulary daily",
      "Focus on reading comprehension skills",
      "Improve note-taking techniques",
      "Work on time management strategies",
    ],
    ielts: [
      "Practice all four skills equally",
      "Learn formal and informal language styles",
      "Improve your grammatical accuracy",
      "Practice expressing opinions clearly",
    ],
    toeic: [
      "Focus on business English vocabulary",
      "Practice listening to various accents",
      "Improve reading speed and comprehension",
      "Learn common workplace scenarios",
    ],
  };

  const testTips = tips[testType] || tips["toefl"];

  if (percentage >= 80) {
    return "<ul><li>Excellent work! Continue practicing to maintain your level.</li></ul>";
  } else {
    return "<ul>" + testTips.map((tip) => `<li>${tip}</li>`).join("") + "</ul>";
  }
}

function reviewAnswers() {
  // Implementation for reviewing answers
  console.log("Review answers functionality would be implemented here");
}

function restartTest() {
  location.reload();
}

function viewProgress() {
  displayProgressTracking();
}

// Progress tracking
function initializeProgressTracking() {
  loadTestResults();
}

function saveTestResults() {
  localStorage.setItem("eslTestResults", JSON.stringify(testResults));
}

function loadTestResults() {
  const saved = localStorage.getItem("eslTestResults");
  if (saved) {
    testResults = JSON.parse(saved);
  }
}

function displayProgressTracking() {
  // Implementation for progress tracking display
  console.log("Progress tracking display would be implemented here");
}

// Practice modes
function initializePracticeModes() {
  const practiceBtns = document.querySelectorAll("[data-practice-mode]");

  practiceBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const mode = btn.dataset.practiceMode;
      startPracticeMode(mode);
    });
  });
}

function startPracticeMode(mode) {
  // Implementation for different practice modes
  console.log(`Starting practice mode: ${mode}`);
}

// Results display
function initializeResultsDisplay() {
  // Initialize any existing results display
  if (testResults.length > 0) {
    // Show recent results or statistics
    console.log("Test results available:", testResults.length);
  }
}

// Export functions for external use
window.TestPrep = {
  startTest,
  submitTest,
  calculateResults,
  saveTestResults,
  loadTestResults,
};
