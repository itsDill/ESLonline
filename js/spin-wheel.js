(() => {
  "use strict";

  const MAX_OPTIONS = 24;
  const MAX_OPTION_LENGTH = 25;
  const HISTORY_LIMIT = 10;
  const SPIN_DURATION = 3800;
  const STORAGE_KEYS = {
    options: "rouletteOptions",
    history: "spinHistory",
    sound: "soundEnabled",
    removeWinner: "spinRemoveWinner",
  };
  const segmentColors = [
    "#6d56d9",
    "#e76f51",
    "#168aad",
    "#f4a261",
    "#2a9d8f",
    "#c44569",
    "#4361ee",
    "#ee9b00",
    "#4d908e",
    "#9b5de5",
    "#f15bb5",
    "#577590",
    "#43aa8b",
    "#f8961e",
    "#277da1",
    "#b56576",
    "#6a994e",
    "#bc6c25",
    "#5e60ce",
    "#e63946",
    "#52796f",
    "#9c6644",
    "#3a86ff",
    "#8f5d5d",
  ];
  const presets = {
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    yesno: ["Yes", "No", "Maybe"],
    colors: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"],
    students: ["Group A", "Group B", "Group C", "Group D"],
  };

  const $ = (selector) => document.querySelector(selector);
  const wheel = $("#wheel");
  const spinButton = $("#spinBtn");
  const optionInput = $("#optionInput");
  const optionList = $("#optionsList");
  const result = $("#result");
  const resultText = $("#resultText");
  const historyList = $("#historyList");
  const soundToggle = $("#soundToggle");
  const soundText = $("#soundText");
  const removeWinnerToggle = $("#removeWinnerToggle");

  if (!wheel || !spinButton || !optionInput || !optionList) return;

  const readStorage = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      showAlert("Your browser could not save this setting.", "info");
    }
  };

  let options = sanitizeOptions(readStorage(STORAGE_KEYS.options, []));
  let history = sanitizeHistory(readStorage(STORAGE_KEYS.history, []));
  let soundEnabled = readStorage(STORAGE_KEYS.sound, true) !== false;
  let removeWinner = readStorage(STORAGE_KEYS.removeWinner, false) === true;
  let isSpinning = false;
  let rotation = 0;
  let alertTimer;
  let audioContext;

  function sanitizeOptions(value) {
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value
          .filter((item) => typeof item === "string")
          .map((item) => item.trim().slice(0, MAX_OPTION_LENGTH))
          .filter(Boolean),
      ),
    ].slice(0, MAX_OPTIONS);
  }

  function sanitizeHistory(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item) => item && typeof item.result === "string")
      .slice(0, HISTORY_LIMIT)
      .map((item) => ({
        result: item.result.slice(0, MAX_OPTION_LENGTH),
        time: typeof item.time === "string" ? item.time.slice(0, 40) : "",
      }));
  }

  function persistOptions() {
    writeStorage(STORAGE_KEYS.options, options);
  }

  function updateOptionsDisplay() {
    const count = $("#optionsCount");
    if (count) count.textContent = `(${options.length}/${MAX_OPTIONS})`;
    optionList.replaceChildren();

    if (options.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML =
        '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      const text = document.createElement("p");
      text.textContent = "Add at least two choices to spin your wheel.";
      empty.append(text);
      optionList.append(empty);
      return;
    }

    options.forEach((option, index) => {
      const row = document.createElement("div");
      row.className = "option-item";
      const label = document.createElement("span");
      label.textContent = option;
      const removeButton = document.createElement("button");
      removeButton.className = "remove-btn";
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `Remove ${option}`);
      removeButton.innerHTML =
        '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span>Remove</span>';
      removeButton.addEventListener("click", () => removeOption(index));
      row.append(label, removeButton);
      optionList.append(row);
    });
  }

  function pointOnWheel(angleDegrees, radius) {
    const radians = (angleDegrees * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(radians),
      y: 200 + radius * Math.sin(radians),
    };
  }

  function renderWheel() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    wheel.replaceChildren();
    wheel.style.transform = "rotate(0deg)";
    rotation = 0;

    if (options.length === 0) {
      wheel.setAttribute("aria-label", "Wheel with no choices yet");
      const blank = document.createElement("div");
      blank.className = "wheel-empty-message";
      blank.textContent = "Add choices to build your wheel";
      wheel.append(blank);
      updateSpinButton();
      return;
    }

    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("aria-hidden", "true");
    const segmentAngle = 360 / options.length;

    if (options.length === 1) {
      const circle = document.createElementNS(svgNamespace, "circle");
      circle.setAttribute("cx", "200");
      circle.setAttribute("cy", "200");
      circle.setAttribute("r", "196");
      circle.setAttribute("fill", segmentColors[0]);
      svg.append(circle);
    } else {
      options.forEach((option, index) => {
        const startDegrees = index * segmentAngle - 90;
        const endDegrees = (index + 1) * segmentAngle - 90;
        const start = pointOnWheel(startDegrees, 196);
        const end = pointOnWheel(endDegrees, 196);
        const largeArc = segmentAngle > 180 ? 1 : 0;
        const wedge = document.createElementNS(svgNamespace, "path");
        wedge.setAttribute(
          "d",
          `M 200 200 L ${start.x} ${start.y} A 196 196 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
        );
        wedge.setAttribute("fill", segmentColors[index % segmentColors.length]);
        wedge.setAttribute("stroke", "#ffffff");
        wedge.setAttribute("stroke-width", "2");
        svg.append(wedge);

        const middleDegrees = (index + 0.5) * segmentAngle - 90;
        const labelPoint = pointOnWheel(middleDegrees, 127);
        const label = document.createElementNS(svgNamespace, "text");
        label.classList.add("wheel-label");
        label.setAttribute("x", String(labelPoint.x));
        label.setAttribute("y", String(labelPoint.y));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute(
          "font-size",
          options.length > 14 ? "10" : options.length > 9 ? "11" : "13",
        );
        label.textContent = option;
        svg.append(label);
      });
    }

    wheel.append(svg);
    wheel.setAttribute(
      "aria-label",
      `Wheel with ${options.length} choices: ${options.join(", ")}`,
    );
    updateSpinButton();
  }

  function updateSpinButton() {
    spinButton.disabled = isSpinning || options.length < 2;
    spinButton.textContent = isSpinning ? "Spinning…" : "SPIN THE WHEEL";
  }

  function updateHistoryDisplay() {
    if (!historyList) return;
    historyList.replaceChildren();
    if (history.length === 0) {
      const empty = document.createElement("li");
      empty.className = "history-empty";
      empty.textContent = "Your recent results will appear here.";
      historyList.append(empty);
      return;
    }

    history.forEach((item) => {
      const row = document.createElement("li");
      row.className = "history-item";
      const value = document.createElement("span");
      value.className = "history-item-text";
      value.textContent = `🎯 ${item.result}`;
      const time = document.createElement("span");
      time.className = "history-item-time";
      time.textContent = item.time;
      row.append(value, time);
      historyList.append(row);
    });
  }

  function saveHistory(value) {
    const time = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    history.unshift({ result: value, time });
    history = history.slice(0, HISTORY_LIMIT);
    writeStorage(STORAGE_KEYS.history, history);
    updateHistoryDisplay();
  }

  function addOption() {
    const option = optionInput.value.trim();
    if (!option) {
      showAlert("Type a choice before adding it.");
      optionInput.focus();
      return;
    }
    if (option.length > MAX_OPTION_LENGTH) {
      showAlert(
        `Keep each choice to ${MAX_OPTION_LENGTH} characters or fewer.`,
      );
      return;
    }
    if (
      options.some(
        (existing) =>
          existing.toLocaleLowerCase() === option.toLocaleLowerCase(),
      )
    ) {
      showAlert("That choice is already on the wheel.");
      optionInput.select();
      return;
    }
    if (options.length >= MAX_OPTIONS) {
      showAlert(`This wheel supports up to ${MAX_OPTIONS} choices.`);
      return;
    }

    options.push(option);
    optionInput.value = "";
    persistOptions();
    updateOptionsDisplay();
    renderWheel();
    result.classList.remove("show");
    optionInput.focus();
  }

  function removeOption(index) {
    if (isSpinning) return;
    options.splice(index, 1);
    persistOptions();
    updateOptionsDisplay();
    renderWheel();
    result.classList.remove("show");
  }

  function loadPreset(name) {
    if (isSpinning || !presets[name]) return;
    options = [...presets[name]];
    persistOptions();
    updateOptionsDisplay();
    renderWheel();
    result.classList.remove("show");
    showAlert("Preset loaded. Your wheel is ready!", "success");
  }

  function addExamples() {
    if (isSpinning) return;
    const examples = [
      "Pizza",
      "Burger",
      "Tacos",
      "Sushi",
      "Pasta",
      "Salad",
      "Steak",
      "Ramen",
      "Curry",
      "Dumplings",
    ];
    const known = new Set(options.map((item) => item.toLocaleLowerCase()));
    const newOptions = examples.filter(
      (item) => !known.has(item.toLocaleLowerCase()),
    );
    const available = MAX_OPTIONS - options.length;
    if (available < 1 || newOptions.length === 0) {
      showAlert(
        options.length >= MAX_OPTIONS
          ? `This wheel is full (${MAX_OPTIONS} choices max).`
          : "All examples are already on the wheel.",
        "info",
      );
      return;
    }
    options.push(...newOptions.slice(0, available));
    persistOptions();
    updateOptionsDisplay();
    renderWheel();
    showAlert(
      `${Math.min(newOptions.length, available)} examples added.`,
      "success",
    );
  }

  function clearAll() {
    if (isSpinning || options.length === 0) return;
    if (!window.confirm("Clear all choices from this wheel?")) return;
    options = [];
    persistOptions();
    updateOptionsDisplay();
    renderWheel();
    result.classList.remove("show");
    showAlert("All choices cleared.", "success");
  }

  function showAlert(message, type = "error") {
    document.querySelector(".alert-message")?.remove();
    window.clearTimeout(alertTimer);
    const alert = document.createElement("div");
    alert.className = `alert-message ${type}`;
    alert.setAttribute("role", "status");
    alert.setAttribute("aria-live", "polite");
    alert.textContent = message;
    document.body.append(alert);
    alertTimer = window.setTimeout(() => alert.remove(), 3200);
  }

  function playTone(frequency, startOffset, duration, volume = 0.06) {
    if (!soundEnabled) return;
    try {
      const AudioContextConstructor =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) return;
      audioContext ||= new AudioContextConstructor();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + startOffset;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
    } catch {
      // Audio is an optional enhancement; the wheel still works without it.
    }
  }

  function playWinSound() {
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      playTone(frequency, index * 0.11, 0.32, 0.045);
    });
  }

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#6d56d9", "#e76f51", "#168aad", "#f4a261", "#2a9d8f"];
    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement("span");
      const duration = 1600 + Math.random() * 1500;
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = "-12px";
      piece.style.width = `${5 + Math.random() * 8}px`;
      piece.style.height = `${7 + Math.random() * 9}px`;
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.append(piece);
      piece.animate(
        [
          { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate3d(${(Math.random() - 0.5) * 180}px, 110vh, 0) rotate(${Math.random() * 600}deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: "cubic-bezier(.15,.7,.25,1)" },
      );
      window.setTimeout(() => piece.remove(), duration + 100);
    }
  }

  function finishSpin(selectedIndex) {
    const winner = options[selectedIndex];
    if (typeof winner !== "string") {
      isSpinning = false;
      updateSpinButton();
      return;
    }

    resultText.textContent = winner;
    result.classList.add("show");
    saveHistory(winner);
    isSpinning = false;

    if (removeWinner) {
      options.splice(selectedIndex, 1);
      persistOptions();
      updateOptionsDisplay();
      renderWheel();
    }
    updateSpinButton();
    playWinSound();
    celebrate();
  }

  function spin() {
    if (isSpinning || options.length < 2) return;
    isSpinning = true;
    updateSpinButton();
    result.classList.remove("show");

    const selectedIndex = Math.floor(Math.random() * options.length);
    const segmentAngle = 360 / options.length;
    const selectedCenter = (selectedIndex + 0.5) * segmentAngle;
    const targetRotation = (360 - selectedCenter) % 360;
    const currentRotation = ((rotation % 360) + 360) % 360;
    const correction = (targetRotation - currentRotation + 360) % 360;
    const fullTurns = 6 + Math.floor(Math.random() * 4);
    rotation += fullTurns * 360 + correction;

    playTone(180, 0, 0.7, 0.035);
    wheel.style.transform = `rotate(${rotation}deg)`;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 40
      : SPIN_DURATION;
    window.setTimeout(() => finishSpin(selectedIndex), duration + 80);
  }

  function updateSoundButton() {
    if (!soundToggle || !soundText) return;
    soundToggle.classList.toggle("muted", !soundEnabled);
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.setAttribute(
      "aria-label",
      soundEnabled ? "Turn sound off" : "Turn sound on",
    );
    soundText.textContent = soundEnabled ? "Sound on" : "Sound off";
  }

  $("#addOptionBtn")?.addEventListener("click", addOption);
  optionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addOption();
    }
  });
  $("#clearBtn")?.addEventListener("click", clearAll);
  $("#examplesBtn")?.addEventListener("click", addExamples);
  spinButton.addEventListener("click", spin);
  document.querySelectorAll(".preset-btn").forEach((button) => {
    button.addEventListener("click", () => loadPreset(button.dataset.preset));
  });

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      writeStorage(STORAGE_KEYS.sound, soundEnabled);
      updateSoundButton();
      showAlert(soundEnabled ? "Sound is on." : "Sound is off.", "info");
    });
  }

  if (removeWinnerToggle) {
    removeWinnerToggle.checked = removeWinner;
    removeWinnerToggle.addEventListener("change", () => {
      removeWinner = removeWinnerToggle.checked;
      writeStorage(STORAGE_KEYS.removeWinner, removeWinner);
      showAlert(
        removeWinner
          ? "Each winner will be removed from the wheel."
          : "Winners will stay on the wheel.",
        "info",
      );
    });
  }

  updateOptionsDisplay();
  renderWheel();
  updateHistoryDisplay();
  updateSoundButton();
  persistOptions();
})();
