(() => {
  const dataNode = document.getElementById("topicVocabularyData");
  const cardButton = document.getElementById("topicVocabularyCard");
  if (!dataNode || !cardButton) return;

  let cards;
  try {
    cards = JSON.parse(dataNode.textContent).map((card) => ({
      ...card,
      status: "new",
    }));
  } catch (error) {
    console.error("Could not load the vocabulary cards.", error);
    return;
  }

  if (!cards.length) return;

  const elements = {
    card: cardButton,
    label: document.getElementById("topicCardLabel"),
    word: document.getElementById("topicCardWord"),
    definition: document.getElementById("topicCardDefinition"),
    example: document.getElementById("topicCardExample"),
    position: document.getElementById("topicCardPosition"),
    summary: document.getElementById("topicVocabularySummary"),
    progress: document.getElementById("topicVocabularyProgress"),
    panel: document.getElementById("topicVocabularyStudy"),
    complete: document.getElementById("topicVocabularyComplete"),
    completionSummary: document.getElementById("topicCompletionSummary"),
  };

  let currentIndex = 0;
  let isFlipped = false;

  function counts() {
    return cards.reduce(
      (total, card) => {
        if (card.status === "known") total.known += 1;
        else if (card.status === "practice") total.practice += 1;
        else total.new += 1;
        return total;
      },
      { known: 0, practice: 0, new: 0 },
    );
  }

  function render() {
    const card = cards[currentIndex];
    const totals = counts();
    elements.card.classList.toggle("is-flipped", isFlipped);
    elements.card.setAttribute("aria-pressed", String(isFlipped));
    elements.card.setAttribute(
      "aria-label",
      isFlipped
        ? `Definition: ${card.definition}`
        : `Show definition for ${card.word}`,
    );
    elements.label.textContent = isFlipped ? "Meaning" : "Vocabulary word";
    elements.word.textContent = card.word;
    elements.definition.hidden = !isFlipped;
    elements.example.hidden = !isFlipped;
    elements.definition.textContent = card.definition;
    elements.example.textContent = card.example
      ? `Example: ${card.example}`
      : "";
    elements.position.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
    elements.summary.textContent = `${totals.known} known · ${totals.practice} to practise · ${totals.new} not reviewed`;
    elements.progress.style.width = `${((cards.length - totals.new) / cards.length) * 100}%`;
    elements.progress.parentElement.setAttribute(
      "aria-valuenow",
      String(Math.round(((cards.length - totals.new) / cards.length) * 100)),
    );
  }

  function showCompletion() {
    const totals = counts();
    elements.panel.hidden = true;
    elements.complete.hidden = false;
    elements.completionSummary.textContent = `You marked ${totals.known} words as known and ${totals.practice} for more practice.`;
  }

  function moveToNextNewCard() {
    let nextNew = -1;
    for (let step = 1; step <= cards.length; step += 1) {
      const candidate = (currentIndex + step) % cards.length;
      if (cards[candidate].status === "new") {
        nextNew = candidate;
        break;
      }
    }
    if (nextNew === -1) {
      showCompletion();
      return;
    }
    currentIndex = nextNew;
    isFlipped = false;
    render();
  }

  cardButton.addEventListener("click", () => {
    isFlipped = !isFlipped;
    render();
  });

  document.getElementById("topicMarkKnown").addEventListener("click", () => {
    cards[currentIndex].status = "known";
    moveToNextNewCard();
  });

  document.getElementById("topicMarkPractice").addEventListener("click", () => {
    cards[currentIndex].status = "practice";
    moveToNextNewCard();
  });

  document.getElementById("topicPreviousCard").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    isFlipped = false;
    render();
  });

  document.getElementById("topicNextCard").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    isFlipped = false;
    render();
  });

  document.getElementById("topicShuffleCards").addEventListener("click", () => {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const otherIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[otherIndex]] = [cards[otherIndex], cards[index]];
    }
    currentIndex = 0;
    isFlipped = false;
    render();
  });

  function reset() {
    cards.forEach((card) => {
      card.status = "new";
    });
    currentIndex = 0;
    isFlipped = false;
    elements.complete.hidden = true;
    elements.panel.hidden = false;
    render();
  }

  document.getElementById("topicResetCards").addEventListener("click", reset);
  document.getElementById("topicRestartCards").addEventListener("click", reset);
  render();
})();
