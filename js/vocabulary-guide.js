// Vocabulary Guide JavaScript
// Simple, clean implementation focusing on the main page functionality

class VocabularyGuide {
  constructor() {
    this.vocabData = {};
    this.allWords = [];
    this.stats = this.loadStats();
    this.searchResults = [];

    this.init();
  }

  async init() {
    try {
      await this.loadVocabularyData();
      this.updateStatsDisplay();
      this.initializeSearch();
      this.showWelcomeMessage();
    } catch (error) {
      console.error("Failed to initialize vocabulary guide:", error);
      this.showError(
        "Failed to load vocabulary data. Please refresh the page."
      );
    }
  }

  async loadVocabularyData() {
    const paths = [
      "../vocab/vocab.json",
      "vocab/vocab.json",
      "/vocab/vocab.json",
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          this.vocabData = await response.json();
          this.allWords = [
            ...(this.vocabData.beginner || []),
            ...(this.vocabData.intermediate || []),
            ...(this.vocabData.advanced || []),
          ];
          console.log(`Loaded ${this.allWords.length} words from ${path}`);
          return;
        }
      } catch (error) {
        console.warn(`Failed to load from ${path}:`, error.message);
      }
    }
    throw new Error("Could not load vocabulary data");
  }

  loadStats() {
    const defaultStats = {
      wordsLearned: 0,
      quizzesCompleted: 0,
      streak: 0,
      lastStudyDate: null,
    };

    try {
      const saved = localStorage.getItem("vocabStats");
      return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    } catch (error) {
      console.error("Error loading stats:", error);
      return defaultStats;
    }
  }

  saveStats() {
    try {
      localStorage.setItem("vocabStats", JSON.stringify(this.stats));
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  }

  updateStatsDisplay() {
    const elements = {
      wordsLearnedCount: this.calculateLearnedWords(),
      quizzesCompletedCount: this.stats.quizzesCompleted || 0,
      studyStreakCount: this.stats.streak || 0,
      totalWordsCount: this.allWords.length,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  calculateLearnedWords() {
    try {
      const progress = JSON.parse(
        localStorage.getItem("vocabProgress") || "{}"
      );
      return Object.keys(progress).filter((word) => {
        const p = progress[word];
        return p.correct >= 3 && p.reviews >= 5;
      }).length;
    } catch (error) {
      console.error("Error calculating learned words:", error);
      return 0;
    }
  }

  initializeSearch() {
    const searchInput = document.getElementById("wordSearch");
    const searchButton = document.querySelector(".search-box button");

    if (!searchInput || !searchButton) {
      console.warn("Search elements not found");
      return;
    }

    // Real-time search
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        this.performSearch(query);
      } else if (query.length === 0) {
        this.clearSearchResults();
      }
    });

    // Search button
    searchButton.addEventListener("click", () => {
      this.performSearch(searchInput.value.trim());
    });

    // Enter key
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch(searchInput.value.trim());
      }
    });
  }

  performSearch(query) {
    if (!query || this.allWords.length === 0) {
      this.clearSearchResults();
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches = this.allWords.filter(
      (word) =>
        word.word.toLowerCase().includes(searchTerm) ||
        word.definition.toLowerCase().includes(searchTerm) ||
        (word.category && word.category.toLowerCase().includes(searchTerm)) ||
        (word.example && word.example.toLowerCase().includes(searchTerm))
    );

    this.displaySearchResults(matches, searchTerm);
  }

  displaySearchResults(matches, searchTerm) {
    const resultsContainer = document.getElementById("searchResults");
    if (!resultsContainer) return;

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="container">
          <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
            No words found matching "${searchTerm}".
          </p>
        </div>
      `;
      return;
    }

    // Sort by relevance
    matches.sort((a, b) => {
      const aExact = a.word.toLowerCase() === searchTerm;
      const bExact = b.word.toLowerCase() === searchTerm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = a.word.toLowerCase().startsWith(searchTerm);
      const bStarts = b.word.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return a.word.localeCompare(b.word);
    });

    const displayMatches = matches.slice(0, 20); // Limit results

    resultsContainer.innerHTML = `
      <div class="container">
        <h3 style="margin-bottom: 1.5rem; text-align: center;">
          Found ${matches.length} word${
      matches.length === 1 ? "" : "s"
    } matching "${searchTerm}"
        </h3>
        <div class="word-list">
          ${displayMatches
            .map((word) => this.renderWordResult(word, searchTerm))
            .join("")}
        </div>
        ${
          matches.length > 20
            ? `<p style="text-align: center; color: var(--text-secondary); margin-top: 1rem;">
            Showing first 20 results. Use a more specific search term to narrow results.
          </p>`
            : ""
        }
      </div>
    `;
  }

  renderWordResult(word, searchTerm) {
    return `
      <div class="word-result">
        <div class="word-header">
          <span class="word-title">${this.highlightTerm(
            word.word,
            searchTerm
          )}</span>
          <span class="word-pronunciation">${word.pronunciation || ""}</span>
        </div>
        <div class="word-definition">${this.highlightTerm(
          word.definition,
          searchTerm
        )}</div>
        ${
          word.example
            ? `<div class="word-example">Example: ${this.highlightTerm(
                word.example,
                searchTerm
              )}</div>`
            : ""
        }
        <div class="word-meta">
          <span class="word-category">${word.category || "General"}</span>
          <span class="word-level">${word.level || "Unknown"} level</span>
        </div>
      </div>
    `;
  }

  highlightTerm(text, term) {
    if (!term || !text) return text;
    const regex = new RegExp(`(${this.escapeRegex(term)})`, "gi");
    return text.replace(
      regex,
      '<mark style="background: rgba(255, 235, 59, 0.3); padding: 0.1em; border-radius: 2px;">$1</mark>'
    );
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  clearSearchResults() {
    const resultsContainer = document.getElementById("searchResults");
    if (resultsContainer) {
      resultsContainer.innerHTML = "";
    }
  }

  showWelcomeMessage() {
    this.showNotification(
      "Vocabulary guide loaded! 📚 Use the search above or choose a level below.",
      "success"
    );
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 10000;
      transform: translateX(400px);
      transition: all 0.3s ease;
      max-width: 300px;
    `;

    // Set background color based on type
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      info: "#46bbe5",
      warning: "#f59e0b",
    };
    notification.style.background = colors[type] || colors.info;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }, 4000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.vocabularyGuide = new VocabularyGuide();
});

// Utility function for level navigation
function navigateToLevel(level) {
  const levelPages = {
    beginner: "../vocab/vbeginner.html",
    intermediate: "../vocab/vintermediate.html",
    advanced: "../vocab/vadvanced.html",
  };

  if (levelPages[level]) {
    window.location.href = levelPages[level];
  }
}
