"use strict";
/**
 * Enhanced Navigation Support v2.0
 * ESL Fun Online - Improved mobile menu with smooth animations
 * CRITICAL: This is the PRIMARY navigation handler - all other scripts defer to this
 */

// Force this script to be the primary navigation handler
window.eslNavigationInitialized = true;

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeNavigation);
} else {
  // DOM is already ready, initialize immediately
  setTimeout(initializeNavigation, 0);
}

function initializeNavigation() {
  // Function to completely reset mobile navigation
  function resetMobileNavigation() {
    // Clear any body classes
    document.body.classList.remove("mobile-menu-open");
    document.body.style.overflow = "";
  }

  // Reset any existing navigation state
  resetMobileNavigation();

  // Enhanced theme management
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme") || "light";
    body.classList.toggle("dark-mode", savedTheme === "dark");
    document.documentElement.classList.toggle(
      "dark-mode",
      savedTheme === "dark",
    );

    const themeIcon = themeToggle.querySelector("i");
    if (themeIcon) {
      themeIcon.className =
        savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }

    // Remove existing listeners and add new ones
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);

    const freshThemeToggle = document.getElementById("themeToggle");
    freshThemeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      body.classList.toggle("dark-mode");
      document.documentElement.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      const theme = isDark ? "dark" : "light";

      localStorage.setItem("theme", theme);
      const icon = freshThemeToggle.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      }
    });
  }

  // Mobile menu functionality - CRITICAL SECTION
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");

  if (mobileToggle && navLinks) {
    // Remove existing listeners by cloning the mobile toggle
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    // Get fresh references
    const freshMobileToggle = document.getElementById("mobileToggle");
    const freshNavLinks = document.getElementById("navLinks");
    const mobileIcon = freshMobileToggle.querySelector("i");
    let isMenuOpen = false;

    // Initialize aria attributes
    freshMobileToggle.setAttribute("aria-expanded", "false");
    freshMobileToggle.setAttribute("aria-controls", "navLinks");
    freshNavLinks.setAttribute("aria-hidden", "true");

    // Set aria-expanded on dropdown links
    navItems.forEach((item) => {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");
      if (link && dropdown && link.querySelector(".fa-chevron-down")) {
        link.setAttribute("aria-expanded", "false");
      }
    });

    // Functions to handle menu state
    function openMenu() {
      isMenuOpen = true;
      // Save scroll position before locking — prevents page jump on Android
      const scrollY = window.scrollY;
      body.dataset.menuScrollY = scrollY;
      freshNavLinks.classList.add("active");
      if (mobileIcon) mobileIcon.className = "fas fa-times";
      body.classList.add("mobile-menu-open");
      freshMobileToggle.setAttribute("aria-expanded", "true");
      freshNavLinks.setAttribute("aria-hidden", "false");
      // Focus first nav item for accessibility
      const firstNavLink = freshNavLinks.querySelector(".nav-link");
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 100);
      }
    }

    function closeMenu() {
      isMenuOpen = false;
      body.classList.remove("mobile-menu-open");
      body.style.top = "";
      // Clear inline overflow — restores CSS-defined overflow-x: hidden
      body.style.overflow = "";
      freshNavLinks.classList.remove("active");
      if (mobileIcon) mobileIcon.className = "fas fa-bars";
      freshMobileToggle.setAttribute("aria-expanded", "false");
      freshNavLinks.setAttribute("aria-hidden", "true");
      // Return focus to menu toggle
      freshMobileToggle.focus();
      // Close all dropdowns when closing menu
      navItems.forEach(resetDropdown);
    }

    // Mobile menu toggle - MAIN HANDLER
    freshMobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // touch-action: manipulation in CSS removes the 300ms delay — no JS touch handlers needed

    // Dropdown functionality for mobile ONLY
    navItems.forEach((item) => {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");
      const chevron = link?.querySelector(".fa-chevron-down");

      if (link && dropdown && chevron) {
        // Clone link to remove existing listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        const freshLink = item.querySelector(".nav-link");
        const freshChevron = freshLink.querySelector(".fa-chevron-down");

        // Handle dropdown toggle - MOBILE ONLY
        freshLink.addEventListener("click", function (e) {
          // Only handle dropdown links (with chevron)
          if (!freshChevron) return;

          const isMobile = window.innerWidth <= 768;

          // Only prevent default and handle clicks on mobile
          if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileDropdown(item, freshChevron);
          }
          // On desktop, let CSS :hover handle the dropdown display
        });

        // touch-action: manipulation in CSS removes 300ms tap delay — no JS touch handlers needed
      }
    });

    // Mobile dropdown toggle function
    function toggleMobileDropdown(item, chevron) {
      const isOpen = item.classList.contains("mobile-open");
      const link = item.querySelector(".nav-link");

      // Close all other dropdowns first
      navItems.forEach((otherItem) => {
        if (otherItem !== item) {
          resetDropdown(otherItem);
        }
      });

      // Toggle current dropdown
      if (isOpen) {
        resetDropdown(item);
        if (link) link.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("mobile-open");
        chevron.style.transform = "rotate(180deg)";
        if (link) link.setAttribute("aria-expanded", "true");
        // Focus first dropdown item
        const firstDropdownItem = item.querySelector(".dropdown-item");
        if (firstDropdownItem) {
          setTimeout(() => firstDropdownItem.focus(), 50);
        }
      }
    }

    // Reset dropdown to closed state
    function resetDropdown(item) {
      item.classList.remove("mobile-open", "desktop-open");
      const chevron = item.querySelector(".fa-chevron-down");
      const link = item.querySelector(".nav-link");
      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
      }
      if (link) {
        link.setAttribute("aria-expanded", "false");
      }
    }

    // Close menu when clicking outside - MOBILE ONLY
    document.addEventListener("click", function (e) {
      const isMobile = window.innerWidth <= 768;

      // Only handle clicks outside on mobile
      if (isMobile) {
        // Check for mobile menu
        if (
          isMenuOpen &&
          !freshMobileToggle.contains(e.target) &&
          !freshNavLinks.contains(e.target)
        ) {
          closeMenu();
          return;
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    });

    // Handle escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        freshMobileToggle.focus();
      }

      // Trap focus within mobile menu when open
      if (isMenuOpen && e.key === "Tab") {
        const focusableElements = freshNavLinks.querySelectorAll(
          "a, button, [tabindex]:not([tabindex='-1'])",
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });

    // Handle dropdown item clicks - close menu on navigation
    navItems.forEach((item) => {
      const dropdown = item.querySelector(".dropdown");
      if (dropdown) {
        const dropdownLinks = dropdown.querySelectorAll("a");
        dropdownLinks.forEach((dropdownLink) => {
          dropdownLink.addEventListener("click", function (e) {
            if (window.innerWidth <= 768 && isMenuOpen) {
              // Allow navigation but close menu after a small delay
              setTimeout(() => {
                closeMenu();
              }, 100);
            }
          });
        });
      }
    });
  } else {
    // Mobile toggle or nav links not found - may not be needed on this page
  }

  // Scroll behavior for header
  let lastScrollY = window.scrollY;
  const header = document.querySelector("header");

  if (header) {
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Don't hide header while mobile menu is open (menu is anchored to header position)
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 200 &&
        !document.body.classList.contains("mobile-menu-open")
      ) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
    });
  }
}

// Utility functions for backward compatibility
window.ESLUtils = window.ESLUtils || {
  getCurrentTheme() {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  },

  setTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);
  },

  closeMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    const mobileToggle = document.getElementById("mobileToggle");

    if (navLinks) {
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    }

    const icon = mobileToggle?.querySelector("i");
    if (icon) icon.className = "fas fa-bars";

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("mobile-open", "desktop-open");
      const chevron = item.querySelector(".fa-chevron-down");
      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
      }
    });
  },

  openPage(url) {
    this.closeMobileMenu();
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  },
};

// Global reset function for troubleshooting
window.resetMobileNavigation = function () {
  if (window.eslNavigationInitialized) {
    initializeNavigation();
  }
};
