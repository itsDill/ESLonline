/**
 * Blog Enhancement Script
 * ESL Fun Online - Enhanced blog functionality with performance optimizations
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    INTERSECTION_THRESHOLD: 0.1,
    AUTO_HIDE_DELAY: 3000,
  };

  // Enhanced functionality for blog posts
  class BlogEnhancements {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener("DOMContentLoaded", () => {
        this.initLazyLoading();
        this.initReadingProgress();
        this.initSmoothScrolling();
        this.initImageZoom();
        this.initPrintOptimization();
        this.initOfflineDetection();
        this.initReadingTime();
        this.initTableOfContents();
      });
    }

    // Lazy loading for images and content
    initLazyLoading() {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.remove("lazy");
              observer.unobserve(img);
            }
          });
        });

        document.querySelectorAll("img[data-src]").forEach((img) => {
          imageObserver.observe(img);
        });
      }
    }

    // Reading progress indicator
    initReadingProgress() {
      const progressBar = document.createElement("div");
      progressBar.className = "reading-progress";
      progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
      document.body.appendChild(progressBar);

      // Add styles
      const style = document.createElement("style");
      style.textContent = `
        .reading-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(70, 187, 229, 0.2);
          z-index: 9999;
          pointer-events: none;
        }
        
        .reading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #46bbe5, #10b981);
          width: 0%;
          transition: width 0.1s ease;
        }
      `;
      document.head.appendChild(style);

      // Update progress on scroll
      const updateProgress = () => {
        const winScroll = window.pageYOffset;
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector(".reading-progress-bar").style.width =
          scrolled + "%";
      };

      window.addEventListener("scroll", this.throttle(updateProgress, 10));
    }

    // Smooth scrolling for internal links
    initSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    }

    // Image zoom functionality
    initImageZoom() {
      document
        .querySelectorAll(".post-image, .demo-result img")
        .forEach((img) => {
          img.style.cursor = "zoom-in";
          img.addEventListener("click", () => {
            this.createImageModal(img);
          });
        });
    }

    createImageModal(img) {
      const modal = document.createElement("div");
      modal.className = "image-modal";
      modal.innerHTML = `
        <div class="image-modal-backdrop">
          <div class="image-modal-content">
            <img src="${img.src}" alt="${img.alt}" class="modal-image">
            <button class="modal-close" aria-label="Close image">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `;

      // Add modal styles
      if (!document.querySelector("#image-modal-styles")) {
        const style = document.createElement("style");
        style.id = "image-modal-styles";
        style.textContent = `
          .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
          }
          
          .image-modal-backdrop {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .image-modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
          }
          
          .modal-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }
          
          .modal-close {
            position: absolute;
            top: -15px;
            right: -15px;
            background: #ef4444;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          .modal-close:hover {
            background: #dc2626;
            transform: scale(1.1);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(modal);

      // Close modal functionality
      const closeModal = () => {
        modal.style.animation = "fadeIn 0.3s ease reverse";
        setTimeout(() => modal.remove(), 300);
      };

      modal.querySelector(".modal-close").addEventListener("click", closeModal);
      modal
        .querySelector(".image-modal-backdrop")
        .addEventListener("click", (e) => {
          if (e.target === e.currentTarget) closeModal();
        });

      document.addEventListener("keydown", function escapeHandler(e) {
        if (e.key === "Escape") {
          closeModal();
          document.removeEventListener("keydown", escapeHandler);
        }
      });
    }

    // Print optimization
    initPrintOptimization() {
      const printStyles = document.createElement("style");
      printStyles.media = "print";
      printStyles.textContent = `
        @media print {
          .sidebar, .pagination, .back-to-top,
          .image-modal, .notification, footer {
            display: none !important;
          }
          
          .main-content {
            width: 100% !important;
            max-width: none !important;
          }
          
          .blog-post {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .code-snippet {
            border: 1px solid #000;
            background: #f5f5f5 !important;
            color: #000 !important;
          }
          
          a {
            color: #000 !important;
            text-decoration: underline !important;
          }
          
          .post-image {
            max-height: 200px;
            object-fit: cover;
          }
        }
      `;
      document.head.appendChild(printStyles);
    }

    // Offline detection
    initOfflineDetection() {
      const showOfflineMessage = () => {
        if (window.showNotification) {
          showNotification(
            "You are currently offline. Some features may not work properly.",
            "warning"
          );
        }
      };

      const showOnlineMessage = () => {
        if (window.showNotification) {
          showNotification(
            "Connection restored! All features are now available.",
            "success"
          );
        }
      };

      window.addEventListener("offline", showOfflineMessage);
      window.addEventListener("online", showOnlineMessage);
    }

    // Calculate and display reading time
    initReadingTime() {
      const posts = document.querySelectorAll(".blog-post");
      posts.forEach((post) => {
        const content = post.querySelector(".post-excerpt");
        if (content) {
          const wordCount = content.textContent.split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

          const meta = post.querySelector(".post-meta");
          if (meta && !meta.querySelector(".reading-time")) {
            const timeSpan = document.createElement("span");
            timeSpan.className = "reading-time";
            timeSpan.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> ${readingTime} min read`;
            meta.appendChild(timeSpan);
          }
        }
      });
    }

    // Auto-generate table of contents for long articles
    initTableOfContents() {
      const articles = document.querySelectorAll(".article-content");
      articles.forEach((article) => {
        const headings = article.querySelectorAll("h2, h3");
        if (headings.length >= 3) {
          this.createTableOfContents(article, headings);
        }
      });
    }

    createTableOfContents(article, headings) {
      const toc = document.createElement("div");
      toc.className = "table-of-contents";
      toc.innerHTML = `
        <div class="toc-header">
          <h3><i class="fas fa-list"></i> Table of Contents</h3>
          <button class="toc-toggle" aria-label="Toggle table of contents">
            <i class="fas fa-chevron-up"></i>
          </button>
        </div>
        <nav class="toc-nav">
          <ul class="toc-list">
            ${Array.from(headings)
              .map((heading, index) => {
                const id = `heading-${index}`;
                heading.id = id;
                const level = heading.tagName.toLowerCase();
                return `
                <li class="toc-item toc-${level}">
                  <a href="#${id}" class="toc-link">${heading.textContent}</a>
                </li>
              `;
              })
              .join("")}
          </ul>
        </nav>
      `;

      // Add TOC styles
      if (!document.querySelector("#toc-styles")) {
        const style = document.createElement("style");
        style.id = "toc-styles";
        style.textContent = `
          .table-of-contents {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            margin: 2rem 0;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
          }
          
          .toc-header {
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .toc-header h3 {
            margin: 0;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .toc-toggle {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background 0.3s ease;
          }
          
          .toc-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .toc-nav {
            padding: 1rem 0;
            max-height: 300px;
            overflow-y: auto;
          }
          
          .toc-nav.collapsed {
            display: none;
          }
          
          .toc-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .toc-item {
            margin: 0;
          }
          
          .toc-link {
            display: block;
            padding: 0.5rem 1.5rem;
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
          }
          
          .toc-link:hover {
            background: var(--bg-primary);
            border-left-color: var(--primary-color);
            color: var(--primary-color);
          }
          
          .toc-h3 .toc-link {
            padding-left: 2.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
          
          @media (max-width: 768px) {
            .table-of-contents {
              margin: 1rem 0;
            }
            
            .toc-header {
              padding: 0.75rem 1rem;
            }
            
            .toc-link {
              padding: 0.4rem 1rem;
              font-size: 0.9rem;
            }
            
            .toc-h3 .toc-link {
              padding-left: 2rem;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Insert TOC at the beginning of article
      const firstSection = article.querySelector(".content-section");
      if (firstSection) {
        firstSection.parentNode.insertBefore(toc, firstSection);
      }

      // Toggle functionality
      const toggle = toc.querySelector(".toc-toggle");
      const nav = toc.querySelector(".toc-nav");

      toggle.addEventListener("click", () => {
        nav.classList.toggle("collapsed");
        const icon = toggle.querySelector("i");
        icon.className = nav.classList.contains("collapsed")
          ? "fas fa-chevron-down"
          : "fas fa-chevron-up";
      });
    }

    // Utility functions
    throttle(func, limit) {
      let lastFunc;
      let lastRan;
      return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function () {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }

  // Enhanced blog navigation for main blog page
  class BlogNavigation {
    constructor() {
      if (document.querySelector(".posts-container")) {
        this.initBlogFeatures();
      }
    }

    initBlogFeatures() {
      this.initCategoryFiltering();
      this.initSearchEnhancement();
      this.initPostAnimations();
    }

    initCategoryFiltering() {
      const categoryLinks = document.querySelectorAll(".category-link");
      categoryLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const category = link.dataset.category;
          this.filterPostsByCategory(category);
          this.updateActiveCategory(link);
        });
      });

      // Initialize with all posts
      this.filterPostsByCategory("all");
    }

    filterPostsByCategory(category) {
      const posts = document.querySelectorAll(".blog-post");
      let visibleCount = 0;

      posts.forEach((post) => {
        const postCategory = post.dataset.category;
        const shouldShow = category === "all" || postCategory === category;

        if (shouldShow) {
          post.style.display = "block";
          post.style.animation = `fadeInUp ${
            CONFIG.ANIMATION_DURATION
          }ms ease ${visibleCount * 100}ms`;
          visibleCount++;
        } else {
          post.style.display = "none";
        }
      });

      // Update no posts message
      const noPostsMsg = document.getElementById("noPosts");
      if (noPostsMsg) {
        noPostsMsg.style.display = visibleCount === 0 ? "block" : "none";
      }

      // Update URL without page reload
      const url = new URL(window.location);
      if (category !== "all") {
        url.searchParams.set("category", category);
      } else {
        url.searchParams.delete("category");
      }
      window.history.replaceState({}, "", url);
    }

    updateActiveCategory(activeLink) {
      document.querySelectorAll(".category-link").forEach((link) => {
        link.classList.remove("active");
      });
      activeLink.classList.add("active");
    }

    initSearchEnhancement() {
      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        const debouncedSearch = this.debounce(
          this.performSearch.bind(this),
          CONFIG.DEBOUNCE_DELAY
        );
        searchInput.addEventListener("input", debouncedSearch);

        // Add search suggestions
        this.initSearchSuggestions(searchInput);
      }
    }

    initSearchSuggestions(searchInput) {
      const suggestions = document.createElement("div");
      suggestions.className = "search-suggestions";
      suggestions.style.display = "none";
      searchInput.parentNode.appendChild(suggestions);

      const popularSearches = [
        "conversation tips",
        "grammar help",
        "javascript tutorial",
        "classroom management",
        "lesson planning",
        "web development",
        "pronunciation practice",
        "business english",
        "coding basics",
      ];

      searchInput.addEventListener("focus", () => {
        if (!searchInput.value.trim()) {
          suggestions.innerHTML = `
            <div class="suggestions-header">Popular Searches</div>
            ${popularSearches
              .map(
                (term) => `
              <div class="suggestion-item" data-term="${term}">
                <i class="fas fa-search"></i>
                ${term}
              </div>
            `
              )
              .join("")}
          `;
          suggestions.style.display = "block";
        }
      });

      // Hide suggestions when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !searchInput.contains(e.target) &&
          !suggestions.contains(e.target)
        ) {
          suggestions.style.display = "none";
        }
      });

      // Handle suggestion clicks
      suggestions.addEventListener("click", (e) => {
        const suggestionItem = e.target.closest(".suggestion-item");
        if (suggestionItem) {
          const term = suggestionItem.dataset.term;
          searchInput.value = term;
          this.performSearch(term);
          suggestions.style.display = "none";
        }
      });
    }

    performSearch(query = "") {
      const posts = document.querySelectorAll(".blog-post");
      const searchTerm =
        query || document.querySelector(".search-input")?.value || "";
      let visibleCount = 0;

      posts.forEach((post) => {
        const title = post
          .querySelector(".post-title")
          .textContent.toLowerCase();
        const excerpt = post
          .querySelector(".post-excerpt")
          .textContent.toLowerCase();
        const category = post.dataset.category;

        const matches =
          title.includes(searchTerm.toLowerCase()) ||
          excerpt.includes(searchTerm.toLowerCase()) ||
          category.includes(searchTerm.toLowerCase());

        if (matches || !searchTerm.trim()) {
          post.style.display = "block";
          visibleCount++;
        } else {
          post.style.display = "none";
        }
      });

      // Update no posts message
      const noPostsMsg = document.getElementById("noPosts");
      if (noPostsMsg) {
        noPostsMsg.style.display = visibleCount === 0 ? "block" : "none";
      }
    }

    initPostAnimations() {
      // Add CSS for animations
      const style = document.createElement("style");
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-post {
          animation-fill-mode: both;
        }
        
        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--border-color);
          border-top: none;
          border-radius: 0 0 8px 8px;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .suggestions-header {
          padding: 0.75rem 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          font-size: 0.875rem;
        }
        
        .suggestion-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s ease;
          font-size: 0.9rem;
        }
        
        .suggestion-item:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }
        
        .suggestion-item i {
          color: var(--text-light);
        }
      `;
      document.head.appendChild(style);
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }

  // Performance monitoring
  class PerformanceMonitor {
    constructor() {
      this.initPerformanceTracking();
    }

    initPerformanceTracking() {
      // Track page load performance
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0];
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

          // Log performance (for development)
          if (window.console && loadTime > 3000) {
            console.warn(`Slow page load detected: ${loadTime}ms`);
          }

          // Track Core Web Vitals if available
          if ("web-vitals" in window) {
            this.trackWebVitals();
          }
        }, 0);
      });
    }

    trackWebVitals() {
      // This would integrate with actual web vitals library in production
      console.log("Performance tracking initialized");
    }
  }

  // Initialize all enhancements
  const blogEnhancements = new BlogEnhancements();
  const blogNavigation = new BlogNavigation();
  const performanceMonitor = new PerformanceMonitor();

  // Export for external use
  window.BlogEnhancements = {
    blogEnhancements,
    blogNavigation,
    performanceMonitor,
  };
})();
