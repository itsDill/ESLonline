// Fix for idioms-compact.html
// Replaces inline onclick handlers with proper event listeners
// This improves security and implements the missing revealAnswer function

(function () {
  "use strict";

  /**
   * Initialize reveal answer functionality
   * Handles showing/hiding answer sections for idiom cards
   */
  function initRevealAnswers() {
    // Find all reveal buttons
    const revealButtons = document.querySelectorAll(".reveal-btn[data-answer]");

    revealButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        // Get the answer ID from data attribute
        const answerId = "answer-" + this.getAttribute("data-answer");
        const answerSection = document.getElementById(answerId);

        if (answerSection) {
          // Toggle visibility with animation
          answerSection.classList.toggle("visible");

          // Change button text to reflect state
          if (answerSection.classList.contains("visible")) {
            this.textContent = "Hide Meaning";
            this.setAttribute("aria-expanded", "true");
          } else {
            this.textContent = "Reveal Meaning";
            this.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Add keyboard accessibility
      button.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });

      // Set initial ARIA attributes for accessibility
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("role", "button");
    });
  }

  /**
   * Fallback function for inline onclick handlers (if they still exist)
   * This is for backwards compatibility during migration
   */
  window.revealAnswer = function (answerNumber) {
    const answerId = "answer-" + answerNumber;
    const answerSection = document.getElementById(answerId);

    if (answerSection) {
      answerSection.classList.toggle("visible");

      // Find the corresponding button
      const button = document.querySelector(`[data-answer="${answerNumber}"]`);
      if (button) {
        if (answerSection.classList.contains("visible")) {
          button.textContent = "Hide Meaning";
          button.setAttribute("aria-expanded", "true");
        } else {
          button.textContent = "Reveal Meaning";
          button.setAttribute("aria-expanded", "false");
        }
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRevealAnswers);
  } else {
    initRevealAnswers();
  }
})();

/*
 * CSS to add to idioms page stylesheet:
 *
 * .answer-section {
 *   max-height: 0;
 *   overflow: hidden;
 *   transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
 *   opacity: 0;
 * }
 *
 * .answer-section.visible {
 *   max-height: 500px;
 *   opacity: 1;
 * }
 *
 * .reveal-btn {
 *   cursor: pointer;
 *   transition: all 0.2s ease;
 * }
 *
 * .reveal-btn:focus {
 *   outline: 2px solid #46bbe5;
 *   outline-offset: 2px;
 * }
 */

/*
 * IMPLEMENTATION STEPS:
 *
 * 1. In idioms-compact.html, find all buttons like:
 *    <button class="reveal-btn" onclick="revealAnswer(1)">Reveal Meaning</button>
 *
 * 2. Replace with:
 *    <button class="reveal-btn" data-answer="1">Reveal Meaning</button>
 *
 * 3. Add this script before closing </body> tag in idioms-compact.html:
 *    <script src="path/to/this-file.js"></script>
 *
 * 4. Or copy the entire function into the page's <script> section
 *
 * 5. Add the CSS rules above to the page's stylesheet
 *
 * 6. Test that all answer reveals work properly
 */
