(() => {
  "use strict";

  const quizSets = {
    "synonym-matching": [
      {
        q: "Choose a synonym for <strong>happy</strong>.",
        options: ["joyful", "angry", "empty", "quiet"],
        answer: "joyful",
        explain: "Joyful means feeling happy.",
      },
      {
        q: "Choose a synonym for <strong>begin</strong>.",
        options: ["finish", "start", "forget", "hide"],
        answer: "start",
        explain: "Start and begin have similar meanings.",
      },
      {
        q: "Choose a synonym for <strong>tiny</strong>.",
        options: ["huge", "small", "loud", "late"],
        answer: "small",
        explain: "Tiny means very small.",
      },
    ],
    "antonym-matching": [
      {
        q: "Choose an antonym for <strong>ancient</strong>.",
        options: ["old", "modern", "historic", "past"],
        answer: "modern",
        explain: "Modern is the opposite of ancient.",
      },
      {
        q: "Choose an antonym for <strong>generous</strong>.",
        options: ["kind", "giving", "selfish", "helpful"],
        answer: "selfish",
        explain: "Selfish is the opposite of generous.",
      },
      {
        q: "Choose an antonym for <strong>increase</strong>.",
        options: ["grow", "add", "decrease", "raise"],
        answer: "decrease",
        explain: "Decrease is the opposite of increase.",
      },
    ],
    "idioms-challenge": [
      {
        q: "What does <strong>break the ice</strong> mean?",
        options: [
          "Start a friendly conversation",
          "Break something frozen",
          "End a meeting",
          "Feel cold",
        ],
        answer: "Start a friendly conversation",
        explain: "To break the ice is to make people feel more comfortable.",
      },
      {
        q: "What does <strong>once in a blue moon</strong> mean?",
        options: ["Every night", "Very rarely", "At lunchtime", "Very quickly"],
        answer: "Very rarely",
        explain: "This idiom describes something that happens infrequently.",
      },
      {
        q: "What does <strong>under the weather</strong> mean?",
        options: ["Outside", "Feeling unwell", "Very excited", "Late"],
        answer: "Feeling unwell",
        explain: "Someone under the weather is feeling ill.",
      },
    ],
    "phrasal-verb-challenge": [
      {
        q: "Which phrasal verb means <strong>to continue</strong>?",
        options: ["give up", "carry on", "look after", "turn down"],
        answer: "carry on",
        explain: "Carry on means continue.",
      },
      {
        q: "Which phrasal verb means <strong>to care for</strong>?",
        options: ["look after", "run out", "put off", "take off"],
        answer: "look after",
        explain: "Look after means take care of.",
      },
      {
        q: "Which phrasal verb means <strong>to postpone</strong>?",
        options: ["put off", "find out", "wake up", "pick up"],
        answer: "put off",
        explain: "Put off means delay or postpone.",
      },
    ],
    "english-trivia": [
      {
        q: "Which word is a <strong>noun</strong>?",
        options: ["quickly", "happiness", "bright", "swim"],
        answer: "happiness",
        explain: "Happiness names a feeling, so it is a noun.",
      },
      {
        q: "What is the past tense of <strong>teach</strong>?",
        options: ["teached", "taught", "teaching", "teaches"],
        answer: "taught",
        explain: "Teach is an irregular verb: teach → taught.",
      },
      {
        q: "Which spelling is correct?",
        options: ["neccessary", "necessary", "necesary", "necessery"],
        answer: "necessary",
        explain: "The correct spelling is necessary.",
      },
    ],
    "classroom-jeopardy": [
      {
        q: "Name the part of speech: <em>carefully</em>.",
        answer: "Adverb",
        points: 100,
      },
      {
        q: "Change <em>go</em> to the simple past.",
        answer: "Went",
        points: 200,
      },
      {
        q: "Choose the correct article: ___ honest person.",
        answer: "An",
        points: 300,
      },
      {
        q: "What is the plural of <em>child</em>?",
        answer: "Children",
        points: 100,
      },
      {
        q: "Give an antonym for <em>generous</em>.",
        answer: "Selfish",
        points: 200,
      },
      {
        q: "Complete: If I ___ time, I would travel.",
        answer: "Had",
        points: 300,
      },
      {
        q: "What does <em>break the ice</em> mean?",
        answer: "Start a friendly conversation",
        points: 100,
      },
      {
        q: "Give a synonym for <em>rapid</em>.",
        answer: "Fast / quick",
        points: 200,
      },
      {
        q: "What is the prefix in <em>disagree</em>?",
        answer: "Dis-",
        points: 300,
      },
      {
        q: "Which word has a silent k: <em>knife</em> or <em>kitten</em>?",
        answer: "Knife",
        points: 100,
      },
      {
        q: "Spell the past tense of <em>write</em>.",
        answer: "Wrote",
        points: 200,
      },
      {
        q: "Which is correct: <em>their</em>, <em>there</em>, or <em>they're</em> for possession?",
        answer: "Their",
        points: 300,
      },
    ],
    "battleship-grammar": [
      {
        q: "Choose the correct sentence.",
        options: [
          "She go to school.",
          "She goes to school.",
          "She going school.",
        ],
        answer: "She goes to school.",
      },
      {
        q: "Choose the correct past tense: We ___ a film yesterday.",
        options: ["see", "saw", "seen"],
        answer: "saw",
      },
      {
        q: "Choose the correct article: ___ apple",
        options: ["A", "An", "The a"],
        answer: "An",
      },
    ],
    "battleship-vocabulary": [
      {
        q: "Which word means <strong>very large</strong>?",
        options: ["Tiny", "Enormous", "Narrow"],
        answer: "Enormous",
      },
      {
        q: "Choose a synonym for <strong>swift</strong>.",
        options: ["Fast", "Weak", "Quiet"],
        answer: "Fast",
      },
      {
        q: "Which word means <strong>to look closely</strong>?",
        options: ["Observe", "Forget", "Borrow"],
        answer: "Observe",
      },
    ],
  };

  const games = {
    "word-search": {
      title: "Word Search",
      intro: "Find hidden English words in the letter grid.",
      how: "Tap letters in a row to build a word, then choose Check word. The starter grid hides words horizontally.",
      kind: "word-search",
    },
    "word-scramble": {
      title: "Word Scramble",
      intro: "Unscramble letters to reveal the vocabulary word.",
      how: "Read the clue, type the word, and check your answer. Use New word for another round.",
      kind: "scramble",
      words: [
        { word: "garden", clue: "A place where flowers and vegetables grow." },
        { word: "journey", clue: "A trip from one place to another." },
        { word: "library", clue: "A place where you can borrow books." },
      ],
    },
    "word-matching": {
      title: "Word Matching",
      intro: "Pair each English word with its meaning.",
      how: "Choose one word on the left and its meaning on the right. Match every pair to complete the round.",
      kind: "matching",
      pairs: [
        ["enormous", "very large"],
        ["assist", "to help"],
        ["rapid", "very fast"],
        ["silent", "making no sound"],
      ],
    },
    "missing-letters": {
      title: "Missing Letters",
      intro: "Complete each word by filling in the missing letters.",
      how: "Use the clue to identify the word, then type the complete spelling.",
      kind: "missing",
      words: [
        {
          word: "elephant",
          mask: "e _ e p h a n t",
          clue: "A very large animal with a trunk.",
        },
        {
          word: "mountain",
          mask: "m o u n _ a i n",
          clue: "A very high natural area of land.",
        },
        {
          word: "language",
          mask: "l a n g u a _ e",
          clue: "A system of words people use to communicate.",
        },
      ],
    },
    "anagram-challenge": {
      title: "Anagram Challenge",
      intro: "Rearrange the letters to make a new word.",
      how: "Use the clue and all the letters exactly once. Enter your answer to score a point.",
      kind: "scramble",
      words: [
        { word: "listen", clue: "An anagram of this word means ‘quiet’." },
        { word: "rescue", clue: "An anagram of this word means ‘secure’." },
        {
          word: "below",
          clue: "An anagram of this word means ‘a loud cry of sorrow’.",
        },
      ],
    },
    "spelling-bee": {
      title: "Spelling Bee",
      intro: "Listen to the clue in your mind, then spell the word.",
      how: "Read the definition, type the matching word, and check your spelling. Audio pronunciation can be added in a later version.",
      kind: "spelling",
      words: [
        { word: "beautiful", clue: "Pleasant to look at." },
        { word: "necessary", clue: "Needed or required." },
        { word: "surprise", clue: "An unexpected event or gift." },
      ],
    },
    "synonym-matching": {
      title: "Synonym Matching",
      intro: "Choose words with similar meanings.",
      how: "Read the prompt and select the closest synonym.",
      kind: "quiz",
    },
    "antonym-matching": {
      title: "Antonym Matching",
      intro: "Find the word with the opposite meaning.",
      how: "Read the prompt and select its antonym.",
      kind: "quiz",
    },
    "vocabulary-bingo": {
      title: "Vocabulary Bingo",
      intro: "Listen for a word and mark it on your card.",
      how: "Draw words one at a time and mark matching squares. Complete five in a row, column, or diagonal for BINGO.",
      kind: "bingo",
      words: [
        "apple",
        "brave",
        "cloud",
        "dance",
        "eager",
        "forest",
        "gentle",
        "honest",
        "island",
        "journey",
        "kind",
        "lantern",
        "mountain",
        "notice",
        "ocean",
        "patient",
        "quiet",
        "rapid",
        "silent",
        "travel",
        "useful",
        "valley",
        "whisper",
        "yellow",
        "zealous",
      ],
    },
    "20-questions": {
      title: "20 Questions",
      intro:
        "The computer chooses a mystery animal. Ask yes-or-no questions and use the clues to guess it.",
      how: "The computer secretly picks an animal. Choose from the question buttons to narrow down the possibilities. Each different question uses one of your 20 turns; guesses are free. Guess correctly to earn more points for solving it early.",
      kind: "twenty",
    },
    "name-five": {
      title: "Name 5",
      intro: "Can you name five things in the category before time runs out?",
      how: "Enter five different examples that fit the category. This starter round accepts any five non-empty answers.",
      kind: "name-five",
      category: "Things you might find in a classroom",
    },
    "prefix-suffix-challenge": {
      title: "Prefixes & Suffixes Challenge",
      intro: "Build new words by adding a prefix or suffix.",
      how: "Add the shown affix to the base word and check that the new word is spelled correctly.",
      kind: "affix",
      rounds: [
        {
          base: "kind",
          affix: "un-",
          answer: "unkind",
          clue: "Make the opposite of kind.",
        },
        {
          base: "hope",
          affix: "-ful",
          answer: "hopeful",
          clue: "Make an adjective meaning full of hope.",
        },
        {
          base: "teach",
          affix: "-er",
          answer: "teacher",
          clue: "Name a person who teaches.",
        },
      ],
    },
    "idioms-challenge": {
      title: "Idioms Challenge",
      intro: "Explore common English idioms and their meanings.",
      how: "Pick the meaning that best fits each expression.",
      kind: "quiz",
    },
    "phrasal-verb-challenge": {
      title: "Phrasal Verb Challenge",
      intro: "Match everyday phrasal verbs to their meanings.",
      how: "Choose the phrasal verb that matches the definition.",
      kind: "quiz",
    },
    "english-trivia": {
      title: "English Trivia",
      intro:
        "Test your knowledge of English grammar, spelling, and vocabulary.",
      how: "Answer the multiple-choice question. Read the explanation to learn from each round.",
      kind: "quiz",
    },
    "classroom-jeopardy": {
      title: "Classroom Jeopardy",
      intro: "Pick a clue, answer it, and keep score with your team.",
      how: "Choose a point tile. Reveal the answer, then award points for a correct team response.",
      kind: "jeopardy",
    },
    "battleship-grammar": {
      title: "Battleship Grammar",
      intro: "Answer a grammar question to fire at a coordinate.",
      how: "Choose a grid square and answer its grammar question. Correct answers fire; find all four hidden ship positions to win.",
      kind: "battleship",
    },
    "battleship-vocabulary": {
      title: "Battleship Vocabulary",
      intro: "Use vocabulary knowledge to find the hidden fleet.",
      how: "Choose a grid square and answer its word question. Correct answers fire; locate four hidden ship positions.",
      kind: "battleship",
    },
  };

  const esc = (text) =>
    String(text).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const root = document.querySelector("[data-game-root]");
  if (!root) return;
  const slug = document.body.dataset.game;
  const game = games[slug];
  if (!game) return;

  root.innerHTML = `
    <p class="breadcrumb"><a href="../games.html">Games</a> / <a href="../new-games.html">Prototype lab</a> / ${esc(game.title)}</p>
    <section class="hero"><p class="eyebrow">${slug === "20-questions" ? "Mystery animal" : "Free English practice · Starter edition"}</p><h1>${esc(game.title)}</h1><p>${slug === "20-questions" ? "Choose a category, ask for clues, then guess the animal." : esc(game.intro)}</p></section>
    <div class="content-grid">
      <section class="panel game-panel${slug === "20-questions" ? " tq-game-panel" : ""}" aria-labelledby="play-title"><div class="game-toolbar"><h2 id="play-title">Play a round</h2><span class="score" id="score" aria-live="polite">Score: 0</span></div><div class="game-content" id="game-content"></div><div class="controls"><button class="btn secondary" id="restart" type="button">Restart</button>${slug === "20-questions" ? '<button class="btn secondary tq-fullscreen-button" id="fullscreen-game" type="button" aria-pressed="false">⛶ Fullscreen · no ads</button>' : ""}</div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
      ${slug === "20-questions" ? "" : `<aside class="panel"><h2>How to play</h2><p class="hint">${esc(game.how)}</p><h2 style="margin-top:1.2rem">About this starter</h2><p class="hint">This is an early playable prototype. Question sets, visuals, and classroom features will grow in later versions.</p></aside>`}
    </div>`;

  const content = root.querySelector("#game-content");
  const scoreEl = root.querySelector("#score");
  const feedback = root.querySelector("#feedback");
  let score = 0;
  let round = 0;
  let state = {};
  const twentyLevels = [
    { level: 1, name: "Scout", maxQuestions: 20 },
    { level: 2, name: "Tracker", maxQuestions: 15 },
    { level: 3, name: "Expert", maxQuestions: 10 },
  ];
  let twentyWins = 0;
  let selectedTwentyLevel = 1;
  if (slug === "20-questions") {
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem("twentyQuestionsProgress") || "{}",
      );
      twentyWins = Math.max(0, Number(savedProgress.wins) || 0);
      selectedTwentyLevel = Math.min(
        twentyLevels.length,
        Math.max(1, Number(savedProgress.selectedLevel) || 1),
      );
    } catch {
      // Keep level progress for this page session when storage is unavailable.
    }
    selectedTwentyLevel = Math.min(
      selectedTwentyLevel,
      Math.min(twentyLevels.length, 1 + Math.floor(twentyWins / 2)),
    );
  }
  const setFeedback = (message, kind = "info") => {
    feedback.textContent = message;
    feedback.dataset.kind = kind;
  };
  const setScore = (value) => {
    score = value;
    scoreEl.textContent = `Score: ${score}`;
  };
  const addPoint = (points = 1) => setScore(score + points);

  function unlockedTwentyLevel() {
    return Math.min(twentyLevels.length, 1 + Math.floor(twentyWins / 2));
  }

  function updateTwentyLevelControls() {
    if (slug !== "20-questions") return;
    const unlocked = unlockedTwentyLevel();
    if (selectedTwentyLevel > unlocked) selectedTwentyLevel = unlocked;
    content.querySelectorAll("[data-level]").forEach((button) => {
      const level = Number(button.dataset.level);
      button.disabled = level > unlocked;
      button.setAttribute(
        "aria-pressed",
        String(level === selectedTwentyLevel),
      );
      button.classList.toggle("is-selected", level === selectedTwentyLevel);
    });
    const status = content.querySelector("#tq-level-status");
    if (status) {
      const nextLevel = twentyLevels[selectedTwentyLevel - 1];
      const currentLevel = state.level || selectedTwentyLevel;
      const highestUnlocked = unlockedTwentyLevel();
      const unlockProgress =
        highestUnlocked < twentyLevels.length
          ? `${2 - (twentyWins % 2)} more solve${2 - (twentyWins % 2) === 1 ? "" : "s"} to unlock Level ${highestUnlocked + 1}`
          : "All levels unlocked";
      status.textContent =
        state.questions > 0 &&
        !state.finished &&
        currentLevel !== selectedTwentyLevel
          ? `Current round: Level ${currentLevel}. Next round: Level ${selectedTwentyLevel} · ${nextLevel.maxQuestions} questions.`
          : `Level ${selectedTwentyLevel} · ${nextLevel.maxQuestions} questions · ${unlockProgress}`;
    }
    const nextRound = content.querySelector("[data-action='next-round']");
    if (nextRound) {
      const nextLevel = twentyLevels[selectedTwentyLevel - 1];
      nextRound.textContent =
        selectedTwentyLevel === (state.level || selectedTwentyLevel)
          ? `Next animal · Level ${selectedTwentyLevel}`
          : `Start Level ${selectedTwentyLevel}`;
      nextRound.setAttribute(
        "aria-label",
        `Start the next round at Level ${selectedTwentyLevel}, ${nextLevel.name}`,
      );
    }
  }

  function selectTwentyLevel(level) {
    if (level > unlockedTwentyLevel()) return;
    selectedTwentyLevel = level;
    const levelInfo = twentyLevels[level - 1];
    if (state.questions === 0 && !state.finished) {
      state.level = level;
      state.maxQuestions = levelInfo.maxQuestions;
      content.querySelector("#question-limit").textContent =
        levelInfo.maxQuestions;
      const progress = content.querySelector(".tq-meter-track");
      progress.setAttribute("aria-valuemax", String(levelInfo.maxQuestions));
      content.querySelector("#question-progress").style.width = "0%";
    }
    try {
      localStorage.setItem(
        "twentyQuestionsProgress",
        JSON.stringify({ wins: twentyWins, selectedLevel }),
      );
    } catch {
      // Level selection still works for the current page session.
    }
    updateTwentyLevelControls();
  }

  function recordTwentyWin() {
    const previousUnlockedLevel = unlockedTwentyLevel();
    twentyWins++;
    const newlyUnlockedLevel = unlockedTwentyLevel();
    const levelUnlocked = newlyUnlockedLevel > previousUnlockedLevel;
    if (levelUnlocked) selectedTwentyLevel = newlyUnlockedLevel;
    try {
      localStorage.setItem(
        "twentyQuestionsProgress",
        JSON.stringify({
          wins: twentyWins,
          selectedLevel: selectedTwentyLevel,
        }),
      );
    } catch {
      // Round progress still applies for the current page session.
    }
    updateTwentyLevelControls();
    return levelUnlocked;
  }

  function showTwentyRoundEnd(message) {
    content.querySelector("#tq-round-end-message").textContent = message;
    content.querySelector("#tq-round-end").hidden = false;
    updateTwentyLevelControls();
    content.querySelector("[data-action='next-round']").focus();
  }

  function render() {
    feedback.textContent = "";
    feedback.dataset.kind = "info";
    if (slug === "20-questions") {
      root.querySelector("#restart").textContent = "New animal";
    }
    if (game.kind === "word-search") renderWordSearch();
    else if (game.kind === "scramble") renderScramble();
    else if (game.kind === "matching") renderMatching();
    else if (game.kind === "missing" || game.kind === "spelling")
      renderMissing();
    else if (game.kind === "quiz") renderQuiz();
    else if (game.kind === "bingo") renderBingo();
    else if (game.kind === "twenty") renderTwenty();
    else if (game.kind === "name-five") renderNameFive();
    else if (game.kind === "affix") renderAffix();
    else if (game.kind === "jeopardy") renderJeopardy();
    else if (game.kind === "battleship") renderBattleship();
  }

  function renderWordSearch() {
    const words = ["WORD", "PLAY", "LEARN", "BOOK", "GAME"];
    const size = 8;
    const grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      ),
    );
    words.forEach((word, row) => {
      const start = Math.floor(Math.random() * (size - word.length + 1));
      [...word].forEach((letter, col) => {
        grid[row][start + col] = letter;
      });
    });
    state.words = words;
    state.grid = grid;
    state.selected = [];
    content.innerHTML = `<p class="hint">Find: <strong>${words.join(" · ")}</strong></p><div class="letter-grid" role="group" aria-label="Word search letter grid">${grid.flatMap((row, r) => row.map((letter, c) => `<button type="button" class="letter-cell" data-row="${r}" data-col="${c}" aria-label="Row ${r + 1}, column ${c + 1}: ${letter}">${letter}</button>`)).join("")}</div><p class="hint" id="selected-word">Selected letters: none</p><div class="answer-row"><button class="btn" type="button" data-action="check-word">Check word</button><button class="btn secondary" type="button" data-action="clear-word">Clear selection</button></div>`;
  }

  function renderScramble() {
    const item =
      game.kind === "affix"
        ? game.rounds[round % game.rounds.length]
        : game.words[round % game.words.length];
    state.answer = item.word || item.answer;
    const letters = [...state.answer.toUpperCase()];
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    if (letters.join("") === state.answer.toUpperCase()) letters.reverse();
    content.innerHTML = `<p class="prompt">${esc(item.clue)}</p><p class="hint">Letters: <strong>${letters.join(" · ")}</strong></p><label class="hint" for="answer">Your answer</label><input id="answer" type="text" autocomplete="off" spellcheck="false" aria-describedby="answer-help"><p class="hint" id="answer-help">Use every letter once.</p><div class="answer-row"><button class="btn" type="button" data-action="check-answer">Check answer</button><button class="btn secondary" type="button" data-action="next">New word</button></div>`;
  }

  function renderMissing() {
    const list = game.words;
    const item = list[round % list.length];
    state.answer = item.word;
    content.innerHTML = `<p class="prompt">${esc(item.clue)}</p><p class="hint">Complete: <strong>${esc(item.mask || "Spell the word")}</strong></p><label class="hint" for="answer">Complete word</label><input id="answer" type="text" autocomplete="off" spellcheck="false"><div class="answer-row"><button class="btn" type="button" data-action="check-answer">Check</button><button class="btn secondary" type="button" data-action="next">Next word</button></div>`;
  }

  function renderMatching() {
    const pairs = game.pairs;
    const meanings = pairs
      .map((pair) => pair[1])
      .sort(() => Math.random() - 0.5);
    state.pairs = pairs;
    state.meanings = meanings;
    state.selectedWord = null;
    state.matched = new Set();
    content.innerHTML = `<p class="hint">Select a word and its matching meaning.</p><div class="pair-grid"><div class="pair-column">${pairs.map(([word]) => `<button type="button" class="word-tile" data-word="${esc(word)}">${esc(word)}</button>`).join("")}</div><div class="pair-column">${meanings.map((meaning) => `<button type="button" class="word-tile" data-meaning="${esc(meaning)}">${esc(meaning)}</button>`).join("")}</div></div>`;
  }

  function renderQuiz() {
    const questions = quizSets[slug];
    const item = questions[round % questions.length];
    state.answer = item.answer;
    content.innerHTML = `<p class="prompt">${item.q}</p><div class="choice-list">${item.options.map((option) => `<button type="button" class="choice" data-choice="${esc(option)}">${esc(option)}</button>`).join("")}</div>`;
  }

  function renderBingo() {
    const shuffled = [...game.words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 25);
    state.words = shuffled;
    state.marked = new Set();
    state.called = null;
    state.remainingCalls = [...shuffled].sort(() => Math.random() - 0.5);
    content.innerHTML = `<p class="prompt">Called word: <strong id="called-word">Press Draw a word</strong></p><div class="bingo-grid">${shuffled.map((word, i) => `<button class="bingo-cell" type="button" data-bingo="${esc(word)}" aria-label="Bingo square ${i + 1}: ${esc(word)}">${esc(word)}</button>`).join("")}</div><button class="btn" type="button" data-action="draw-word">Draw a word</button>`;
  }

  function renderTwenty() {
    const animals = [
      {
        name: "elephant",
        traits: {
          water: false,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: true,
          mammal: true,
          legs: true,
          big: true,
          eggs: false,
          swim: true,
          dangerous: true,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "dolphin",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: true,
          legs: false,
          big: true,
          eggs: false,
          swim: true,
          dangerous: false,
          land: false,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "penguin",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: false,
          big: false,
          eggs: true,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: false,
          wings: true,
          feathers: true,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "tiger",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: true,
          pet: false,
          trunk: false,
          mammal: true,
          legs: true,
          big: true,
          eggs: false,
          swim: true,
          dangerous: true,
          land: true,
          africa: false,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "cat",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: true,
          trunk: false,
          mammal: true,
          legs: true,
          big: false,
          eggs: false,
          swim: false,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "eagle",
        traits: {
          water: false,
          fly: true,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: false,
          big: false,
          eggs: true,
          swim: false,
          dangerous: true,
          land: true,
          africa: true,
          asia: true,
          wings: true,
          feathers: true,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "frog",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: true,
          big: false,
          eggs: true,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: false,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "giraffe",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: true,
          legs: true,
          big: true,
          eggs: false,
          swim: false,
          dangerous: false,
          land: true,
          africa: true,
          asia: false,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "turtle",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: true,
          trunk: false,
          mammal: false,
          legs: true,
          big: false,
          eggs: true,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: true,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "dog",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: true,
          trunk: false,
          mammal: true,
          legs: true,
          big: false,
          eggs: false,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: true,
        },
      },
      {
        name: "lion",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: true,
          legs: true,
          big: true,
          eggs: false,
          swim: true,
          dangerous: true,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "zebra",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: true,
          pet: false,
          trunk: false,
          mammal: true,
          legs: true,
          big: true,
          eggs: false,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: false,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "shark",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: false,
          big: true,
          eggs: false,
          swim: true,
          dangerous: true,
          land: false,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "snake",
        traits: {
          water: false,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: false,
          big: false,
          eggs: true,
          swim: true,
          dangerous: true,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "monkey",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: true,
          legs: true,
          big: false,
          eggs: false,
          swim: true,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "rabbit",
        traits: {
          water: false,
          fly: false,
          fur: true,
          stripes: false,
          pet: true,
          trunk: false,
          mammal: true,
          legs: true,
          big: false,
          eggs: false,
          swim: false,
          dangerous: false,
          land: true,
          africa: false,
          asia: false,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
      {
        name: "crocodile",
        traits: {
          water: true,
          fly: false,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: true,
          big: true,
          eggs: true,
          swim: true,
          dangerous: true,
          land: true,
          africa: true,
          asia: true,
          wings: false,
          feathers: false,
          tail: true,
          shell: false,
          carnivore: true,
          herbivore: false,
        },
      },
      {
        name: "butterfly",
        traits: {
          water: false,
          fly: true,
          fur: false,
          stripes: false,
          pet: false,
          trunk: false,
          mammal: false,
          legs: false,
          big: false,
          eggs: true,
          swim: false,
          dangerous: false,
          land: true,
          africa: true,
          asia: true,
          wings: true,
          feathers: false,
          tail: false,
          shell: false,
          carnivore: false,
          herbivore: true,
        },
      },
    ];
    const birds = new Set(["penguin", "eagle"]);
    const insects = new Set(["butterfly"]);
    animals.forEach((animal) => {
      animal.traits.bird = birds.has(animal.name);
      animal.traits.insect = insects.has(animal.name);
    });
    state.animals = animals;
    state.targetAnimal = animals[Math.floor(Math.random() * animals.length)];
    state.target = state.targetAnimal.name;
    state.questions = 0;
    state.guessed = false;
    state.finished = false;
    state.askedTopics = new Set();
    state.clues = [];
    state.guessedAnimals = new Set();
    state.level = selectedTwentyLevel;
    state.maxQuestions = twentyLevels[state.level - 1].maxQuestions;
    const levelButtons = twentyLevels
      .map(
        (level) =>
          `<button type="button" class="tq-level-choice${level.level === selectedTwentyLevel ? " is-selected" : ""}" data-level="${level.level}" aria-pressed="${level.level === selectedTwentyLevel}" ${level.level > unlockedTwentyLevel() ? "disabled" : ""}><span>LEVEL ${level.level}</span><strong>${level.name}</strong><small>${level.maxQuestions} questions</small></button>`,
      )
      .join("");
    const questionIdeas = {
      "Body and appearance": [
        "Can it fly?",
        "Does it have wings?",
        "Does it have feathers?",
        "Does it have fur?",
        "Does it have stripes?",
        "Does it have a tail?",
        "Does it have a shell?",
        "Does it have a trunk?",
        "Does it have four legs?",
      ],
      "Home and habits": [
        "Does it live in water?",
        "Can it swim?",
        "Is it a pet?",
      ],
      "Animal facts": [
        "Is it a bird?",
        "Is it an insect?",
        "Is it a mammal?",
        "Is it bigger than a person?",
        "Does it lay eggs?",
        "Is it dangerous?",
        "Does it eat meat?",
        "Does it eat plants?",
      ],
    };
    const questionGuide = Object.entries(questionIdeas)
      .map(
        ([category, questions]) =>
          `<details class="tq-guide-group" name="tq-question-categories"><summary><span>${esc(category)}</span><span class="tq-category-count">${questions.length} questions</span></summary><div class="tq-guide-questions">${questions
            .map(
              (question) =>
                `<button type="button" class="tq-question-choice" data-question="${esc(question)}" aria-pressed="false">${esc(question)}</button>`,
            )
            .join("")}</div></details>`,
      )
      .join("");
    const animalChoices = animals
      .map(
        (animal) =>
          `<button type="button" class="tq-animal-choice" data-guess="${esc(animal.name)}" aria-label="Guess ${esc(animalLabel(animal.name))}"><span aria-hidden="true">${animalEmoji(animal.name)}</span><span>${esc(animal.name)}</span></button>`,
      )
      .join("");
    content.innerHTML = `
      <div class="tq-game">
        <div class="tq-game-top"><span class="tq-pill"><span aria-hidden="true">🐾</span> ANIMAL MYSTERY</span><span class="tq-round">ROUND ${round + 1}</span></div>
        <section class="tq-level-panel" aria-label="Challenge levels">
          <div class="tq-level-heading"><strong>Choose your level</strong><span>Win twice to unlock the next challenge</span></div>
          <div class="tq-level-options">${levelButtons}</div>
          <p id="tq-level-status" aria-live="polite">Level ${selectedTwentyLevel} · ${state.maxQuestions} questions · ${twentyWins} solved</p>
        </section>
        <div class="tq-intro-row">
          <div class="tq-mystery" id="mystery-reveal" aria-hidden="true"><span class="tq-sparkle">✦</span><span class="tq-animal">🐾</span><span class="tq-lock">?</span><span class="tq-sparkle tq-sparkle-two">✦</span></div>
          <div class="tq-intro-copy">
            <h3 class="tq-prompt">The computer picked an animal…</h3>
            <p class="tq-subprompt">Ask about its features and use each clue to narrow the list.</p>
          </div>
        </div>
        <div class="tq-meter" aria-label="Questions used">
          <div class="tq-meter-label"><span>Questions used</span><strong><span id="question-count">0</span> / <span id="question-limit">${state.maxQuestions}</span></strong></div>
          <div class="tq-meter-track" role="progressbar" aria-label="Questions used" aria-valuemin="0" aria-valuemax="${state.maxQuestions}" aria-valuenow="0"><span id="question-progress"></span></div>
          <p class="tq-candidate-count" id="candidate-count" aria-live="polite">Possible animals that fit the clues: ${animals.length}</p>
        </div>
        <div class="tq-ask-box">
          <h4 class="tq-choice-heading">Choose a question category <span>Open one category, then tap a question</span></h4>
          <p class="tq-field-help">“Yes” means the animal has the feature; “No” means it does not. Each question can be asked once.</p>
          <div class="tq-guide-groups">${questionGuide}</div>
        </div>
        <div class="tq-clue" id="reply" role="status" aria-live="polite"><span class="tq-clue-icon" aria-hidden="true">💭</span><span>Your mystery animal is ready. Ask your first question.</span></div>
        <ol class="tq-clue-log" id="clue-log" aria-label="Question and answer history"></ol>
        <details class="tq-guess-box" id="tq-guess-options">
          <summary class="tq-choice-heading">Ready to guess? <span>Open the animal list · guesses are free</span></summary>
          <p class="tq-field-help">A wrong guess does not use a question. Try another animal.</p>
          <div class="tq-animal-choices" aria-label="Choose an animal to guess">${animalChoices}</div>
          <button class="tq-reveal-button" type="button" data-action="give-up">Give up and reveal the animal</button>
        </details>
        <section class="tq-round-end" id="tq-round-end" aria-live="polite" hidden>
          <p id="tq-round-end-message"></p>
          <button class="tq-next-round" type="button" data-action="next-round">Next animal · Level ${selectedTwentyLevel}</button>
        </section>
        <p class="tq-footnote">Animal facts are simplified for the game. Some real species vary.</p>
      </div>`;
    updateTwentyLevelControls();
  }

  function renderNameFive() {
    content.innerHTML = `<p class="prompt">${esc(game.category)}</p><label class="hint" for="five-answers">Enter one answer per line.</label><textarea id="five-answers" placeholder="pencil&#10;desk&#10;..." rows="6"></textarea><div class="answer-row"><button type="button" class="btn" data-action="check-five">Check my five</button></div>`;
  }

  function renderAffix() {
    const item = game.rounds[round % game.rounds.length];
    state.answer = item.answer;
    content.innerHTML = `<p class="prompt">${esc(item.clue)}</p><p class="hint">Base word: <strong>${esc(item.base)}</strong> &nbsp; Add: <strong>${esc(item.affix)}</strong></p><label class="hint" for="answer">New word</label><input id="answer" type="text" autocomplete="off"><div class="answer-row"><button class="btn" type="button" data-action="check-answer">Check</button><button class="btn secondary" type="button" data-action="next">Next challenge</button></div>`;
  }

  function renderJeopardy() {
    const categories = ["Grammar", "Vocabulary", "Idioms", "Spelling"];
    const questions = quizSets[slug];
    state.used = state.used || new Set();
    content.innerHTML = `<p class="hint">Choose a point value. Keep score with your team.</p><div class="jep-grid">${categories.map((category) => `<strong class="hint">${category}</strong>`).join("")}${questions.map((item, i) => `<button type="button" class="btn jep-tile" data-jeopardy="${i}" ${state.used.has(i) ? "disabled" : ""}>${item.points}</button>`).join("")}</div><div id="clue-area" class="panel" style="margin-top:1rem" hidden></div>`;
  }

  function renderBattleship() {
    const size = 5;
    state.ships =
      state.ships ||
      new Set(
        Array.from({ length: size * size }, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4),
      );
    state.shots = state.shots || new Set();
    state.pending = null;
    const cells = Array.from(
      { length: size * size },
      (_, i) =>
        `<button type="button" class="battle-cell" data-coordinate="${i}" ${state.shots.has(i) ? "disabled" : ""} aria-label="Fire at row ${Math.floor(i / size) + 1}, column ${(i % size) + 1}">${String.fromCharCode(65 + Math.floor(i / size))}${(i % size) + 1}${state.shots.has(i) ? (state.ships.has(i) ? " ✓" : " ·") : ""}</button>`,
    ).join("");
    content.innerHTML = `<p class="hint">Select a square to target. Ships found: <strong>${[...state.shots].filter((i) => state.ships.has(i)).length}</strong> / 4</p><div class="battle-grid">${cells}</div><div id="battle-question" class="panel" hidden></div>`;
  }

  function handleAction(target) {
    const action = target.dataset.action;
    if (action === "check-word") {
      const answer = state.selected
        .map(({ row, col }) => state.grid[row][col])
        .join("");
      if (state.words.includes(answer)) {
        addPoint();
        setFeedback(`Found ${answer}!`, "success");
        state.words = state.words.filter((word) => word !== answer);
        state.selected.forEach(({ row, col }) =>
          content
            .querySelector(`[data-row="${row}"][data-col="${col}"]`)
            ?.classList.add("matched"),
        );
        content.querySelector("#selected-word").textContent = state.words.length
          ? `Still to find: ${state.words.join(", ")}`
          : "All words found — excellent!";
      } else
        setFeedback(
          "Those letters do not spell a target word yet. Try a horizontal word.",
          "error",
        );
    } else if (action === "clear-word") {
      state.selected = [];
      content
        .querySelectorAll(".letter-cell.selected")
        .forEach((cell) => cell.classList.remove("selected"));
      content.querySelector("#selected-word").textContent =
        "Selected letters: none";
    } else if (action === "check-answer") {
      checkTextAnswer();
    } else if (action === "next") {
      round++;
      render();
    } else if (action === "next-round") {
      round++;
      state = {};
      render();
    } else if (action === "draw-word") drawBingoWord();
    else if (action === "give-up")
      finishTwenty(`The mystery animal was ${animalLabel(state.target)}.`);
    else if (action === "check-five") checkFive();
  }

  function checkTextAnswer() {
    const input = content.querySelector("#answer");
    const answer = (input?.value || "").trim().toLowerCase();
    if (!answer) {
      setFeedback("Type an answer first.", "error");
      input?.focus();
      return;
    }
    if (answer === String(state.answer).toLowerCase()) {
      addPoint();
      setFeedback("Correct! Nice work.", "success");
      round++;
    } else setFeedback("Not quite. Check the clue and try again.", "error");
  }

  function handleClick(event) {
    const target = event.target.closest("button");
    if (!target || !content.contains(target)) return;
    if (target.dataset.level) {
      selectTwentyLevel(Number(target.dataset.level));
      return;
    }
    if (target.dataset.question) {
      askQuestion(target.dataset.question);
      return;
    }
    if (target.dataset.guess) {
      guessWord(target.dataset.guess);
      return;
    }
    if (target.dataset.action) {
      handleAction(target);
      return;
    }
    if (target.dataset.row !== undefined) {
      const cell = target;
      const coord = {
        row: Number(cell.dataset.row),
        col: Number(cell.dataset.col),
      };
      if (cell.classList.contains("matched")) return;
      const found = state.selected.findIndex(
        (item) => item.row === coord.row && item.col === coord.col,
      );
      if (found >= 0) state.selected.splice(found, 1);
      else state.selected.push(coord);
      cell.classList.toggle("selected", found < 0);
      content.querySelector("#selected-word").textContent =
        `Selected letters: ${state.selected.map(({ row, col }) => state.grid[row][col]).join("") || "none"}`;
      return;
    }
    if (target.dataset.word) {
      state.selectedWord = target.dataset.word;
      content
        .querySelectorAll("[data-word]")
        .forEach((tile) => tile.classList.toggle("selected", tile === target));
      checkMatch();
      return;
    }
    if (target.dataset.meaning) {
      state.selectedMeaning = target.dataset.meaning;
      content
        .querySelectorAll("[data-meaning]")
        .forEach((tile) => tile.classList.toggle("selected", tile === target));
      checkMatch();
      return;
    }
    if (target.dataset.choice) {
      const item = quizSets[slug][round % quizSets[slug].length];
      if (target.dataset.choice === item.answer) {
        addPoint();
        setFeedback(item.explain || "Correct!", "success");
        round++;
        setTimeout(render, 650);
      } else {
        setFeedback("Not quite. Try another choice.", "error");
        target.disabled = true;
      }
      return;
    }
    if (target.dataset.bingo) {
      markBingo(target);
      return;
    }
    if (target.dataset.jeopardy !== undefined) {
      showClue(Number(target.dataset.jeopardy));
      return;
    }
    if (target.dataset.coordinate !== undefined) {
      showBattleQuestion(Number(target.dataset.coordinate));
      return;
    }
  }

  function checkMatch() {
    if (!state.selectedWord || !state.selectedMeaning) return;
    const pair = state.pairs.find(([word]) => word === state.selectedWord);
    if (pair && pair[1] === state.selectedMeaning) {
      state.matched.add(state.selectedWord);
      addPoint();
      content
        .querySelector(`[data-word="${CSS.escape(state.selectedWord)}"]`)
        ?.classList.add("matched");
      content
        .querySelector(`[data-meaning="${CSS.escape(state.selectedMeaning)}"]`)
        ?.classList.add("matched");
      setFeedback(
        state.matched.size === state.pairs.length
          ? "All pairs matched!"
          : "Correct match!",
        "success",
      );
      state.selectedWord = null;
      state.selectedMeaning = null;
    } else {
      setFeedback("Those do not match. Try a different meaning.", "error");
      state.selectedWord = null;
      state.selectedMeaning = null;
      content
        .querySelectorAll(".word-tile.selected")
        .forEach((tile) => tile.classList.remove("selected"));
    }
  }

  function drawBingoWord() {
    if (!state.remainingCalls.length) {
      setFeedback(
        "No words left in this starter draw pile. Restart to play again.",
        "error",
      );
      return;
    }
    state.called = state.remainingCalls.pop();
    content.querySelector("#called-word").textContent = state.called;
    content
      .querySelectorAll(".bingo-cell")
      .forEach((cell) =>
        cell.classList.toggle("selected", cell.dataset.bingo === state.called),
      );
  }

  function markBingo(cell) {
    if (!state.called) {
      setFeedback("Draw a word first.", "error");
      return;
    }
    if (cell.dataset.bingo !== state.called) {
      setFeedback("That square is not the called word.", "error");
      return;
    }
    cell.classList.add("marked");
    cell.disabled = true;
    state.marked.add(
      Number(Array.from(content.querySelectorAll(".bingo-cell")).indexOf(cell)),
    );
    addPoint();
    if (hasBingo()) setFeedback("BINGO! You completed a line!", "success");
    else setFeedback(`Marked ${state.called}. Draw the next word.`, "success");
  }

  function hasBingo() {
    const lines = [];
    for (let i = 0; i < 5; i++) {
      lines.push(Array.from({ length: 5 }, (_, j) => i * 5 + j));
      lines.push(Array.from({ length: 5 }, (_, j) => j * 5 + i));
    }
    lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
    return lines.some((line) => line.every((index) => state.marked.has(index)));
  }

  function askQuestion(questionText) {
    const question = questionText.trim().toLowerCase();
    if (state.finished) {
      setFeedback(
        "This round is finished. Choose New animal to play again.",
        "error",
      );
      return;
    }
    if (state.questions >= state.maxQuestions) {
      finishTwenty(
        `You’ve used all ${state.maxQuestions} questions! The animal was ` +
          animalLabel(state.target) +
          ".",
      );
      return;
    }
    const topics = [
      {
        key: "water",
        patterns: [
          /live.*(water|ocean|sea|river|lake)/,
          /(water|ocean|sea|river|lake).*(live|habitat)/,
        ],
        yes: "It lives in water.",
        no: "It doesn’t live in water.",
      },
      {
        key: "fly",
        patterns: [
          /\b(can|does|is able to)\b.*\b(fly|flying)\b/,
          /\b(fly|flying)\b/,
        ],
        yes: "It can fly.",
        no: "It can’t fly.",
      },
      {
        key: "wings",
        patterns: [/\b(wings|wing)\b/],
        yes: "It has wings.",
        no: "It doesn’t have wings.",
      },
      {
        key: "feathers",
        patterns: [/\b(feather|feathers)\b/],
        yes: "It has feathers.",
        no: "It doesn’t have feathers.",
      },
      {
        key: "tail",
        patterns: [/\b(tail|tails)\b/],
        yes: "It has a tail.",
        no: "It doesn’t have a tail.",
      },
      {
        key: "shell",
        patterns: [/\b(shell|shells)\b/],
        yes: "It has a shell.",
        no: "It doesn’t have a shell.",
      },
      {
        key: "fur",
        patterns: [/\b(fur|hair|furry)\b/],
        yes: "It has fur.",
        no: "It doesn’t have fur.",
      },
      {
        key: "stripes",
        patterns: [/\b(stripe|stripes|striped)\b/],
        yes: "It has stripes.",
        no: "It doesn’t have stripes.",
      },
      {
        key: "pet",
        patterns: [/\b(pet|domestic|live with people|live in a house)\b/],
        yes: "It can be a pet.",
        no: "It isn’t usually a pet.",
      },
      {
        key: "trunk",
        patterns: [/\b(trunk)\b/],
        yes: "It has a trunk.",
        no: "It doesn’t have a trunk.",
      },
      {
        key: "bird",
        patterns: [/\b(bird|birds)\b/],
        yes: "It is a bird.",
        no: "It isn’t a bird.",
      },
      {
        key: "insect",
        patterns: [/\b(insect|insects|bug|bugs)\b/],
        yes: "It is an insect.",
        no: "It isn’t an insect.",
      },
      {
        key: "mammal",
        patterns: [/\b(mammal|mammals)\b/],
        yes: "It is a mammal.",
        no: "It isn’t a mammal.",
      },
      {
        key: "legs",
        patterns: [/\b(four|4)\s+legs\b/, /\b(all four)\s+legs\b/],
        yes: "It has four legs.",
        no: "It doesn’t have four legs.",
      },
      {
        key: "big",
        patterns: [/\b(bigger|larger)\s+than\s+(a\s+)?(person|human|people)\b/],
        yes: "It is bigger than a person.",
        no: "It isn’t bigger than a person.",
      },
      {
        key: "eggs",
        patterns: [/\b(egg|eggs|lay eggs)\b/],
        yes: "It lays eggs.",
        no: "It doesn’t lay eggs.",
      },
      {
        key: "swim",
        patterns: [
          /\b(can|does|is able to)\b.*\b(swim|swimming)\b/,
          /\b(swim|swimming)\b/,
        ],
        yes: "It can swim.",
        no: "It cannot swim.",
      },
      {
        key: "dangerous",
        patterns: [/\b(dangerous|danger|scary)\b/],
        yes: "It can be dangerous to people.",
        no: "It isn’t usually dangerous to people.",
      },
      {
        key: "diet",
        patterns: [/\b(meat|carnivore|eat other animals|prey)\b/],
        yes: "It eats other animals.",
        no: "It doesn’t usually eat other animals.",
        trait: "carnivore",
      },
      {
        key: "plant-diet",
        patterns: [/\b(plant|plants|grass|leaves|herbivore|herbivores)\b/],
        yes: "It eats plants.",
        no: "It doesn’t usually eat plants.",
        trait: "herbivore",
      },
    ];
    const topic = topics.find((candidate) =>
      candidate.patterns.some((pattern) => pattern.test(question)),
    );
    if (!topic) {
      setFeedback(
        "Choose one of the question buttons shown above. This did not use a turn.",
        "info",
      );
      return;
    }
    if (
      /\b(no|not|never|cannot|can't|doesn't|isn't|aren't|don't)\b/.test(
        question,
      )
    ) {
      setFeedback(
        "Try asking the question in a positive form, like “Can it fly?”",
        "info",
      );
      return;
    }
    if (state.askedTopics.has(topic.key)) {
      setFeedback(
        "You already asked about that clue. Try a different feature.",
        "info",
      );
      return;
    }
    const askedQuestion = questionText;
    state.questions++;
    state.askedTopics.add(topic.key);
    const trait = topic.trait || topic.key;
    const isYes = Boolean(state.targetAnimal.traits[trait]);
    const matchesClue = (animal) => Boolean(animal.traits[trait]);
    state.clues.push({ askedQuestion, topic, isYes, matchesClue });
    const answer = isYes ? "Yes" : "No";
    const detail = isYes ? topic.yes : topic.no;
    content.querySelector("#question-count").textContent = state.questions;
    const progress = content.querySelector("#question-progress");
    progress.style.width = `${(state.questions / state.maxQuestions) * 100}%`;
    progress.parentElement.setAttribute(
      "aria-valuenow",
      String(state.questions),
    );
    content.querySelector("#reply").innerHTML =
      `<span class="tq-clue-icon" aria-hidden="true">${answer === "Yes" ? "✅" : "🙅"}</span><span><strong>${answer}!</strong> ${esc(detail)}<small>Clue ${state.questions} of ${state.maxQuestions}</small></span>`;
    const clue = document.createElement("li");
    clue.innerHTML = `<span class="tq-log-question">${esc(askedQuestion)}</span><span class="tq-log-answer ${answer === "Yes" ? "is-yes" : "is-no"}">${answer}</span><span class="tq-log-detail">${esc(detail)}</span>`;
    content.querySelector("#clue-log").prepend(clue);
    const possibleAnimals = state.animals.filter(
      (animal) =>
        !state.guessedAnimals.has(animal.name) &&
        state.clues.every((clue) => clue.matchesClue(animal) === clue.isYes),
    );
    const candidateCount = content.querySelector("#candidate-count");
    candidateCount.textContent =
      possibleAnimals.length === 1
        ? "Possible animals that fit the clues: 1 — you may have enough clues to guess!"
        : `Possible animals that fit the clues: ${possibleAnimals.length}`;
    if (possibleAnimals.length === 1) {
      content.querySelectorAll(".tq-guide-group").forEach((category) => {
        category.open = false;
      });
      content.querySelector("#tq-guess-options").open = true;
    }
    const questionButton = content.querySelector(
      `[data-question="${CSS.escape(questionText)}"]`,
    );
    questionButton.disabled = true;
    questionButton.classList.add("is-asked");
    questionButton.setAttribute("aria-pressed", "true");
    questionButton.textContent = `${questionText} ✓`;
    if (state.questions >= state.maxQuestions) {
      content.querySelectorAll("[data-question]").forEach((control) => {
        control.disabled = true;
      });
      content.querySelectorAll(".tq-guide-group").forEach((category) => {
        category.open = false;
      });
      content.querySelector("#tq-guess-options").open = true;
      setFeedback(
        `That was your final question for Level ${state.level}. Make your free guess, or reveal the answer.`,
        "info",
      );
      content.querySelector("[data-action='give-up']").focus();
    }
  }

  function guessWord(guessText) {
    const guess = guessText.toLowerCase();
    if (state.finished) {
      setFeedback(
        "This round is finished. Choose New animal to play again.",
        "error",
      );
      return;
    }
    if (state.guessedAnimals.has(guess)) {
      return;
    }
    if (guess === state.target) {
      const pointsEarned = Math.max(1, state.maxQuestions - state.questions);
      addPoint(pointsEarned);
      state.guessed = true;
      state.finished = true;
      content
        .querySelector("#mystery-reveal")
        .setAttribute("aria-hidden", "false");
      content.querySelector("#mystery-reveal .tq-animal").textContent =
        animalEmoji(state.target);
      content.querySelector("#mystery-reveal .tq-lock").textContent = "✓";
      content.querySelector(".tq-game").classList.add("is-solved");
      content.querySelector("#candidate-count").textContent =
        "Possible animals that fit the clues: 1 — mystery solved!";
      content.querySelector("#reply").innerHTML =
        `<span class="tq-clue-icon" aria-hidden="true">🎉</span><span><strong>You got it!</strong> The mystery animal was ${esc(animalLabel(state.target))}!<small>Great guessing — round complete!</small></span>`;
      setFeedback(`Mystery solved! +${pointsEarned} points`, "success");
      content
        .querySelectorAll(
          "[data-question], [data-guess], [data-action='give-up']",
        )
        .forEach((control) => {
          control.disabled = true;
        });
      const levelUnlocked = recordTwentyWin();
      showTwentyRoundEnd(
        levelUnlocked
          ? `Level ${selectedTwentyLevel} unlocked! Choose your next challenge.`
          : "Animal solved! Ready for another round?",
      );
    } else {
      state.guessedAnimals.add(guess);
      const guessButton = content.querySelector(
        `[data-guess="${CSS.escape(guess)}"]`,
      );
      guessButton.disabled = true;
      guessButton.classList.add("is-wrong");
      guessButton.setAttribute(
        "aria-label",
        `${animalLabel(guess)} was not the mystery animal.`,
      );
      content.querySelector("#reply").innerHTML =
        `<span class="tq-clue-icon" aria-hidden="true">🤔</span><span><strong>Not ${esc(animalLabel(guess))} this time.</strong> Keep collecting clues and try another guess.<small>Your secret animal is still hidden!</small></span>`;
      const possibleAnimals = state.animals.filter(
        (animal) =>
          !state.guessedAnimals.has(animal.name) &&
          state.clues.every((clue) => clue.matchesClue(animal) === clue.isYes),
      );
      content.querySelector("#candidate-count").textContent =
        possibleAnimals.length === 1
          ? "Possible animals that fit the clues: 1 — you may have enough clues to guess!"
          : `Possible animals that fit the clues: ${possibleAnimals.length}`;
      setFeedback("Not quite — you can keep asking and guessing.", "error");
    }
  }

  function finishTwenty(message) {
    state.finished = true;
    content
      .querySelector("#mystery-reveal")
      .setAttribute("aria-hidden", "false");
    content.querySelector("#mystery-reveal .tq-animal").textContent =
      animalEmoji(state.target);
    content.querySelector("#mystery-reveal .tq-lock").textContent = "✓";
    content.querySelector(".tq-game").classList.add("is-solved");
    content.querySelector("#candidate-count").textContent =
      `Possible animals that fit the clues: 1 — mystery revealed (${animalLabel(state.target)}).`;
    content.querySelector("#reply").innerHTML =
      `<span class="tq-clue-icon" aria-hidden="true">🔍</span><span><strong>Round complete!</strong> ${esc(message)}<small>Press New animal to meet another mystery animal.</small></span>`;
    content
      .querySelectorAll(
        "[data-question], [data-guess], [data-action='give-up']",
      )
      .forEach((control) => {
        control.disabled = true;
      });
    showTwentyRoundEnd(
      "Mystery revealed. Choose a level or play another animal.",
    );
    setFeedback("Mystery revealed. Start a new round to play again.", "info");
  }

  function animalLabel(animal) {
    return `${/^[aeiou]/i.test(animal) ? "an" : "a"} ${animal}`;
  }

  function animalEmoji(animal) {
    return (
      {
        elephant: "🐘",
        dolphin: "🐬",
        penguin: "🐧",
        tiger: "🐯",
        cat: "🐱",
        eagle: "🦅",
        frog: "🐸",
        giraffe: "🦒",
        turtle: "🐢",
        dog: "🐶",
        lion: "🦁",
        zebra: "🦓",
        shark: "🦈",
        snake: "🐍",
        monkey: "🐒",
        rabbit: "🐰",
        crocodile: "🐊",
        butterfly: "🦋",
      }[animal] || "🐾"
    );
  }

  function checkFive() {
    const answers = content
      .querySelector("#five-answers")
      .value.split(/[\n,]+/)
      .map((answer) => answer.trim().toLowerCase())
      .filter(Boolean);
    const unique = [...new Set(answers)];
    if (unique.length >= 5) {
      addPoint(5);
      setFeedback(
        `Great list! You gave ${unique.length} different answers.`,
        "success",
      );
    } else
      setFeedback(
        `You have ${unique.length} different answers. Add ${5 - unique.length} more.`,
        "error",
      );
  }

  function showClue(index) {
    const item = quizSets[slug][index];
    const area = content.querySelector("#clue-area");
    if (!item) return;
    area.hidden = false;
    area.innerHTML = `<p class="eyebrow">${item.points} points</p><p class="prompt">${item.q}</p><p id="jeopardy-answer" hidden><strong>Answer:</strong> ${item.answer}</p><div class="answer-row"><button type="button" class="btn secondary" data-reveal-answer>Reveal answer</button><button type="button" class="btn" data-award="${item.points}" data-index="${index}">Award points</button></div>`;
    state.used.add(index);
    content.querySelector(`[data-jeopardy="${index}"]`).disabled = true;
  }

  function showBattleQuestion(index) {
    state.pending = index;
    const questions = quizSets[slug];
    const item = questions[round % questions.length];
    const area = content.querySelector("#battle-question");
    area.hidden = false;
    area.innerHTML = `<p class="prompt">Target ${String.fromCharCode(65 + Math.floor(index / 5))}${(index % 5) + 1}: ${item.q}</p><div class="choice-list">${item.options.map((option) => `<button type="button" class="choice" data-battle-answer="${esc(option)}">${esc(option)}</button>`).join("")}</div>`;
  }

  content.addEventListener("click", handleClick);
  content.addEventListener("click", (event) => {
    const reveal = event.target.closest("[data-reveal-answer]");
    if (reveal) content.querySelector("#jeopardy-answer").hidden = false;
    const award = event.target.closest("[data-award]");
    if (award) {
      addPoint(Number(award.dataset.award));
      setFeedback("Points added to the team score.", "success");
    }
    const battleChoice = event.target.closest("[data-battle-answer]");
    if (battleChoice) {
      const item = quizSets[slug][round % quizSets[slug].length];
      const index = state.pending;
      const hit = battleChoice.dataset.battleAnswer === item.answer;
      if (!hit) {
        setFeedback(
          "Not quite — try another answer. The coordinate is still available.",
          "error",
        );
        return;
      }
      state.shots.add(index);
      const shipHit = state.ships.has(index);
      const cell = content.querySelector(`[data-coordinate="${index}"]`);
      cell.disabled = true;
      cell.classList.add(shipHit ? "hit" : "miss");
      cell.textContent = shipHit ? "Hit!" : "Miss";
      if (shipHit) {
        addPoint(10);
        setFeedback("Correct answer — direct hit!", "success");
      } else
        setFeedback("Correct answer, but no ship at that coordinate.", "info");
      round++;
      const hits = [...state.shots].filter((shot) =>
        state.ships.has(shot),
      ).length;
      content.querySelector("#battle-question").hidden = true;
      if (hits === 4) setFeedback("Fleet found! Great work.", "success");
    }
  });

  root.querySelector("#restart").addEventListener("click", () => {
    round = slug === "20-questions" ? round + 1 : 0;
    if (slug !== "20-questions") setScore(0);
    state = {};
    render();
  });
  if (slug === "20-questions") {
    const fullscreenButton = root.querySelector("#fullscreen-game");
    const gamePanel = root.querySelector(".tq-game-panel");
    const syncFullscreen = () => {
      const active =
        document.fullscreenElement === gamePanel ||
        gamePanel.classList.contains("is-fullscreen-fallback");
      document.body.classList.toggle("tq-fullscreen-active", active);
      fullscreenButton.setAttribute("aria-pressed", String(active));
      fullscreenButton.setAttribute(
        "aria-label",
        active ? "Exit fullscreen" : "Enter fullscreen without ads",
      );
      fullscreenButton.textContent = active
        ? "⤢ Exit fullscreen"
        : "⛶ Fullscreen · no ads";
    };
    fullscreenButton.addEventListener("click", async () => {
      if (gamePanel.classList.contains("is-fullscreen-fallback")) {
        gamePanel.classList.remove("is-fullscreen-fallback");
        document.body.classList.remove("tq-fullscreen-fallback");
        syncFullscreen();
        return;
      }
      if (document.fullscreenElement === gamePanel) {
        await document.exitFullscreen?.();
        return;
      }
      try {
        if (!gamePanel.requestFullscreen)
          throw new Error("Fullscreen is unavailable");
        const enteredFullscreen = await Promise.race([
          gamePanel
            .requestFullscreen()
            .then(() => true)
            .catch(() => false),
          new Promise((resolve) =>
            window.setTimeout(() => resolve(false), 900),
          ),
        ]);
        if (!enteredFullscreen && document.fullscreenElement !== gamePanel) {
          gamePanel.classList.add("is-fullscreen-fallback");
          document.body.classList.add("tq-fullscreen-fallback");
          syncFullscreen();
        }
      } catch {
        gamePanel.classList.add("is-fullscreen-fallback");
        document.body.classList.add("tq-fullscreen-fallback");
        syncFullscreen();
      }
    });
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        gamePanel.classList.contains("is-fullscreen-fallback")
      ) {
        gamePanel.classList.remove("is-fullscreen-fallback");
        document.body.classList.remove("tq-fullscreen-fallback");
        syncFullscreen();
      }
    });
  }
  content.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("input[type=text]")) {
      event.preventDefault();
      const action =
        event.target.id === "question"
          ? "ask"
          : event.target.id === "guess"
            ? "guess"
            : "check-answer";
      content.querySelector(`[data-action="${action}"]`)?.click();
    }
  });
  render();
})();
