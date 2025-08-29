/**
 * Unified Authentication & Navigation JavaScript
 * ESL Fun Online - Optimized and Conflict-Free Version
 *
 * This file consolidates all authentication and navigation functionality
 * to prevent conflicts and improve performance
 */

// ==============================================
// CONSTANTS & CONFIGURATION
// ==============================================

const CONFIG = {
  STORAGE_KEYS: {
    THEME: "esl-theme",
    USER: "esl-user-session",
    PREFERENCES: "esl-user-preferences",
  },
  THEMES: {
    LIGHT: "light",
    DARK: "dark",
  },
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 150,
};

// ==============================================
// USER DATABASE (DEMO ONLY - NOT FOR PRODUCTION)
// ==============================================

const USER_DATABASE = {
  students: {
    STU001: {
      password: "student123",
      name: "John Doe",
      dashboard: "student-dashboard.html",
    },
    STU002: {
      password: "mypassword",
      name: "Jane Smith",
      dashboard: "student-dashboard.html",
    },
    STU003: {
      password: "learn2024",
      name: "Mike Johnson",
      dashboard: "student-dashboard.html",
    },
    student1: {
      password: "pass1",
      name: "Student One",
      dashboard: "student-dashboard.html",
    },
    student2: {
      password: "pass2",
      name: "Student Two",
      dashboard: "student2-dashboard.html",
    },
  },
  teachers: {
    TCH001: {
      password: "teacher123",
      name: "Prof. Wilson",
      dashboard: "teacher-dashboard.html",
    },
    TCH002: {
      password: "educate2024",
      name: "Dr. Brown",
      dashboard: "teacher-dashboard.html",
    },
    teacher1: {
      password: "teachpass",
      name: "Teacher One",
      dashboard: "teacher-dashboard.html",
    },
  },
  admins: {
    admin: {
      password: "admin",
      name: "Administrator",
      dashboard: "admin.html",
    },
  },
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const Utils = {
  // Debounce function to prevent excessive function calls
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
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Safe localStorage operations
  storage: {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("localStorage not available:", e);
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn("localStorage not available:", e);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn("localStorage not available:", e);
        return false;
      }
    },
  },

  // Element selectors with error handling
  $(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  // Animation helpers
  fadeIn(element, duration = CONFIG.ANIMATION_DURATION) {
    element.style.opacity = "0";
    element.style.display = "block";

    const start = performance.now();

    function fade(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    }

    requestAnimationFrame(fade);
  },

  fadeOut(element, duration = CONFIG.ANIMATION_DURATION) {
    const start = performance.now();
    const startOpacity =
      parseFloat(window.getComputedStyle(element).opacity) || 1;

    function fade(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = startOpacity * (1 - progress);

      if (progress >= 1) {
        element.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    }

    requestAnimationFrame(fade);
  },
};

// ==============================================
// AUTHENTICATION SYSTEM
// ==============================================

const Auth = {
  // Validate user credentials (unified function)
  validateCredentials(userId, password, userType) {
    const userDatabase =
      USER_DATABASE[userType + "s"] || USER_DATABASE[userType];

    if (!userDatabase) {
      return {
        success: false,
        message: `Invalid user type: ${userType}`,
      };
    }

    const user = userDatabase[userId];

    if (!user || user.password !== password) {
      return {
        success: false,
        message: `Invalid ${userType} credentials. Please check your username and password.`,
      };
    }

    return {
      success: true,
      userId,
      userType,
      name: user.name,
      dashboard: user.dashboard,
    };
  },

  // Login process
  login(userId, password, userType) {
    const result = this.validateCredentials(userId, password, userType);

    if (result.success) {
      const sessionData = {
        userId: result.userId,
        userType: result.userType,
        name: result.name,
        loginTime: new Date().toISOString(),
      };

      Utils.storage.set(CONFIG.STORAGE_KEYS.USER, JSON.stringify(sessionData));

      // Redirect to appropriate dashboard
      if (result.dashboard) {
        setTimeout(() => {
          window.location.href = result.dashboard;
        }, 500);
      }
    }

    return result;
  },

  // Logout process
  logout() {
    Utils.storage.remove(CONFIG.STORAGE_KEYS.USER);
    window.location.href = "login.html";
  },

  // Check if user is logged in
  isLoggedIn() {
    const session = Utils.storage.get(CONFIG.STORAGE_KEYS.USER);
    return session !== null;
  },

  // Get current user session
  getCurrentUser() {
    const session = Utils.storage.get(CONFIG.STORAGE_KEYS.USER);
    return session ? JSON.parse(session) : null;
  },
};

// ==============================================
// THEME MANAGEMENT
// ==============================================

const ThemeManager = {
  init() {
    // Prevent initialization if navigation.js already initialized theme management
    if (window.eslNavigationInitialized) return;

    this.body = document.body;
    this.themeToggle = Utils.$("#themeToggle");
    this.allThemeToggles = Utils.$$("[id*='themeToggle'], .theme-toggle");

    this.loadSavedTheme();
    this.bindEvents();
  },

  loadSavedTheme() {
    const savedTheme =
      Utils.storage.get(CONFIG.STORAGE_KEYS.THEME) || CONFIG.THEMES.LIGHT;
    this.setTheme(savedTheme, false);
  },

  setTheme(theme, animate = true) {
    const isDark = theme === CONFIG.THEMES.DARK;

    if (animate) {
      this.body.style.transition =
        "background-color 0.3s ease, color 0.3s ease";
    }

    // Apply theme to body and html for full coverage
    this.body.classList.toggle("dark-mode", isDark);
    document.documentElement.classList.toggle("dark-mode", isDark);

    // Update all theme toggle icons across the page
    this.allThemeToggles.forEach((toggle) => {
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      }
    });

    // Update header background
    this.updateHeaderBackground();

    // Save theme preference
    Utils.storage.set(CONFIG.STORAGE_KEYS.THEME, theme);

    // Broadcast theme change to other tabs/windows
    try {
      localStorage.setItem(
        "theme-change-event",
        JSON.stringify({
          theme: theme,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn("Could not broadcast theme change:", e);
    }

    // Remove transition after animation
    if (animate) {
      setTimeout(() => {
        this.body.style.transition = "";
      }, 300);
    }
  },

  toggleTheme() {
    const currentTheme = this.body.classList.contains("dark-mode")
      ? CONFIG.THEMES.DARK
      : CONFIG.THEMES.LIGHT;

    const newTheme =
      currentTheme === CONFIG.THEMES.DARK
        ? CONFIG.THEMES.LIGHT
        : CONFIG.THEMES.DARK;

    this.setTheme(newTheme);
  },

  updateHeaderBackground() {
    const header = Utils.$("header");
    if (!header) return;

    const isDark = this.body.classList.contains("dark-mode");
    const isScrolled = window.scrollY > 100;

    let background, backdrop, shadow;

    if (isDark) {
      background = isScrolled
        ? "rgba(17, 24, 39, 0.95)"
        : "rgba(31, 41, 55, 0.9)";
      backdrop = isScrolled ? "blur(15px)" : "blur(10px)";
      shadow = isScrolled
        ? "0 2px 20px rgba(0, 0, 0, 0.3)"
        : "0 2px 10px rgba(0, 0, 0, 0.2)";
    } else {
      background = isScrolled
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0.9)";
      backdrop = isScrolled ? "blur(15px)" : "blur(10px)";
      shadow = isScrolled
        ? "0 2px 20px rgba(0, 0, 0, 0.1)"
        : "0 2px 10px rgba(0, 0, 0, 0.05)";
    }

    header.style.background = background;
    header.style.backdropFilter = backdrop;
    header.style.boxShadow = shadow;
  },

  bindEvents() {
    // Bind all theme toggle buttons on the page
    this.allThemeToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });

    // Listen for theme changes from other tabs/windows
    window.addEventListener("storage", (e) => {
      if (e.key === "theme-change-event") {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.theme) {
            this.setTheme(data.theme, true);
          }
        } catch (err) {
          console.warn("Error parsing theme change event:", err);
        }
      }
    });
  },
};

