/**
 * NAVIGATION FIX - ESL Fun Online
 * Unified mobile menu and theme toggle functionality
 * This script fixes the mobile menu and theme buttons that weren't working
 */

(function () {
  "use strict";

  // Prevent multiple initializations and disable other navigation scripts
  if (window.navigationFixed) {
    return;
  }
  window.navigationFixed = true;

  // Disable other navigation scripts from initializing
  window.eslNavigationInitialized = true;
  window.navigationUnifiedLoaded = true;

  console.log("Navigation Fix: Initializing...");

  // Wait for DOM to be ready
  function initNavigation() {
    // Initialize theme toggle
    setupThemeToggle();

    // Initialize mobile menu
    setupMobileMenu();

    console.log("Navigation Fix: Complete");
  }

  /**
   * Setup Theme Toggle Functionality
   */
  function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
      console.warn("Navigation Fix: Theme toggle button not found");
      return;
    }

    console.log("Navigation Fix: Setting up theme toggle");

    // Get current theme state
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDarkMode = savedTheme === "dark";

    // Apply initial theme
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }

    // Set initial icon
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    }

    // Remove existing event listeners by cloning the element
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

    // Add new event listener
    newThemeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("Navigation Fix: Theme toggle clicked");

      // Toggle theme classes on both html and body
      const wasLight = !document.body.classList.contains("dark-mode");

      if (wasLight) {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }

      // Update icon
      const newIcon = newThemeToggle.querySelector("i");
      if (newIcon) {
        newIcon.className = wasLight ? "fas fa-sun" : "fas fa-moon";
      }

      console.log(
        "Navigation Fix: Theme toggled to",
        wasLight ? "dark" : "light"
      );
    });

    console.log("Navigation Fix: Theme toggle setup complete");
  }

  /**
   * Setup Mobile Menu Functionality
   */
  function setupMobileMenu() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (!mobileToggle || !navLinks) {
      console.warn("Navigation Fix: Mobile menu elements not found", {
        mobileToggle: !!mobileToggle,
        navLinks: !!navLinks,
      });
      return;
    }

    console.log("Navigation Fix: Setting up mobile menu");

    let isMenuOpen = false;

    // Functions to manage menu state
    function openMenu() {
      isMenuOpen = true;
      navLinks.classList.add("active");
      document.body.classList.add("mobile-menu-open");
      document.body.style.overflow = "hidden";

      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = "fas fa-times";
      }

      mobileToggle.setAttribute("aria-expanded", "true");
      console.log("Navigation Fix: Menu opened");
    }

    function closeMenu() {
      isMenuOpen = false;
      navLinks.classList.remove("active");
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";

      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = "fas fa-bars";
      }

      mobileToggle.setAttribute("aria-expanded", "false");

      // Close all dropdowns
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("mobile-open");
        const chevron = item.querySelector(".fa-chevron-down");
        if (chevron) {
          chevron.style.transform = "rotate(0deg)";
        }
      });

      console.log("Navigation Fix: Menu closed");
    }

    // Remove existing event listeners by cloning
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    // Add click event listener
    newMobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log(
        "Navigation Fix: Mobile toggle clicked, menu is currently:",
        isMenuOpen ? "open" : "closed"
      );

      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Add touch event for better mobile support
    newMobileToggle.addEventListener("touchend", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Small delay to prevent double-triggering
        setTimeout(() => {
          if (isMenuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }, 50);
      }
    });

    // Setup dropdown functionality
    setupDropdowns(closeMenu);

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        isMenuOpen &&
        !newMobileToggle.contains(e.target) &&
        !navLinks.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on window resize if needed
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        newMobileToggle.focus();
      }
    });

    console.log("Navigation Fix: Mobile menu setup complete");
  }

  /**
   * Setup Dropdown Functionality
   */
  function setupDropdowns(closeMenuCallback) {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      const navLink = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");
      const chevron = navLink?.querySelector(".fa-chevron-down");

      if (!navLink || !dropdown || !chevron) {
        return;
      }

      // Clone to remove existing listeners
      const newLink = navLink.cloneNode(true);
      navLink.parentNode.replaceChild(newLink, navLink);

      const freshChevron = newLink.querySelector(".fa-chevron-down");

      // Add click handler for dropdown toggle
      newLink.addEventListener("click", function (e) {
        const isMobile = window.innerWidth <= 768;

        if (isMobile && freshChevron) {
          e.preventDefault();
          e.stopPropagation();

          const isOpen = item.classList.contains("mobile-open");

          // Close other dropdowns
          navItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("mobile-open");
              const otherChevron = otherItem.querySelector(".fa-chevron-down");
              if (otherChevron) {
                otherChevron.style.transform = "rotate(0deg)";
              }
            }
          });

          // Toggle current dropdown
          if (isOpen) {
            item.classList.remove("mobile-open");
            freshChevron.style.transform = "rotate(0deg)";
          } else {
            item.classList.add("mobile-open");
            freshChevron.style.transform = "rotate(180deg)";
          }
        }
      });

      // Handle dropdown item clicks - close menu when navigating
      if (dropdown) {
        const dropdownItems = dropdown.querySelectorAll("a");
        dropdownItems.forEach((dropdownItem) => {
          dropdownItem.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
              setTimeout(closeMenuCallback, 100);
            }
          });
        });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    // DOM is already ready
    initNavigation();
  }

  // Expose utility functions for debugging
  window.NavigationFix = {
    reinitialize: initNavigation,
    getCurrentTheme: function () {
      return document.body.classList.contains("dark-mode") ? "dark" : "light";
    },
    forceCloseMenu: function () {
      const navLinks = document.getElementById("navLinks");
      if (navLinks) {
        navLinks.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
        document.body.style.overflow = "";

        const mobileToggle = document.getElementById("mobileToggle");
        const icon = mobileToggle?.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars";
        }
      }
    },
  };
})();
