/**
 * Reusable Footer Component
 * ESL Fun Online - Standardized Footer for All Pages
 */

const FooterComponent = {
  // Generate the footer HTML dynamically based on page location
  generateFooterHTML(pagePath = "") {
    // Determine the relative path based on current page location
    const basePath = this.getBasePath(pagePath);

    return `
    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>ESL Fun Online</h3>
            <p>
              Your go-to platform for premium English learning resources,
              interactive coding tutorials, and comprehensive test preparation
              materials. Join us to enhance your skills and achieve your goals.
            </p>
          </div>

          <div class="footer-section">
            <h3>English Learning</h3>
            <ul>
              <li>
                <a href="${basePath}english/grammar.html">
                  <i class="fas fa-spell-check"></i> Grammar Guide
                </a>
              </li>
              <li>
                <a href="${basePath}english/vocabguide.html">
                  <i class="fas fa-book-open"></i> Vocabulary Builder
                </a>
              </li>
              <li>
                <a href="${basePath}english/ielts.html">
                  <i class="fas fa-certificate"></i> IELTS Preparation
                </a>
              </li>
              <li>
                <a href="${basePath}english/toeic.html">
                  <i class="fas fa-briefcase"></i> TOEIC Preparation
                </a>
              </li>
              <li>
                <a href="${basePath}english/eiken.html">
                  <i class="fas fa-graduation-cap"></i> EIKEN Preparation
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Programming</h3>
            <ul>
              <li>
                <a href="${basePath}coding/computerbasics.html">
                  <i class="fas fa-desktop"></i> Computer Basics
                </a>
              </li>
              <li>
                <a href="${basePath}coding/ai.html">
                  <i class="fas fa-robot"></i> AI Basics
                </a>
              </li>
              <li>
                <a href="${basePath}coding/codingresources.html">
                  <i class="fas fa-code"></i> Coding Basics
                </a>
              </li>
              <li>
                <a href="${basePath}games/games.html">
                  <i class="fas fa-gamepad"></i> Coding Games
                </a>
              </li>
              <li>
                <a href="${basePath}tools/tools.html">
                  <i class="fas fa-tools"></i> Developer Tools
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="${basePath}blog/blog.html">
                  <i class="fas fa-blog"></i> Learning Blog
                </a>
              </li>
              <li>
                <a href="${basePath}tools/tools.html">
                  <i class="fas fa-toolbox"></i> Study Tools
                </a>
              </li>
              <li>
                <a href="${basePath}games/games.html">
                  <i class="fas fa-dice"></i> Educational Games
                </a>
              </li>
              <li>
                <a href="${basePath}questions.html">
                  <i class="fas fa-question-circle"></i> Help Center
                </a>
              </li>
              <li>
                <a href="${basePath}contact.html">
                  <i class="fas fa-envelope"></i> Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 ESL Fun Online. All rights reserved.</p>
          <div class="footer-links">
            <a href="${basePath}privacy.html">Privacy Policy</a>
            <a href="${basePath}terms.html">Terms of Service</a>
            <a href="${basePath}cookies.html">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
    `;
  },

  // Determine the base path for links based on current page location
  getBasePath(pagePath) {
    // If no path provided, try to determine from current location
    if (!pagePath) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath
        .split("/")
        .filter((part) => part.length > 0);

      // Count how many levels deep we are
      const depth = pathParts.length - 1; // -1 because we don't count the filename

      if (depth === 0) {
        return "./"; // Root level
      } else {
        return "../".repeat(depth);
      }
    }

    // If path provided, calculate relative path
    const parts = pagePath
      .split("/")
      .filter((part) => part.length > 0 && part !== "index.html");
    return parts.length === 0 ? "./" : "../".repeat(parts.length);
  },

  // Initialize footer on page load
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.insertFooter();
    });
  },

  // Insert footer into the page if it doesn't exist
  insertFooter() {
    const existingFooter = document.querySelector("footer");
    const footerPlaceholder = document.querySelector("#footer-placeholder");

    if (!existingFooter && !footerPlaceholder) {
      // Insert footer before the closing body tag
      const footerHTML = this.generateFooterHTML();
      document.body.insertAdjacentHTML("beforeend", footerHTML);
    } else if (footerPlaceholder) {
      // Replace placeholder with actual footer
      footerPlaceholder.outerHTML = this.generateFooterHTML();
    }
  },

  // Update existing footer if needed
  updateFooter(pagePath) {
    const existingFooter = document.querySelector("footer");
    if (existingFooter) {
      const newFooterHTML = this.generateFooterHTML(pagePath);
      existingFooter.outerHTML = newFooterHTML;
    }
  },
};

// Auto-initialize if not already initialized
if (typeof window !== "undefined") {
  FooterComponent.init();
}

// Export for use in other scripts
window.FooterComponent = FooterComponent;