// ==============================================
// NAVIGATION MANAGEMENT
// ==============================================

const Navigation = {
  init() {
    // Prevent initialization if navigation.js already initialized navigation
    if (window.eslNavigationInitialized) return;

    this.mobileToggle = Utils.$("#mobileToggle");
    this.navLinks = Utils.$("#navLinks");
    this.header = Utils.$("header");

    if (!this.mobileToggle || !this.navLinks) return;

    this.mobileIcon = this.mobileToggle.querySelector("i");
    this.isOpen = false;
    this.lastScroll = 0;

    this.bindEvents();
    this.initScrollEffects();
  },

  bindEvents() {
    // Mobile toggle
    this.mobileToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Close mobile menu on specific link clicks (not dropdowns)
    this.navLinks.addEventListener("click", (e) => {
      const clickedElement = e.target.closest(".nav-link");
      const clickedDropdown = e.target.closest(".dropdown");
      const hasDropdown =
        clickedElement && clickedElement.querySelector(".fa-chevron-down");

      // Handle dropdown toggle for mobile
      if (window.innerWidth <= 768 && hasDropdown && !clickedDropdown) {
        e.preventDefault();
        const navItem = clickedElement.closest(".nav-item");
        const dropdown = navItem.querySelector(".dropdown");

        // Close all other dropdowns
        this.navLinks.querySelectorAll(".nav-item").forEach((item) => {
          if (item !== navItem) {
            item.classList.remove("mobile-dropdown-open");
            const otherDropdown = item.querySelector(".dropdown");
            if (otherDropdown) {
              otherDropdown.style.maxHeight = "0";
            }
          }
        });

        // Toggle current dropdown
        const isOpen = navItem.classList.contains("mobile-dropdown-open");
        navItem.classList.toggle("mobile-dropdown-open", !isOpen);
        if (dropdown) {
          dropdown.style.maxHeight = isOpen
            ? "0"
            : dropdown.scrollHeight + "px";
        }
        return;
      }

      // Only close menu if:
      // - It's a regular nav link (no dropdown)
      // - Or it's a dropdown item link
      if (
        window.innerWidth <= 768 &&
        clickedElement &&
        (!hasDropdown || clickedDropdown)
      ) {
        // If it's a dropdown item, close the menu
        if (clickedDropdown) {
          this.closeMobileMenu();
        }
        // If it's a regular nav link without dropdown, close the menu
        else if (!hasDropdown) {
          this.closeMobileMenu();
        }
      }
    });

    // Close mobile menu on outside click
    document.addEventListener("click", (e) => {
      if (
        this.isOpen &&
        !this.mobileToggle.contains(e.target) &&
        !this.navLinks.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMobileMenu();
        this.mobileToggle.focus();
      }
    });

    // Smooth scrolling for anchor links
    this.initSmoothScrolling();

    // Dropdown handling for mobile
    this.initDropdownHandling();
  },

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;

    this.navLinks.classList.toggle("active", this.isOpen);
    document.body.classList.toggle("mobile-menu-open", this.isOpen);

    if (this.mobileIcon) {
      this.mobileIcon.className = this.isOpen ? "fas fa-times" : "fas fa-bars";
    }

    // Add/remove body scroll lock on mobile menu open
    document.body.style.overflow = this.isOpen ? "hidden" : "";
  },

  closeMobileMenu() {
    this.isOpen = false;
    this.navLinks.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");

    if (this.mobileIcon) {
      this.mobileIcon.className = "fas fa-bars";
    }

    document.body.style.overflow = "";

    // Close all open dropdowns when closing mobile menu
    const openDropdowns = Utils.$$(".nav-item.mobile-dropdown-open");
    openDropdowns.forEach((item) => {
      item.classList.remove("mobile-dropdown-open");
      const dropdown = item.querySelector(".dropdown");
      if (dropdown) {
        dropdown.style.maxHeight = "0";
      }
    });
  },

  initScrollEffects() {
    const throttledScroll = Utils.throttle(() => {
      if (ThemeManager.updateHeaderBackground) {
        ThemeManager.updateHeaderBackground();
      }

      if (this.header) {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          this.header.classList.add("scrolled");
        } else {
          this.header.classList.remove("scrolled");
        }

        this.lastScroll = currentScroll;
      }
    }, 16); // ~60fps

    window.addEventListener("scroll", throttledScroll, { passive: true });
  },

  initSmoothScrolling() {
    Utils.$$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "#!") return;

        e.preventDefault();
        const target = Utils.$(href);

        if (target) {
          const headerHeight = Navigation.header
            ? Navigation.header.offsetHeight
            : 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  },

  initDropdownHandling() {
    const dropdownItems = Utils.$$(".nav-item");

    dropdownItems.forEach((item) => {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");

      if (!dropdown) return;

      // Mobile dropdown toggle
      if (link && link.querySelector(".fa-chevron-down")) {
        link.addEventListener("click", (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling

            const isActive = item.classList.contains("mobile-dropdown-open");

            // Close all other dropdowns
            dropdownItems.forEach((otherItem) => {
              if (otherItem !== item) {
                otherItem.classList.remove("mobile-dropdown-open");
                const otherDropdown = otherItem.querySelector(".dropdown");
                if (otherDropdown) {
                  otherDropdown.style.maxHeight = "0";
                }
              }
            });

            // Toggle current dropdown
            item.classList.toggle("mobile-dropdown-open", !isActive);
            dropdown.style.maxHeight = isActive
              ? "0"
              : dropdown.scrollHeight + "px";
          }
        });
      }

      // Prevent dropdown clicks from closing mobile menu
      if (dropdown) {
        dropdown.addEventListener("click", (e) => {
          if (window.innerWidth <= 768) {
            e.stopPropagation();
          }
        });
      }
    });
  },
};

