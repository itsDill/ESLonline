/* ==============================================
   UNIFIED NAVIGATION SYSTEM - ESL Fun Online
   Consistent navigation behavior across all pages
   ============================================== */

(function () {
  "use strict";

  // Initialize navigation when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }

  function initNavigation() {
    // Initialize mobile navigation
    initMobileNavigation();
    // Initialize dropdown behavior
    initDropdownBehavior();
    // Handle scroll effects
    initScrollEffects();
    // Set current page indicator
    setCurrentPageIndicator();
    // Initialize theme toggle
    initThemeToggle();
  }

  // =====================================
  // MOBILE NAVIGATION
  // =====================================
  function initMobileNavigation() {
    const mobileToggle =
      document.getElementById("mobileToggle") ||
      document.querySelector(".mobile-toggle");
    const navLinks =
      document.getElementById("navLinks") ||
      document.querySelector(".nav-links");
    const body = document.body;

    if (!mobileToggle || !navLinks) {
      console.warn("Mobile navigation elements not found");
      return;
    }

    // Ensure mobile toggle is visible on mobile
    function checkMobileToggleVisibility() {
      if (window.innerWidth <= 768) {
        mobileToggle.style.display = "flex";
        mobileToggle.style.visibility = "visible";
        mobileToggle.style.opacity = "1";
      } else {
        mobileToggle.style.display = "none";
        // Close mobile menu if open when resizing to desktop
        navLinks.classList.remove("active");
        body.classList.remove("mobile-menu-open");
      }
    }

    // Initial check
    checkMobileToggleVisibility();

    // Check on resize
    window.addEventListener("resize", checkMobileToggleVisibility);

    // Mobile toggle click handler
    mobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = navLinks.classList.contains("active");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        const isClickInsideNav = navLinks.contains(e.target);
        const isClickOnToggle = mobileToggle.contains(e.target);

        if (
          !isClickInsideNav &&
          !isClickOnToggle &&
          navLinks.classList.contains("active")
        ) {
          closeMobileMenu();
        }
      }
    });

    // Handle escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });

    function openMobileMenu() {
      navLinks.classList.add("active");
      body.classList.add("mobile-menu-open");
      mobileToggle.setAttribute("aria-expanded", "true");

      // Focus management
      const firstNavLink = navLinks.querySelector(".nav-link");
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 100);
      }
    }

    function closeMobileMenu() {
      navLinks.classList.remove("active");
      body.classList.remove("mobile-menu-open");
      mobileToggle.setAttribute("aria-expanded", "false");

      // Close all mobile dropdowns
      document.querySelectorAll(".nav-item.mobile-open").forEach((item) => {
        item.classList.remove("mobile-open");
      });
    }

    // Handle mobile dropdown toggles
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const navLink = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");

      if (dropdown && navLink) {
        navLink.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            // Only prevent default if this is a dropdown parent
            if (navLink.querySelector(".fa-chevron-down")) {
              e.preventDefault();
              e.stopPropagation();

              // Close other dropdowns
              navItems.forEach((otherItem) => {
                if (otherItem !== item) {
                  otherItem.classList.remove("mobile-open");
                }
              });

              // Toggle current dropdown
              item.classList.toggle("mobile-open");
            }
          }
        });
      }
    });
  }

  // =====================================
  // DESKTOP DROPDOWN BEHAVIOR
  // =====================================
  function initDropdownBehavior() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      const dropdown = item.querySelector(".dropdown");

      if (dropdown) {
        let hoverTimeout;

        // Mouse enter
        item.addEventListener("mouseenter", function () {
          if (window.innerWidth > 768) {
            clearTimeout(hoverTimeout);
            item.classList.add("desktop-hover");
          }
        });

        // Mouse leave
        item.addEventListener("mouseleave", function () {
          if (window.innerWidth > 768) {
            hoverTimeout = setTimeout(() => {
              item.classList.remove("desktop-hover");
            }, 150);
          }
        });

        // Keyboard navigation
        const navLink = item.querySelector(".nav-link");
        if (navLink) {
          navLink.addEventListener("focus", function () {
            if (window.innerWidth > 768) {
              item.classList.add("desktop-focus");
            }
          });

          navLink.addEventListener("blur", function () {
            setTimeout(() => {
              if (!item.contains(document.activeElement)) {
                item.classList.remove("desktop-focus");
              }
            }, 100);
          });
        }

        // Handle dropdown item focus
        const dropdownItems = dropdown.querySelectorAll(".dropdown-item");
        dropdownItems.forEach((dropdownItem, index) => {
          dropdownItem.addEventListener("focus", function () {
            item.classList.add("desktop-focus");
          });

          dropdownItem.addEventListener("blur", function () {
            setTimeout(() => {
              if (!item.contains(document.activeElement)) {
                item.classList.remove("desktop-focus");
              }
            }, 100);
          });

          // Arrow key navigation
          dropdownItem.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextItem = dropdownItems[index + 1];
              if (nextItem) nextItem.focus();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (index === 0) {
                navLink.focus();
              } else {
                dropdownItems[index - 1].focus();
              }
            }
          });
        });
      }
    });
  }

  // =====================================
  // SCROLL EFFECTS
  // =====================================
  function initScrollEffects() {
    const header = document.querySelector("header");
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
  }

  // =====================================
  // CURRENT PAGE INDICATOR
  // =====================================
  function setCurrentPageIndicator() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        currentPath.includes(href.replace("../", "").replace("/", ""))
      ) {
        link.classList.add("active");
        const navItem = link.closest(".nav-item");
        if (navItem) {
          navItem.classList.add("current");
        }
      }
    });

    // Special handling for section-based current indicators
    if (currentPath.includes("/english/")) {
      const englishNavItem = document
        .querySelector('.nav-link[href*="english"]')
        ?.closest(".nav-item");
      if (englishNavItem) englishNavItem.classList.add("current");
    } else if (currentPath.includes("/coding/")) {
      const codingNavItem = document
        .querySelector('.nav-link[href*="coding"]')
        ?.closest(".nav-item");
      if (codingNavItem) codingNavItem.classList.add("current");
    } else if (currentPath.includes("/games/")) {
      const gamesNavItem = document
        .querySelector('.nav-link[href*="games"]')
        ?.closest(".nav-item");
      if (gamesNavItem) gamesNavItem.classList.add("current");
    } else if (currentPath.includes("/tools/")) {
      const toolsNavItem = document
        .querySelector('.nav-link[href*="tools"]')
        ?.closest(".nav-item");
      if (toolsNavItem) toolsNavItem.classList.add("current");
    } else if (currentPath.includes("/blog/")) {
      const blogNavItem = document
        .querySelector('.nav-link[href*="blog"]')
        ?.closest(".nav-item");
      if (blogNavItem) blogNavItem.classList.add("current");
    }
  }

  // =====================================
  // THEME TOGGLE
  // =====================================
  function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      // Initialize theme from localStorage
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        const icon = themeToggle.querySelector("i");
        if (icon) {
          icon.className = "fas fa-sun";
        }
      }

      themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Update icon
        const icon = themeToggle.querySelector("i");
        if (icon) {
          icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
        }
      });
    }
  }

  // =====================================
  // ACCESSIBILITY ENHANCEMENTS
  // =====================================

  // Skip link functionality
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      const target =
        document.querySelector("#main-content") ||
        document.querySelector("main");
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Focus visible polyfill for older browsers
  function handleFocusVisible() {
    let hadKeyboardEvent = true;

    const keyboardThrottledEventListener = throttle(function (e) {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      hadKeyboardEvent = true;
    }, 100);

    const pointerEventListener = function () {
      hadKeyboardEvent = false;
    };

    document.addEventListener("keydown", keyboardThrottledEventListener, true);
    document.addEventListener("mousedown", pointerEventListener, true);
    document.addEventListener("pointerdown", pointerEventListener, true);
    document.addEventListener("touchstart", pointerEventListener, true);

    document.addEventListener("focusin", function (e) {
      if (hadKeyboardEvent || e.target.matches(":focus-visible")) {
        e.target.classList.add("focus-visible");
      }
    });

    document.addEventListener("focusout", function (e) {
      e.target.classList.remove("focus-visible");
    });
  }

  // Throttle helper function
  function throttle(func, wait) {
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

  // Initialize focus visible handling
  handleFocusVisible();

  // Add smooth scrolling for anchor links
  document.addEventListener("click", function (e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
})();
