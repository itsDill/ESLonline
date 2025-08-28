/**
 * Consolidated Navigation & Theme JavaScript
 * ESL Fun Online - Single source of truth for all navigation and theme functionality
 */

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  // Prevent multiple initializations
  if (window.eslNavigationInitialized) return;
  window.eslNavigationInitialized = true;

  // ==============================================
  // THEME MANAGEMENT
  // ==============================================
  const ThemeManager = {
    init() {
      this.themeToggle = document.getElementById("themeToggle");
      this.body = document.body;

      if (this.themeToggle) {
        this.themeIcon = this.themeToggle.querySelector("i");
        this.loadSavedTheme();
        this.bindThemeEvents();
      }
    },

    loadSavedTheme() {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem("theme") || "light";
      this.body.classList.toggle("dark-mode", savedTheme === "dark");
      this.updateThemeIcon(savedTheme);
    },

    updateThemeIcon(theme) {
      if (this.themeIcon) {
        this.themeIcon.className =
          theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    },

    toggleTheme() {
      this.body.classList.toggle("dark-mode");
      const isDark = this.body.classList.contains("dark-mode");
      const theme = isDark ? "dark" : "light";

      localStorage.setItem("theme", theme);
      this.updateThemeIcon(theme);
      this.updateHeaderBackground();

      // Broadcast theme change to other tabs/windows
      try {
        window.dispatchEvent(
          new CustomEvent("themeChanged", {
            detail: { theme },
          })
        );
      } catch (e) {
        console.warn("Could not broadcast theme change:", e);
      }
    },

    updateHeaderBackground() {
      const header = document.querySelector("header");
      if (!header) return;

      const isDark = this.body.classList.contains("dark-mode");
      const isScrolled = window.scrollY > 100;

      if (isDark) {
        header.style.background = isScrolled
          ? "rgba(31, 41, 55, 0.98)"
          : "rgba(31, 41, 55, 0.95)";
      } else {
        header.style.background = isScrolled
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.95)";
      }

      header.style.backdropFilter = isScrolled ? "blur(15px)" : "blur(10px)";
    },

    bindThemeEvents() {
      this.themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTheme();
      });

      // Listen for theme changes from other tabs/windows
      window.addEventListener("storage", (e) => {
        if (e.key === "theme") {
          const theme = e.newValue || "light";
          this.body.classList.toggle("dark-mode", theme === "dark");
          this.updateThemeIcon(theme);
          this.updateHeaderBackground();
        }
      });
    },
  };

  // ==============================================
  // NAVIGATION MANAGEMENT
  // ==============================================
  const NavigationManager = {
    init() {
      this.mobileToggle = document.getElementById("mobileToggle");
      this.navLinks = document.getElementById("navLinks");
      this.header = document.querySelector("header");

      if (this.mobileToggle && this.navLinks) {
        this.mobileIcon = this.mobileToggle.querySelector("i");
        this.bindNavigationEvents();
      }

      this.bindScrollEvents();
    },

    bindNavigationEvents() {
      // Mobile menu toggle
      this.mobileToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      // Close mobile menu when clicking on a link
      this.navLinks.addEventListener("click", (e) => {
        if (e.target.closest(".nav-link")) {
          this.closeMobileMenu();
        }
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !this.mobileToggle.contains(e.target) &&
          !this.navLinks.contains(e.target)
        ) {
          this.closeMobileMenu();
        }
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.navLinks.classList.contains("active")) {
          this.closeMobileMenu();
          this.mobileToggle.focus();
        }
      });
    },

    toggleMobileMenu() {
      const isOpen = this.navLinks.classList.contains("active");

      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    },

    openMobileMenu() {
      this.navLinks.classList.add("active");
      if (this.mobileIcon) {
        this.mobileIcon.className = "fas fa-times";
      }
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    },

    closeMobileMenu() {
      this.navLinks.classList.remove("active");
      if (this.mobileIcon) {
        this.mobileIcon.className = "fas fa-bars";
      }
      // Restore body scroll
      document.body.style.overflow = "";
    },

    bindScrollEvents() {
      if (!this.header) return;

      let lastScroll = 0;
      let ticking = false;

      const updateHeader = () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        this.header.classList.toggle("scrolled", currentScroll > 100);

        // Update theme-aware background
        if (
          window.eslNavigationInitialized &&
          ThemeManager.updateHeaderBackground
        ) {
          ThemeManager.updateHeaderBackground();
        }

        lastScroll = currentScroll;
        ticking = false;
      };

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      });
    },
  };

  // ==============================================
  // SMOOTH SCROLLING
  // ==============================================
  const SmoothScrollManager = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (href === "#" || href === "#!") return;

          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    },
  };

  // ==============================================
  // LOADING AND ANIMATIONS
  // ==============================================
  const AnimationManager = {
    init() {
      // Mark page as loaded
      window.addEventListener("load", () => {
        document.body.classList.remove("loading");
        document.body.classList.add("loaded");
      });

      // Intersection Observer for scroll animations
      this.setupScrollAnimations();
    },

    setupScrollAnimations() {
      if (!window.IntersectionObserver) return;

      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, observerOptions);

      // Observe animate-on-scroll elements
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    },
  };

  // ==============================================
  // ACCESSIBILITY ENHANCEMENTS
  // ==============================================
  const AccessibilityManager = {
    init() {
      // Focus management
      this.setupFocusManagement();

      // Skip links
      this.setupSkipLinks();
    },

    setupFocusManagement() {
      // Improve focus visibility
      document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          document.body.classList.add("using-keyboard");
        }
      });

      document.addEventListener("mousedown", () => {
        document.body.classList.remove("using-keyboard");
      });
    },

    setupSkipLinks() {
      // Add skip link if not present
      const skipLink = document.querySelector(".skip-link");
      if (!skipLink) {
        const link = document.createElement("a");
        link.href = "#main-content";
        link.className = "skip-link";
        link.textContent = "Skip to main content";
        document.body.insertBefore(link, document.body.firstChild);
      }
    },
  };

  // ==============================================
  // ERROR HANDLING
  // ==============================================
  const ErrorHandler = {
    init() {
      // Global error handling
      window.addEventListener("error", (e) => {
        console.error(
          "Resource failed to load:",
          e.target?.src || e.target?.href
        );
      });

      // Unhandled promise rejections
      window.addEventListener("unhandledrejection", (e) => {
        console.error("Unhandled promise rejection:", e.reason);
      });
    },
  };

  // ==============================================
  // INITIALIZE ALL MANAGERS
  // ==============================================
  try {
    ThemeManager.init();
    NavigationManager.init();
    SmoothScrollManager.init();
    AnimationManager.init();
    AccessibilityManager.init();
    ErrorHandler.init();

    // Mark initialization complete
    console.log("ESL Navigation system initialized successfully");
  } catch (error) {
    console.error("Error initializing navigation system:", error);
  }
});

// ==============================================
// UTILITY FUNCTIONS
// ==============================================
window.ESLUtils = {
  // Theme utilities
  getCurrentTheme() {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  },

  setTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);

    const themeToggle = document.getElementById("themeToggle");
    const icon = themeToggle?.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  },

  // Navigation utilities
  closeMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    const mobileToggle = document.getElementById("mobileToggle");

    if (navLinks) navLinks.classList.remove("active");

    const icon = mobileToggle?.querySelector("i");
    if (icon) icon.className = "fas fa-bars";

    document.body.style.overflow = "";
  },
};