// ==============================================
// PERFORMANCE & ANALYTICS
// ==============================================

const Performance = {
  init() {
    this.initLazyLoading();
    this.initIntersectionObserver();
    this.initPreloading();
  },

  initLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                img.classList.add("loaded");
              }
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
        }
      );

      Utils.$$("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  },

  initIntersectionObserver() {
    if ("IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible", "animate");

              // Add staggered animation delays for multiple elements
              const siblings = Array.from(entry.target.parentNode.children);
              const index = siblings.indexOf(entry.target);
              entry.target.style.animationDelay = `${index * 0.1}s`;
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      Utils.$$(".animate-on-scroll").forEach((el) => {
        animationObserver.observe(el);
      });
    }
  },

  initPreloading() {
    // Preload critical resources
    const criticalImages = [
      "/images/1.png",
      "/images/Blue Night Sky Cute Whale Desktop Wallpaper.png",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  },
};

// ==============================================
// ERROR HANDLING & MONITORING
// ==============================================

const ErrorHandler = {
  init() {
    window.addEventListener("error", this.handleError.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this.handlePromiseRejection.bind(this)
    );
  },

  handleError(event) {
    console.error("Global error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // You can send this to your analytics service
    this.reportError("JavaScript Error", event.message, event.filename);
  },

  handlePromiseRejection(event) {
    console.error("Unhandled promise rejection:", event.reason);
    this.reportError("Promise Rejection", event.reason);
  },

  reportError(type, message, filename = "") {
    // Placeholder for analytics reporting
    if (typeof gtag !== "undefined") {
      gtag("event", "exception", {
        description: `${type}: ${message} ${filename}`,
        fatal: false,
      });
    }
  },
};

// ==============================================
// MAIN APPLICATION INITIALIZATION
// ==============================================

const ESLApp = {
  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }
  },

  start() {
    try {
      // Initialize core systems
      ThemeManager.init();
      Navigation.init();
      Performance.init();
      ErrorHandler.init();

      // Initialize page-specific features
      this.initPageFeatures();

      // Mark page as loaded
      this.markPageLoaded();

      console.log("ESL Fun Online: All systems initialized successfully");
    } catch (error) {
      console.error("ESL App initialization error:", error);
    }
  },

  initPageFeatures() {
    // Resource card interactions
    Utils.$$(".resource-card, .dual-option-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Prevent click if user clicked on a link directly
        if (e.target.tagName === "A" || e.target.closest("a")) {
          return;
        }

        const link = card.querySelector("a[href]");
        if (link) {
          // Add click animation
          card.style.transform = "scale(0.98)";
          setTimeout(() => {
            card.style.transform = "";
            window.location.href = link.href;
          }, 150);
        }
      });

      // Improve accessibility
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      // Keyboard support
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Initialize any page-specific animations
    this.initAnimations();
  },

  initAnimations() {
    // Add entrance animations to key elements
    Utils.$$(".hero-content, .section-title, .resource-card").forEach(
      (el, index) => {
        el.classList.add("animate-on-scroll");
        el.style.animationDelay = `${index * 0.1}s`;
      }
    );

    // Initialize counters if present
    const counters = Utils.$$(".stat-number[data-target]");
    if (counters.length > 0) {
      this.initCounters(counters);
    }
  },

  initCounters(counters) {
    const animateCounters = () => {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const increment = target / 60; // 60 frames for 1 second at 60fps
        let current = 0;

        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + "+";
          }
        };

        updateCounter();
      });
    };

    // Trigger counters when they come into view
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounters();
              counterObserver.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      const statsSection = Utils.$(".hero-stats, .stats-section");
      if (statsSection) {
        counterObserver.observe(statsSection);
      }
    }
  },

  markPageLoaded() {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");

    // Trigger any final animations
    setTimeout(() => {
      document.body.classList.add("fully-loaded");
    }, 500);
  },
};

// ==============================================
// EXPOSE GLOBAL API
// ==============================================

// Expose essential functions to global scope for backward compatibility
window.ESL = {
  Auth,
  ThemeManager,
  Navigation,
  Utils,
  validateCredentials: Auth.validateCredentials.bind(Auth), // Legacy support
};

// Auto-initialize the application
ESLApp.init();
