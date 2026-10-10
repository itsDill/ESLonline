(() => {
  "use strict";

  const pictures = [
    {
      word: "elephant",
      category: "Animals",
      emoji: "🐘",
      image: "elephant.jpg",
      clues: [
        "It is a very large land animal.",
        "It has a long trunk and big ears.",
        "It can use its trunk to pick things up.",
      ],
    },
    {
      word: "giraffe",
      category: "Animals",
      emoji: "🦒",
      image: "giraffe.jpg",
      clues: [
        "This animal eats leaves.",
        "It has a very long neck.",
        "It is the tallest land animal.",
      ],
    },
    {
      word: "penguin",
      category: "Animals",
      emoji: "🐧",
      image: "penguin.jpg",
      clues: [
        "This bird cannot fly.",
        "It is an excellent swimmer.",
        "Many kinds live in very cold places.",
      ],
    },
    {
      word: "turtle",
      category: "Animals",
      emoji: "🐢",
      image: "turtle.jpg",
      clues: [
        "This animal moves slowly.",
        "It has a hard shell.",
        "It can pull its head inside its shell.",
      ],
    },
    {
      word: "butterfly",
      category: "Animals",
      emoji: "🦋",
      image: "butterfly.jpg",
      clues: [
        "It begins life as a caterpillar.",
        "It has six legs and colorful wings.",
        "It flies from flower to flower.",
      ],
    },
    {
      word: "dolphin",
      category: "Animals",
      emoji: "🐬",
      image: "dolphin.jpg",
      clues: [
        "This animal lives in the sea.",
        "It is clever and makes clicking sounds.",
        "It is a mammal that swims with fins.",
      ],
    },
    {
      word: "fox",
      category: "Animals",
      emoji: "🦊",
      image: "fox.jpg",
      clues: [
        "This wild animal has a bushy tail.",
        "It has pointed ears and a narrow face.",
        "It is often shown with orange-red fur.",
      ],
    },
    {
      word: "owl",
      category: "Animals",
      emoji: "🦉",
      image: "owl.jpg",
      clues: [
        "This bird is often awake at night.",
        "It can turn its head a long way.",
        "It has large forward-facing eyes.",
      ],
    },
    {
      word: "watermelon",
      category: "Food",
      emoji: "🍉",
      image: "watermelon.jpg",
      clues: [
        "People often eat this fruit in summer.",
        "It has a green outside and a juicy inside.",
        "The inside is usually red with black seeds.",
      ],
    },
    {
      word: "pineapple",
      category: "Food",
      emoji: "🍍",
      image: "pineapple.jpg",
      clues: [
        "This tropical fruit has a spiky top.",
        "Its rough outside is not usually eaten.",
        "Its name combines a tree nut and an apple.",
      ],
    },
    {
      word: "pancakes",
      category: "Food",
      emoji: "🥞",
      image: "pancakes.jpg",
      clues: [
        "People often eat this food for breakfast.",
        "They are made from a batter in a pan.",
        "They are flat, round, and often served in a stack.",
      ],
    },
    {
      word: "sushi",
      category: "Food",
      emoji: "🍣",
      image: "sushi.jpg",
      clues: [
        "This dish is popular in Japan.",
        "It is often served with soy sauce.",
        "It is made with seasoned rice and can include fish.",
      ],
    },
    {
      word: "ice cream",
      category: "Food",
      emoji: "🍦",
      image: "ice-cream.jpg",
      clues: [
        "This is a cold, sweet dessert.",
        "It can melt on a warm day.",
        "It is often served in a cone or a cup.",
      ],
    },
    {
      word: "strawberry",
      category: "Food",
      emoji: "🍓",
      image: "strawberry.jpg",
      clues: [
        "This small fruit has tiny seeds on its skin.",
        "It is often red when ripe.",
        "Its name starts with the same sound as 'street'.",
      ],
    },
    {
      word: "rainbow",
      category: "Nature",
      emoji: "🌈",
      image: "rainbow.jpg",
      clues: [
        "You may see this after rain.",
        "It appears in the sky when sunlight meets water drops.",
        "It has bands of different colors.",
      ],
    },
    {
      word: "volcano",
      category: "Nature",
      emoji: "🌋",
      image: "volcano.jpg",
      clues: [
        "This landform can be active or dormant.",
        "It may release ash, gas, and hot rock.",
        "Lava can flow down its sides.",
      ],
    },
    {
      word: "waterfall",
      category: "Nature",
      emoji: "🏞️",
      image: "waterfall.jpg",
      clues: [
        "You can find this feature in a river.",
        "Water drops over a steep edge.",
        "It is a powerful, falling stream of water.",
      ],
    },
    {
      word: "mountains",
      category: "Nature",
      emoji: "⛰️",
      image: "mountains.jpg",
      clues: [
        "These landforms rise high above the land.",
        "Their tops can be rocky or covered with snow.",
        "A very high one is sometimes called a peak.",
      ],
    },
    {
      word: "lighthouse",
      category: "Places",
      emoji: "🗼",
      image: "lighthouse.jpg",
      clues: [
        "This building is often near the coast.",
        "It helps people find their way at night.",
        "A bright light shines from its top.",
      ],
    },
    {
      word: "castle",
      category: "Places",
      emoji: "🏰",
      image: "castle.jpg",
      clues: [
        "This strong building is often very old.",
        "It may have towers, walls, and a moat.",
        "Kings and queens are often connected with it.",
      ],
    },
    {
      word: "hot air balloon",
      category: "Places & Travel",
      emoji: "🎈",
      image: "hot-air-balloon.jpg",
      clues: [
        "It travels through the sky without an engine.",
        "A basket hangs below a large fabric envelope.",
        "Heated air helps it rise.",
      ],
    },
    {
      word: "bicycle",
      category: "Transport",
      emoji: "🚲",
      image: "bicycle.jpg",
      clues: [
        "You can ride this on a path or road.",
        "It usually has two wheels.",
        "You move it forward by pedaling.",
      ],
    },
    {
      word: "train",
      category: "Transport",
      emoji: "🚂",
      image: "train.jpg",
      clues: [
        "This vehicle follows a track.",
        "It can carry many passengers at once.",
        "It is made of connected cars pulled by an engine.",
      ],
    },
    {
      word: "sailboat",
      category: "Transport",
      emoji: "⛵",
      image: "sailboat.jpg",
      clues: [
        "This vehicle travels on water.",
        "It has a mast and a large piece of cloth.",
        "The wind pushes it forward.",
      ],
    },
    {
      word: "umbrella",
      category: "Everyday Objects",
      emoji: "☂️",
      image: "umbrella.jpg",
      clues: [
        "You might take this outside on a rainy day.",
        "It folds up when you do not need it.",
        "You hold it over your head to stay dry.",
      ],
    },
    {
      word: "alarm clock",
      category: "Everyday Objects",
      emoji: "⏰",
      image: "alarm-clock.jpg",
      clues: [
        "This object helps people wake up.",
        "You can set a time for it to make a sound.",
        "It tells you the time and may ring in the morning.",
      ],
    },
    {
      word: "camera",
      category: "Everyday Objects",
      emoji: "📷",
      image: "camera.jpg",
      clues: [
        "This device can save a special moment.",
        "It has a lens and may have a flash.",
        "You use it to take a photograph.",
      ],
    },
    {
      word: "backpack",
      category: "Everyday Objects",
      emoji: "🎒",
      image: "backpack.jpg",
      clues: [
        "Students often take this to school.",
        "It has straps that go over your shoulders.",
        "You carry books and other things inside it.",
      ],
    },
    {
      word: "soccer ball",
      category: "Sports",
      emoji: "⚽",
      image: "soccer-ball.jpg",
      clues: [
        "Players pass and kick this object.",
        "It is usually round and covered in panels.",
        "Two teams try to score goals with it.",
      ],
    },
    {
      word: "tennis",
      category: "Sports",
      emoji: "🎾",
      image: "tennis.jpg",
      clues: [
        "This sport is played with a racket.",
        "Players hit a small ball over a net.",
        "The ball is often bright yellow-green.",
      ],
    },
  ];

  const $ = (id) => document.getElementById(id);
  const elements = {
    gameWindow: $("prGameWindow"),
    gameCard: $("prGameCard"),
    setup: $("prSetup"),
    play: $("prPlayScreen"),
    result: $("prRoundEnd"),
    category: $("prCategory"),
    difficulty: $("prDifficulty"),
    start: $("prStartButton"),
    next: $("prNextButton"),
    retry: $("prRetryButton"),
    image: $("prPictureImage"),
    emoji: $("prPictureEmoji"),
    tiles: $("prPictureTiles"),
    frame: $("prPictureFrame"),
    categoryLabel: $("prCategoryLabel"),
    clue: $("prClueText"),
    progress: $("prProgressFill"),
    progressText: $("prProgressText"),
    score: $("prScore"),
    streak: $("prStreak"),
    hearts: $("prHearts"),
    guess: $("prGuessInput"),
    guessButton: $("prGuessButton"),
    reveal: $("prRevealButton"),
    feedback: $("prFeedback"),
    toast: $("prToast"),
    resultEmoji: $("prResultEmoji"),
    resultTitle: $("prResultTitle"),
    resultSummary: $("prResultSummary"),
    fullscreen: $("prFullscreenButton"),
    minimize: $("prMinimizeButton"),
    maximize: $("prMaximizeButton"),
  };

  const state = {
    current: null,
    tiles: [],
    revealed: 0,
    wrongGuesses: 0,
    clueIndex: 0,
    score: 0,
    streak: 0,
    bestScore: 0,
    seen: new Set(),
    roundLocked: false,
    toastTimer: null,
  };

  try {
    state.bestScore = Number(
      window.localStorage.getItem("pictureRevealBestScore") || 0,
    );
  } catch {
    state.bestScore = 0;
  }

  function getRoundPool() {
    const category = elements.category.value;
    let pool = pictures.filter(
      (picture) => category === "all" || picture.category === category,
    );
    if (!pool.length) pool = pictures.slice();
    if (pool.every((picture) => state.seen.has(picture.word)))
      state.seen.clear();
    return pool.filter((picture) => !state.seen.has(picture.word));
  }

  function shuffle(values) {
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }

  function tileCount() {
    return (
      { easy: 12, standard: 20, challenge: 24 }[elements.difficulty.value] || 20
    );
  }

  function setFeedback(message, kind = "") {
    elements.feedback.textContent = message;
    elements.feedback.className = `pr-feedback${kind ? ` is-${kind}` : ""}`;
  }

  function announce(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(
      () => elements.toast.classList.remove("is-visible"),
      2200,
    );
  }

  function buildTiles() {
    const count = tileCount();
    const columns = elements.difficulty.value === "easy" ? 4 : 5;
    const rows = Math.ceil(count / columns);
    elements.tiles.replaceChildren();
    elements.tiles.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    elements.tiles.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    state.tiles = [];
    for (let index = 0; index < count; index += 1) {
      const tile = document.createElement("button");
      tile.className = "pr-reveal-tile";
      tile.type = "button";
      tile.setAttribute("aria-label", `Reveal picture tile ${index + 1}`);
      tile.textContent = "?";
      tile.addEventListener("click", () => revealTile(index));
      state.tiles.push(tile);
      elements.tiles.append(tile);
    }
    updateRevealProgress();
  }

  function startRound(keepSetup = false) {
    const pool = getRoundPool();
    const round = pool[Math.floor(Math.random() * pool.length)];
    state.current = round;
    state.seen.add(round.word);
    state.revealed = 0;
    state.wrongGuesses = 0;
    state.clueIndex = 0;
    state.roundLocked = false;
    elements.image.classList.remove("is-loaded", "pr-picture-solved");
    elements.image.src = `../images/picture-reveal/${round.image}`;
    elements.image.alt = `Partially revealed picture: ${round.category.toLowerCase()}`;
    elements.image.onload = () => elements.image.classList.add("is-loaded");
    elements.image.onerror = () => elements.image.classList.remove("is-loaded");
    elements.emoji.textContent = round.emoji;
    elements.categoryLabel.textContent = round.category;
    elements.guess.value = "";
    elements.guess.maxLength = 48;
    elements.guess.disabled = false;
    elements.guessButton.disabled = false;
    elements.reveal.disabled = false;
    elements.frame.classList.remove("pr-is-solved");
    elements.hearts.textContent = "♥ ♥ ♥";
    elements.hearts.setAttribute("aria-label", "3 guesses remaining");
    elements.clue.textContent =
      "Take a careful look. Every reveal gets you closer.";
    setFeedback("Type your guess whenever you think you know the picture.");
    buildTiles();
    elements.setup.hidden = true;
    elements.result.hidden = true;
    elements.play.hidden = false;
    elements.gameCard.classList.add("is-playing");
    elements.guess.focus({ preventScroll: true });
    if (!keepSetup)
      announce("New picture! Choose a tile to reveal or enter a guess.");
  }

  function updateRevealProgress() {
    const total = state.tiles.length || tileCount();
    const percent = Math.round((state.revealed / total) * 100);
    elements.progress.style.width = `${percent}%`;
    elements.progress.setAttribute("aria-valuenow", String(state.revealed));
    elements.progress.setAttribute("aria-valuemax", String(total));
    elements.progressText.textContent = `${state.revealed} of ${total} tiles`;
    elements.image.style.setProperty(
      "--pr-blur",
      `${Math.max(0, 7 - state.revealed * 0.42)}px`,
    );
    elements.reveal.disabled = state.roundLocked || state.revealed >= total;
  }

  function revealTile(index = null) {
    if (!state.current || state.roundLocked) return;
    let target = index;
    if (
      target === null ||
      state.tiles[target]?.classList.contains("is-revealed")
    ) {
      const hidden = state.tiles
        .map((tile, tileIndex) =>
          tile.classList.contains("is-revealed") ? -1 : tileIndex,
        )
        .filter((tileIndex) => tileIndex >= 0);
      if (!hidden.length) return;
      // Prefer tiles near the center sometimes to make each reveal feel like a useful peek.
      const middle = (state.tiles.length - 1) / 2;
      hidden.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
      const candidateCount = Math.min(5, hidden.length);
      target = hidden[Math.floor(Math.random() * candidateCount)];
    }
    if (
      !state.tiles[target] ||
      state.tiles[target].classList.contains("is-revealed")
    )
      return;
    state.tiles[target].classList.add("is-revealed");
    state.tiles[target].disabled = true;
    state.revealed += 1;
    updateRevealProgress();
    if (state.revealed === 2 && state.clueIndex < 1) showClue(0);
    else if (
      state.revealed === Math.ceil(state.tiles.length * 0.48) &&
      state.clueIndex < 2
    )
      showClue(1);
    else if (
      state.revealed === Math.ceil(state.tiles.length * 0.72) &&
      state.clueIndex < 3
    )
      showClue(2);
    if (state.revealed === state.tiles.length) {
      elements.clue.textContent = `Last chance! The picture is fully revealed — what is it?`;
      elements.guess.focus({ preventScroll: true });
    }
  }

  function showClue(index) {
    state.clueIndex = index + 1;
    elements.clue.textContent = `Clue ${index + 1}: ${state.current.clues[index]}`;
  }

  function normalize(value) {
    return value
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function submitGuess() {
    if (!state.current || state.roundLocked) return;
    const guess = normalize(elements.guess.value);
    if (!guess) {
      setFeedback("Enter a word or phrase first.", "bad");
      elements.guess.focus();
      return;
    }
    if (guess === normalize(state.current.word)) {
      finishRound(true);
      return;
    }
    state.wrongGuesses += 1;
    state.streak = 0;
    elements.streak.textContent = "0";
    const remaining = Math.max(0, 3 - state.wrongGuesses);
    elements.hearts.textContent = remaining
      ? `${"♥ ".repeat(remaining).trim()}${" · ".repeat(3 - remaining).trim()}`
      : "♡ ♡ ♡";
    elements.hearts.setAttribute(
      "aria-label",
      `${remaining} guesses remaining`,
    );
    setFeedback(
      remaining
        ? `Not quite — ${remaining} ${remaining === 1 ? "guess" : "guesses"} left. Here's another peek!`
        : "No guesses left. The answer is revealed.",
      "bad",
    );
    revealTile();
    elements.guess.value = "";
    if (remaining === 0) finishRound(false);
  }

  function finishRound(won) {
    if (state.roundLocked) return;
    state.roundLocked = true;
    const total = state.tiles.length;
    const hidden = total - state.revealed;
    if (won) {
      const earned = Math.max(20, 80 + hidden * 12 - state.wrongGuesses * 15);
      state.score += earned;
      state.streak += 1;
      elements.resultEmoji.textContent =
        state.revealed <= Math.ceil(total * 0.35) ? "🏆" : "🎉";
      elements.resultTitle.textContent =
        state.revealed <= Math.ceil(total * 0.35)
          ? "Incredible vision!"
          : "You got it!";
      elements.resultSummary.textContent = `It was ${state.current.word}! You earned ${earned} points with ${hidden} tiles still hidden. ${state.streak > 1 ? `${state.streak} correct guesses in a row!` : "Ready for another mystery?"}`;
      setFeedback(
        `Correct! ${state.current.word} — +${earned} points.`,
        "good",
      );
    } else {
      state.streak = 0;
      elements.frame.classList.add("pr-is-solved");
      state.tiles.forEach((tile) => tile.classList.add("is-revealed"));
      state.revealed = total;
      updateRevealProgress();
      elements.resultEmoji.textContent = "💡";
      elements.resultTitle.textContent = "Mystery solved!";
      elements.resultSummary.textContent = `The picture was ${state.current.word}. Look at the picture and say the word aloud, then try another round.`;
    }
    elements.score.textContent = String(state.score);
    elements.streak.textContent = String(state.streak);
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      try {
        window.localStorage.setItem(
          "pictureRevealBestScore",
          String(state.bestScore),
        );
      } catch {
        /* Saving a personal best is optional. */
      }
    }
    $("prBestScore").textContent = String(state.bestScore);
    elements.guess.disabled = true;
    elements.guessButton.disabled = true;
    elements.reveal.disabled = true;
    elements.play.hidden = true;
    elements.result.hidden = false;
  }

  function toggleMaximize() {
    const maximized = elements.gameWindow.classList.toggle("is-maximized");
    elements.gameWindow.classList.remove("is-minimized");
    elements.minimize.setAttribute("aria-expanded", "true");
    elements.minimize.textContent = "−";
    elements.maximize.setAttribute("aria-pressed", String(maximized));
    elements.maximize.setAttribute(
      "aria-label",
      maximized ? "Restore game window" : "Maximize game window",
    );
    elements.maximize.title = maximized
      ? "Restore game window"
      : "Maximize game window";
    updateFullscreenState();
  }

  function updateFullscreenState() {
    const isNative =
      document.fullscreenElement === elements.gameWindow ||
      document.webkitFullscreenElement === elements.gameWindow;
    if (isNative) {
      document.body.classList.remove("pr-fullscreen-fallback");
      document.documentElement.classList.remove("pr-fullscreen-fallback");
    }
    const isFallback = document.body.classList.contains(
      "pr-fullscreen-fallback",
    );
    const focused = isNative || isFallback;
    document.body.classList.toggle(
      "pr-focus-mode",
      focused || elements.gameWindow.classList.contains("is-maximized"),
    );
    document.documentElement.classList.toggle(
      "pr-focus-mode",
      focused || elements.gameWindow.classList.contains("is-maximized"),
    );
    elements.fullscreen.setAttribute("aria-pressed", String(focused));
    elements.fullscreen.setAttribute(
      "aria-label",
      focused
        ? "Exit fullscreen game; advertisements are hidden"
        : "Enter ad-free fullscreen game",
    );
    elements.fullscreen.title = focused
      ? "Exit fullscreen"
      : "Fullscreen · no ads";
    elements.fullscreen.innerHTML = `<i class="fas ${focused ? "fa-compress" : "fa-expand"}" aria-hidden="true"></i><span class="pr-button-label">${focused ? "Exit fullscreen" : "Fullscreen · no ads"}</span>`;
  }

  async function toggleFullscreen() {
    const isNative =
      document.fullscreenElement === elements.gameWindow ||
      document.webkitFullscreenElement === elements.gameWindow;
    if (isNative) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else await document.webkitExitFullscreen?.();
      } catch {
        /* Keep focus mode available if the browser blocks exit. */
      }
      return;
    }
    if (document.body.classList.contains("pr-fullscreen-fallback")) {
      document.body.classList.remove("pr-fullscreen-fallback");
      document.documentElement.classList.remove("pr-fullscreen-fallback");
      updateFullscreenState();
      return;
    }
    try {
      const request =
        elements.gameWindow.requestFullscreen ||
        elements.gameWindow.webkitRequestFullscreen;
      if (!request) throw new Error("Fullscreen API unavailable");
      const requestResult = Promise.resolve(request.call(elements.gameWindow))
        .then(() => true)
        .catch(() => false);
      const entered = await Promise.race([
        requestResult,
        new Promise((resolve) => window.setTimeout(() => resolve(false), 900)),
      ]);
      if (
        !entered &&
        document.fullscreenElement !== elements.gameWindow &&
        document.webkitFullscreenElement !== elements.gameWindow
      ) {
        document.body.classList.add("pr-fullscreen-fallback");
        document.documentElement.classList.add("pr-fullscreen-fallback");
      }
    } catch {
      document.body.classList.add("pr-fullscreen-fallback");
      document.documentElement.classList.add("pr-fullscreen-fallback");
    }
    updateFullscreenState();
  }

  elements.start.addEventListener("click", () => startRound());
  elements.next.addEventListener("click", () => startRound());
  elements.retry.addEventListener("click", () => startRound());
  elements.guessButton.addEventListener("click", submitGuess);
  elements.guess.addEventListener("keydown", (event) => {
    if (event.key === "Enter") submitGuess();
  });
  elements.reveal.addEventListener("click", () => revealTile());
  elements.minimize.addEventListener("click", () => {
    const minimized = elements.gameWindow.classList.toggle("is-minimized");
    elements.minimize.textContent = minimized ? "+" : "−";
    elements.minimize.setAttribute("aria-expanded", String(!minimized));
    elements.minimize.setAttribute(
      "aria-label",
      minimized ? "Restore game window" : "Minimize game window",
    );
  });
  elements.maximize.addEventListener("click", toggleMaximize);
  elements.fullscreen.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenState);
  document.addEventListener("webkitfullscreenchange", updateFullscreenState);
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("pr-fullscreen-fallback")
    ) {
      document.body.classList.remove("pr-fullscreen-fallback");
      document.documentElement.classList.remove("pr-fullscreen-fallback");
      updateFullscreenState();
    }
  });
  document.addEventListener("DOMContentLoaded", () =>
    window.refreshGameAds?.(),
  );
  window.addEventListener("load", () => window.refreshGameAds?.(), {
    once: true,
  });

  elements.score.textContent = "0";
  $("prBestScore").textContent = String(state.bestScore);
  elements.streak.textContent = "0";
  elements.category.addEventListener("change", () => {
    state.seen.clear();
  });
})();
