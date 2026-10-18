(() => {
  "use strict";

  const resources = [
    {
      id: "classroom-timer",
      title: "Classroom Timer",
      category: "classroom",
      description:
        "Set a clear countdown for pair work, warm-ups, and other timed class activities.",
      type: "interactive",
      level: ["any"],
      skills: ["lesson pacing", "speaking", "group work"],
      contexts: [
        "classroom",
        "online lesson",
        "one-to-one",
        "children",
        "teens",
        "adults",
      ],
      keywords: ["countdown", "clock", "time limit", "stopwatch", "timer"],
      icon: "fas fa-hourglass-end",
      url: "./tools/time.html",
      useCase: "Set a time limit and keep activities moving",
    },
    {
      id: "presentation-timer",
      title: "Presentation Timer",
      category: "classroom",
      description:
        "Display a visual countdown while learners practise talks and presentations.",
      type: "interactive",
      level: ["any"],
      skills: ["speaking", "presentations", "fluency"],
      contexts: ["classroom", "online lesson", "teens", "adults", "group work"],
      keywords: ["speech", "countdown", "timing"],
      icon: "fas fa-stopwatch",
      url: "./tools/presentation-timer.html",
      useCase: "Keep presentations and speaking turns on time",
    },
    {
      id: "random-picker",
      title: "Classroom Random Picker",
      category: "classroom",
      description:
        "Choose a student or option at random to invite fair participation.",
      type: "interactive",
      level: ["any"],
      skills: ["participation", "speaking", "classroom routines"],
      contexts: [
        "classroom",
        "online lesson",
        "children",
        "teens",
        "adults",
        "group work",
      ],
      keywords: [
        "student selector",
        "name picker",
        "random generator",
        "spinner",
      ],
      icon: "fas fa-shuffle",
      url: "./tools/random.html",
      useCase: "Select a student or prompt fairly",
    },
    {
      id: "dice-roller",
      title: "Dice Roller",
      category: "game-support",
      description:
        "Roll virtual dice to add a simple chance element to classroom games.",
      type: "interactive",
      level: ["any"],
      skills: ["speaking", "vocabulary", "games"],
      contexts: [
        "classroom",
        "online lesson",
        "children",
        "teens",
        "adults",
        "group work",
      ],
      keywords: ["die", "random number", "board game"],
      icon: "fas fa-dice",
      url: "./tools/dice.html",
      useCase: "Add a random roll to a classroom game",
    },
    {
      id: "spin-wheel",
      title: "Spin Wheel",
      category: "game-support",
      description:
        "Use a customizable wheel to choose a prompt, turn, or classroom reward.",
      type: "interactive",
      level: ["any"],
      skills: ["speaking", "vocabulary", "games"],
      contexts: [
        "classroom",
        "online lesson",
        "children",
        "teens",
        "adults",
        "group work",
      ],
      keywords: ["spinner", "random choice", "wheel of names"],
      icon: "fas fa-compact-disc",
      url: "../resources/tools/spin.html",
      useCase: "Choose a prompt or turn at random",
    },
    {
      id: "typing-speed-test",
      title: "Typing Speed Test",
      category: "assessment",
      description: "Practise English typing and check speed and accuracy.",
      type: "practice",
      level: ["any"],
      skills: ["typing", "spelling", "accuracy"],
      contexts: [
        "computer lab",
        "online lesson",
        "teens",
        "adults",
        "independent practice",
      ],
      keywords: ["keyboard", "wpm", "typing practice"],
      icon: "fas fa-keyboard",
      url: "../resources/tools/typing-test.html",
      useCase: "Practise accurate English typing",
    },
    {
      id: "maths-test",
      title: "Maths Test",
      category: "assessment",
      description:
        "A quick maths practice tool; this activity is not specific to English learning.",
      type: "practice",
      level: ["any"],
      skills: ["maths", "numeracy"],
      contexts: ["classroom", "independent practice"],
      keywords: ["math", "arithmetic", "numbers"],
      icon: "fas fa-calculator",
      url: "./tools/maths-test.html",
      useCase: "Offer a short maths warm-up or practice task",
    },
    {
      id: "chinese-flashcards",
      title: "Chinese Flashcards",
      category: "assessment",
      description:
        "Review Chinese vocabulary with digital flashcards. This resource is for Chinese study, not English vocabulary.",
      type: "practice",
      level: ["any"],
      skills: ["vocabulary", "recall"],
      contexts: ["independent practice", "classroom"],
      keywords: ["flash cards", "word review", "Chinese language"],
      icon: "fas fa-clone",
      url: "../resources/tools/flashcards-chinese.html",
      useCase: "Review Chinese words with digital cards",
    },
    {
      id: "japanese-flashcards",
      title: "Japanese Flashcards",
      category: "assessment",
      description:
        "Review Japanese vocabulary with digital flashcards. This resource is for Japanese study, not English vocabulary.",
      type: "practice",
      level: ["any"],
      skills: ["vocabulary", "recall"],
      contexts: ["independent practice", "classroom"],
      keywords: ["flash cards", "word review", "Japanese language"],
      icon: "fas fa-clone",
      url: "../resources/tools/flashcards-japanese.html",
      useCase: "Review Japanese words with digital cards",
    },
    {
      id: "speaking-activities",
      title: "Speaking Activities & Conversation Practice",
      category: "planning",
      description:
        "Browse warm-ups, discussion prompts, role plays, and speaking challenges for beginner, intermediate, and advanced learners.",
      type: "activity",
      level: ["beginner", "intermediate", "advanced"],
      skills: ["speaking", "conversation", "fluency", "pronunciation"],
      contexts: [
        "classroom",
        "online lesson",
        "one-to-one",
        "teens",
        "adults",
        "pair work",
        "group work",
      ],
      keywords: [
        "lesson plan",
        "role play",
        "discussion",
        "conversation prompts",
      ],
      icon: "fas fa-comments",
      url: "./tools/lessonplan.html",
      useCase: "Choose a speaking task for the lesson",
    },
    {
      id: "swot-analysis",
      title: "SWOT Analysis Tool",
      category: "planning",
      description:
        "Use a structured strengths, weaknesses, opportunities, and threats framework.",
      type: "interactive",
      level: ["any"],
      skills: ["critical thinking", "business English", "writing"],
      contexts: ["teens", "adults", "online lesson", "classroom", "group work"],
      keywords: ["strategic planning", "framework", "business"],
      icon: "fas fa-chart-pie",
      url: "./tools/swot-analysis.html",
      useCase: "Structure a business English discussion or analysis",
    },
    {
      id: "business-vocabulary-quiz",
      title: "Business Vocabulary Quiz",
      category: "assessment",
      description:
        "Practise business, finance, strategy, operations, and HR vocabulary in a quiz.",
      type: "practice",
      level: ["any"],
      skills: ["business vocabulary", "reading", "assessment"],
      contexts: [
        "adults",
        "online lesson",
        "classroom",
        "independent practice",
      ],
      keywords: [
        "decision matrix",
        "consultancy",
        "finance",
        "quiz",
        "workplace English",
      ],
      icon: "fas fa-briefcase",
      url: "./tools/decision-matrix.html",
      useCase: "Check learners' understanding of workplace terms",
    },
    {
      id: "case-study-test",
      title: "Business Case Study Test",
      category: "assessment",
      description:
        "Read a business scenario and answer questions from a consultant's perspective.",
      type: "practice",
      level: ["any"],
      skills: ["reading", "business English", "critical thinking"],
      contexts: [
        "adults",
        "online lesson",
        "classroom",
        "independent practice",
      ],
      keywords: ["case study", "scenario", "comprehension", "consultant"],
      icon: "fas fa-folder-open",
      url: "./tools/case-study.html",
      useCase: "Discuss a workplace scenario and its options",
    },
    {
      id: "industry-keywords",
      title: "Industry Keywords & Vocabulary",
      category: "generator",
      description:
        "Explore professional terms across industry topics using flashcards and quizzes.",
      type: "practice",
      level: ["beginner", "intermediate", "advanced"],
      skills: ["vocabulary", "business English", "reading"],
      contexts: [
        "adults",
        "online lesson",
        "classroom",
        "independent practice",
      ],
      keywords: [
        "keyword generator",
        "terminology",
        "professional vocabulary",
        "flashcards",
      ],
      icon: "fas fa-tags",
      url: "./tools/keywords.html",
      useCase: "Review professional vocabulary by topic",
    },
    {
      id: "jobs-vocabulary",
      title: "Jobs & Careers Vocabulary",
      category: "generator",
      description:
        "Review vocabulary for occupations and careers, including useful job-interview language.",
      type: "practice",
      level: ["any"],
      skills: ["vocabulary", "speaking", "career English"],
      contexts: ["teens", "adults", "online lesson", "classroom"],
      keywords: ["professions", "occupations", "interview", "work"],
      icon: "fas fa-briefcase",
      url: "../resources/tools/jobs.html",
      useCase: "Introduce jobs vocabulary or prepare interview practice",
    },
    {
      id: "christmas-tree-activity",
      title: "Christmas Tree Activity",
      category: "game-support",
      description:
        "An interactive seasonal decorating activity for a festive class break.",
      type: "activity",
      level: ["any"],
      skills: ["seasonal vocabulary", "speaking", "classroom games"],
      contexts: [
        "classroom",
        "online lesson",
        "children",
        "teens",
        "group work",
      ],
      keywords: ["holiday", "Christmas", "festive", "winter"],
      icon: "fas fa-tree",
      url: "./tools/christmas-tree.html",
      useCase: "Add a seasonal activity to a holiday lesson",
    },
  ];

  const categoryLabels = {
    classroom: "Classroom management",
    assessment: "Practice & assessment",
    generator: "Vocabulary & generators",
    "game-support": "Game support",
    planning: "Planning & activities",
  };
  const typeLabels = {
    interactive: "Interactive tool",
    activity: "Class activity",
    practice: "Practice & reference",
  };
  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const savedKey = "eslTeacherHubFavorites";
  const searchInput = document.getElementById("toolSearch");
  const filters = document.getElementById("teacherFilters");
  const grid = document.getElementById("toolsGrid");
  const emptyState = document.getElementById("noToolsMessage");
  const resultCount = document.getElementById("resultsCount");

  function normalize(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function oneEditApart(left, right) {
    if (Math.abs(left.length - right.length) > 1) return false;
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < left.length && j < right.length) {
      if (left[i] === right[j]) {
        i += 1;
        j += 1;
        continue;
      }
      edits += 1;
      if (edits > 1) return false;
      if (
        left.length === right.length &&
        i + 1 < left.length &&
        j + 1 < right.length &&
        left[i] === right[j + 1] &&
        left[i + 1] === right[j]
      ) {
        return left.slice(i + 2) === right.slice(j + 2);
      }
      if (left.length > right.length) i += 1;
      else if (right.length > left.length) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
    return edits + (i < left.length || j < right.length ? 1 : 0) <= 1;
  }

  function searchMatches(resource, query) {
    const queryWords = normalize(query).split(/\s+/).filter(Boolean);
    if (!queryWords.length) return true;
    const searchable = normalize(
      [
        resource.title,
        resource.description,
        resource.useCase,
        categoryLabels[resource.category],
        typeLabels[resource.type],
        ...resource.skills,
        ...resource.contexts,
        ...resource.keywords,
        ...resource.level,
      ].join(" "),
    ).split(/\s+/);

    return queryWords.every((queryWord) =>
      searchable.some(
        (word) =>
          word.includes(queryWord) ||
          (queryWord.length >= 5 &&
            word.length >= 5 &&
            oneEditApart(word, queryWord)),
      ),
    );
  }

  function getSavedIds() {
    try {
      const stored = JSON.parse(localStorage.getItem(savedKey) || "[]");
      return new Set(
        Array.isArray(stored)
          ? stored.filter((id) => typeof id === "string")
          : [],
      );
    } catch {
      return new Set();
    }
  }

  function renderResources() {
    const category = document.getElementById("categoryFilter").value;
    const level = document.getElementById("levelFilter").value;
    const type = document.getElementById("typeFilter").value;
    const favoritesOnly = document.getElementById("favoritesOnly").checked;
    const saved = getSavedIds();
    const filtered = resources.filter((resource) => {
      const levelMatch =
        level === "all" ||
        resource.level.includes("any") ||
        resource.level.includes(level);
      return (
        (category === "all" || resource.category === category) &&
        levelMatch &&
        (type === "all" || resource.type === type) &&
        (!favoritesOnly || saved.has(resource.id)) &&
        searchMatches(resource, searchInput.value)
      );
    });

    grid.innerHTML = filtered
      .map((resource) => {
        const levelBadges = resource.level.includes("any")
          ? '<span class="teacher-resource-tag">Any level</span>'
          : resource.level
              .map(
                (item) =>
                  `<span class="teacher-resource-tag">${levelLabels[item]}</span>`,
              )
              .join("");
        const isSaved = saved.has(resource.id);
        return `
        <article class="teacher-resource-card">
          <a href="${resource.url}" class="tool-card" aria-label="Open ${resource.title}">
            <span class="tool-icon" aria-hidden="true"><i class="${resource.icon}"></i></span>
            <div class="tool-content">
              <div class="teacher-resource-tags">
                <span class="teacher-resource-tag teacher-resource-type">${typeLabels[resource.type]}</span>
                ${levelBadges}
              </div>
              <h3>${resource.title}</h3>
              <p>${resource.description}</p>
              <div class="use-case"><i class="fas fa-lightbulb" aria-hidden="true"></i><span>${resource.useCase}</span></div>
              <span class="teacher-resource-category">${categoryLabels[resource.category]}</span>
            </div>
            <span class="tool-arrow" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
          </a>
          <button class="teacher-save-button${isSaved ? " is-saved" : ""}" type="button" data-save-resource="${resource.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove" : "Save"} ${resource.title} ${isSaved ? "from" : "to"} saved resources">
            <i class="${isSaved ? "fas" : "far"} fa-bookmark" aria-hidden="true"></i>
            <span>${isSaved ? "Saved" : "Save"}</span>
          </button>
        </article>`;
      })
      .join("");

    emptyState.hidden = filtered.length !== 0;
    resultCount.textContent = `Showing ${filtered.length} of ${resources.length} resources`;
    document.getElementById("toolCountNote").textContent =
      `${resources.length} practical resources · Free to use · No account required`;
  }

  function resetFilters() {
    searchInput.value = "";
    document.getElementById("categoryFilter").value = "all";
    document.getElementById("levelFilter").value = "all";
    document.getElementById("typeFilter").value = "all";
    document.getElementById("favoritesOnly").checked = false;
    renderResources();
  }

  filters.addEventListener("submit", (event) => event.preventDefault());
  filters.addEventListener("change", renderResources);
  searchInput.addEventListener("input", renderResources);
  document
    .getElementById("clearFilters")
    .addEventListener("click", resetFilters);
  document
    .querySelectorAll("[data-reset-filters]")
    .forEach((button) => button.addEventListener("click", resetFilters));

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save-resource]");
    if (!button) return;
    const saved = getSavedIds();
    const resourceId = button.dataset.saveResource;
    if (saved.has(resourceId)) saved.delete(resourceId);
    else saved.add(resourceId);
    try {
      localStorage.setItem(savedKey, JSON.stringify([...saved]));
    } catch {
      // The library still works if browser storage is disabled or full.
    }
    renderResources();
    const updatedButton = grid.querySelector(
      `[data-save-resource="${resourceId}"]`,
    );
    (updatedButton || document.getElementById("favoritesOnly")).focus();
  });

  renderResources();
})();
