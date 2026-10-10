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
      intro: "Think of the secret word by asking yes-or-no questions.",
      how: "The starter version has one hidden answer. Ask up to 20 yes-or-no questions, then guess the word.",
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
    <section class="hero"><p class="eyebrow">${slug === "20-questions" ? "Mystery animal · English speaking game" : "Free English practice · Starter edition"}</p><h1>${esc(game.title)}</h1><p>${slug === "20-questions" ? "Think of an animal, ask yes-or-no questions, and use each clue to solve the mystery." : esc(game.intro)}</p></section>
    <div class="content-grid">
      <section class="panel game-panel${slug === "20-questions" ? " tq-game-panel" : ""}" aria-labelledby="play-title"><div class="game-toolbar"><h2 id="play-title">Play a round</h2><span class="score" id="score" aria-live="polite">Score: 0</span></div><div class="game-content" id="game-content"></div><div class="controls"><button class="btn secondary" id="restart" type="button">Restart</button>${slug === "20-questions" ? '<button class="btn secondary tq-fullscreen-button" id="fullscreen-game" type="button" aria-pressed="false">⛶ Fullscreen · no ads</button>' : ""}</div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
      <aside class="panel"><h2>How to play</h2><p class="hint">${esc(game.how)}</p><h2 style="margin-top:1.2rem">About this starter</h2><p class="hint">This is an early playable prototype. Question sets, visuals, and classroom features will grow in later versions.</p></aside>
    </div>`;

  const content = root.querySelector("#game-content");
  const scoreEl = root.querySelector("#score");
  const feedback = root.querySelector("#feedback");
  let score = 0;
  let round = 0;
  let state = {};
  const setFeedback = (message, kind = "info") => {
    feedback.textContent = message;
    feedback.dataset.kind = kind;
  };
  const setScore = (value) => {
    score = value;
    scoreEl.textContent = `Score: ${score}`;
  };
  const addPoint = (points = 1) => setScore(score + points);

  function render() {
    feedback.textContent = "";
    feedback.dataset.kind = "info";
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
          africa: false,
          asia: false,
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
          africa: false,
          asia: false,
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
          africa: false,
          asia: false,
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
        },
      },
    ];
    state.animals = animals;
    state.targetAnimal = animals[Math.floor(Math.random() * animals.length)];
    state.target = state.targetAnimal.name;
    state.questions = 0;
    state.guessed = false;
    state.finished = false;
    state.askedTopics = new Set();
    content.innerHTML = `<div class="tq-game"><div class="tq-game-top"><span class="tq-pill"><span aria-hidden="true">🐾</span> ANIMAL MYSTERY</span><span class="tq-round">ROUND ${round + 1}</span></div><div class="tq-mystery" id="mystery-reveal" aria-hidden="true"><span class="tq-sparkle">✦</span><span class="tq-animal">🐾</span><span class="tq-lock">?</span><span class="tq-sparkle tq-sparkle-two">✦</span></div><h3 class="tq-prompt">I’m thinking of an animal…</h3><p class="tq-subprompt">Ask yes-or-no questions, collect clues, and make your guess!</p><div class="tq-meter" aria-label="Questions used"><div class="tq-meter-label"><span>Question power</span><strong><span id="question-count">0</span> / 20</strong></div><div class="tq-meter-track"><span id="question-progress"></span></div></div><div class="tq-ask-box"><label for="question">What would you like to ask?</label><div class="tq-input-row"><input id="question" type="text" placeholder="Does it have four legs?" autocomplete="off"><button class="btn tq-ask-button" type="button" data-action="ask">Ask it <span aria-hidden="true">➜</span></button></div><div class="tq-quick-questions" aria-label="Question ideas"><span>Try asking:</span><button type="button" data-suggestion="Can it fly?">Can it fly?</button><button type="button" data-suggestion="Does it have fur?">Does it have fur?</button><button type="button" data-suggestion="Is it a pet?">Is it a pet?</button></div></div><div class="tq-clue" id="reply" role="status" aria-live="polite"><span class="tq-clue-icon" aria-hidden="true">💭</span><span>Your first clue is waiting…</span></div><ol class="tq-clue-log" id="clue-log" aria-label="Clues so far"></ol><div class="tq-guess-box"><label for="guess">Ready to guess?</label><div class="tq-input-row"><input id="guess" type="text" placeholder="Type an animal name…" autocomplete="off"><button class="btn tq-guess-button" type="button" data-action="guess">Lock in guess 🔒</button></div></div><p class="tq-footnote">Questions are counted when you ask. Guesses are free—take your best shot!</p></div>`;
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
    } else if (action === "draw-word") drawBingoWord();
    else if (action === "ask") askQuestion();
    else if (action === "guess") guessWord();
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

  function askQuestion() {
    const input = content.querySelector("#question");
    const question = input.value.trim().toLowerCase();
    if (!question) {
      setFeedback("Enter a yes-or-no question first.", "error");
      return;
    }
    if (state.finished) {
      setFeedback(
        "This round is finished. Choose Restart to play again.",
        "error",
      );
      return;
    }
    if (state.questions >= 20) {
      finishTwenty(
        "You’ve used all 20 questions! The animal was " +
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
        animals: ["penguin", "eagle"],
      },
      {
        key: "feathers",
        patterns: [/\b(feather|feathers)\b/],
        yes: "It has feathers.",
        no: "It doesn’t have feathers.",
        animals: ["penguin", "eagle"],
      },
      {
        key: "tail",
        patterns: [/\b(tail|tails)\b/],
        yes: "It has a tail.",
        no: "It doesn’t have a tail.",
        animals: [
          "elephant",
          "dolphin",
          "penguin",
          "tiger",
          "cat",
          "eagle",
          "giraffe",
          "turtle",
        ],
      },
      {
        key: "shell",
        patterns: [/\b(shell|shells)\b/],
        yes: "It has a shell.",
        no: "It doesn’t have a shell.",
        animals: ["turtle"],
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
        key: "mammal",
        patterns: [/\b(mammal|mammals)\b/],
        yes: "It is a mammal.",
        no: "It isn’t a mammal.",
      },
      {
        key: "legs",
        patterns: [/\b(legs|leg)\b/],
        yes: "It has four legs.",
        no: "It doesn’t have four legs.",
      },
      {
        key: "big",
        patterns: [/\b(big|large|huge|bigger|larger)\b/],
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
        patterns: [/\b(swim|swimming|swimmer|swimmers)\b/],
        yes: "It is a strong swimmer.",
        no: "It isn’t known for swimming.",
      },
      {
        key: "dangerous",
        patterns: [/\b(dangerous|danger|scary)\b/],
        yes: "It can be dangerous to people.",
        no: "It isn’t usually dangerous to people.",
      },
      {
        key: "land",
        patterns: [/\b(land|ground)\b/],
        yes: "It spends time on land.",
        no: "It doesn’t spend time on land.",
      },
      {
        key: "africa",
        patterns: [/\b(africa|african)\b/],
        yes: "It lives in Africa.",
        no: "It doesn’t live in Africa.",
      },
      {
        key: "asia",
        patterns: [/\b(asia|asian)\b/],
        yes: "It lives in Asia.",
        no: "It doesn’t live in Asia.",
      },
      {
        key: "diet",
        patterns: [/\b(meat|carnivore|eat other animals|prey)\b/],
        yes: "It eats other animals.",
        no: "It doesn’t usually eat other animals.",
        animals: ["dolphin", "penguin", "tiger", "cat", "eagle", "frog"],
      },
      {
        key: "plant-diet",
        patterns: [/\b(plant|plants|grass|leaves|herbivore|herbivores)\b/],
        yes: "It eats plants.",
        no: "It doesn’t usually eat plants.",
        animals: ["elephant", "giraffe", "turtle"],
      },
    ];
    const topic = topics.find((candidate) =>
      candidate.patterns.some((pattern) => pattern.test(question)),
    );
    if (!topic) {
      setFeedback(
        "Try asking about flying, feathers, fur, a shell, diet, size, or habitat.",
        "info",
      );
      return;
    }
    if (
      /\b(not|never|cannot|can't|doesn't|isn't|aren't|don't)\b/.test(question)
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
    state.questions++;
    state.askedTopics.add(topic.key);
    const isYes = topic.animals
      ? topic.animals.includes(state.target)
      : Boolean(state.targetAnimal.traits[topic.key]);
    const answer = isYes ? "Yes" : "No";
    const detail = isYes ? topic.yes : topic.no;
    content.querySelector("#question-count").textContent = state.questions;
    content.querySelector("#question-progress").style.width =
      `${state.questions * 5}%`;
    content.querySelector("#reply").innerHTML =
      `<span class="tq-clue-icon" aria-hidden="true">${answer === "Yes" ? "✅" : "🙅"}</span><span><strong>${answer}!</strong> ${esc(detail)}<small>Clue ${state.questions} of 20</small></span>`;
    const clue = document.createElement("li");
    clue.innerHTML = `<span class="tq-log-answer ${answer === "Yes" ? "is-yes" : "is-no"}">${answer}</span><span>${esc(detail)}</span>`;
    content.querySelector("#clue-log").prepend(clue);
    input.value = "";
    if (state.questions === 20)
      setFeedback(`Last question used! Make your final guess.`, "info");
  }

  function guessWord() {
    const input = content.querySelector("#guess");
    const guess = input.value.trim().toLowerCase();
    if (!guess) {
      setFeedback("Type your guess in the box first.", "error");
      return;
    }
    if (state.finished) {
      setFeedback("This round is finished. Restart to play again.", "error");
      return;
    }
    if (guess === state.target) {
      addPoint(Math.max(1, 21 - state.questions));
      state.guessed = true;
      state.finished = true;
      content
        .querySelector("#mystery-reveal")
        .setAttribute("aria-hidden", "false");
      content.querySelector("#mystery-reveal .tq-animal").textContent =
        animalEmoji(state.target);
      content.querySelector("#mystery-reveal .tq-lock").textContent = "✓";
      content.querySelector(".tq-game").classList.add("is-solved");
      content.querySelector("#reply").innerHTML =
        `<span class="tq-clue-icon" aria-hidden="true">🎉</span><span><strong>You got it!</strong> The mystery animal was ${esc(animalLabel(state.target))}!<small>Great guessing — round complete!</small></span>`;
      setFeedback(
        `Mystery solved! +${Math.max(1, 21 - state.questions)} points`,
        "success",
      );
      content
        .querySelectorAll(
          "#question, #guess, [data-action='ask'], [data-action='guess'], [data-suggestion]",
        )
        .forEach((control) => {
          control.disabled = true;
        });
    } else {
      content.querySelector("#reply").innerHTML =
        `<span class="tq-clue-icon" aria-hidden="true">🤔</span><span><strong>Not ${esc(animalLabel(guess))} this time.</strong> Keep collecting clues and try another guess.<small>Your secret animal is still hidden!</small></span>`;
      setFeedback("Not quite — you can keep asking and guessing.", "error");
      input.value = "";
      input.focus();
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
    content.querySelector("#reply").innerHTML =
      `<span class="tq-clue-icon" aria-hidden="true">🔍</span><span><strong>Round complete!</strong> ${esc(message)}<small>Press Restart to meet another mystery animal.</small></span>`;
    content
      .querySelectorAll(
        "#question, #guess, [data-action='ask'], [data-action='guess'], [data-suggestion]",
      )
      .forEach((control) => {
        control.disabled = true;
      });
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
    const suggestion = event.target.closest("[data-suggestion]");
    if (suggestion) {
      const input = content.querySelector("#question");
      input.value = suggestion.dataset.suggestion;
      input.focus();
    }
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
    setScore(0);
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
