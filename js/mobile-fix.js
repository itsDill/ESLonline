/**
 * Mobile Navigation Fix Script
 * ESL Fun Online - Ensures mobile navigation works on all pages
 * Include this script on pages where mobile navigation isn't working properly
 */

(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileFix);
  } else {
    initMobileFix();
  }

  function initMobileFix() {
    console.log("Mobile navigation fix initializing...");

    // Find mobile elements
    const mobileToggle =
      document.getElementById("mobileToggle") ||
      document.querySelector(".mobile-toggle") ||
      document.querySelector('[id*="mobile"]');
    const navLinks =
      document.getElementById("navLinks") ||
      document.querySelector(".nav-links") ||
      document.querySelector('[class*="nav-links"]');

    if (!mobileToggle || !navLinks) {
      console.warn("Mobile navigation elements not found:", {
        mobileToggle: !!mobileToggle,
        navLinks: !!navLinks,
      });
      return;
    }

    console.log("Mobile navigation elements found, setting up...");

    // Remove any existing listeners by cloning elements
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    // Get fresh references
    const toggle =
      document.getElementById("mobileToggle") ||
      document.querySelector(".mobile-toggle");
    const menu =
      document.getElementById("navLinks") ||
      document.querySelector(".nav-links");
    const icon = toggle.querySelector("i");

    // Set up mobile navigation
    let isMenuOpen = false;

    // Toggle function
    function toggleMobileMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      isMenuOpen = !isMenuOpen;

      // Toggle menu visibility
      menu.classList.toggle("active", isMenuOpen);
      document.body.classList.toggle("mobile-menu-open", isMenuOpen);

      // Toggle icon
      if (icon) {
        icon.className = isMenuOpen ? "fas fa-times" : "fas fa-bars";
      }

      // Toggle body scroll
      document.body.style.overflow = isMenuOpen ? "hidden" : "";

      console.log("Mobile menu toggled:", isMenuOpen);
    }

    // Close menu function
    function closeMobileMenu() {
      if (!isMenuOpen) return;

      isMenuOpen = false;
      menu.classList.remove("active");
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";

      if (icon) {
        icon.className = "fas fa-bars";
      }

      // Close all dropdowns
      const openDropdowns = menu.querySelectorAll(
        ".nav-item.mobile-open, .nav-item.mobile-dropdown-open"
      );
      openDropdowns.forEach((item) => {
        item.classList.remove("mobile-open", "mobile-dropdown-open");
        const dropdown = item.querySelector(".dropdown");
        if (dropdown) {
          dropdown.style.maxHeight = "0";
        }
        const chevron = item.querySelector(".fa-chevron-down");
        if (chevron) {
          chevron.style.transform = "rotate(0deg)";
        }
      });

      console.log("Mobile menu closed");
    }

    // Add click listener to toggle
    toggle.addEventListener("click", toggleMobileMenu);
    toggle.addEventListener("touchend", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggleMobileMenu(e);
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        isMenuOpen &&
        !toggle.contains(e.target) &&
        !menu.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Handle dropdown toggles in mobile menu
    const navItems = menu.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");
      const chevron = link ? link.querySelector(".fa-chevron-down") : null;

      if (link && dropdown && chevron) {
        // Clone link to remove existing listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        const freshLink = item.querySelector(".nav-link");
        const freshChevron = freshLink.querySelector(".fa-chevron-down");

        freshLink.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            const isDropdownOpen =
              item.classList.contains("mobile-open") ||
              item.classList.contains("mobile-dropdown-open");

            // Close all other dropdowns
            navItems.forEach((otherItem) => {
              if (otherItem !== item) {
                otherItem.classList.remove(
                  "mobile-open",
                  "mobile-dropdown-open"
                );
                const otherDropdown = otherItem.querySelector(".dropdown");
                if (otherDropdown) {
                  otherDropdown.style.maxHeight = "0";
                }
                const otherChevron =
                  otherItem.querySelector(".fa-chevron-down");
                if (otherChevron) {
                  otherChevron.style.transform = "rotate(0deg)";
                }
              }
            });

            // Toggle current dropdown
            const newState = !isDropdownOpen;
            item.classList.toggle("mobile-open", newState);
            item.classList.toggle("mobile-dropdown-open", newState);

            dropdown.style.maxHeight = newState
              ? dropdown.scrollHeight + "px"
              : "0";

            if (freshChevron) {
              freshChevron.style.transform = newState
                ? "rotate(180deg)"
                : "rotate(0deg)";
            }
          }
        });

        // Handle dropdown item clicks
        const dropdownItems = dropdown.querySelectorAll("a");
        dropdownItems.forEach((dropdownItem) => {
          dropdownItem.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) {
              // Allow navigation but close menu after a small delay
              setTimeout(() => {
                closeMobileMenu();
              }, 100);
            }
          });
        });
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
        toggle.focus();
      }
    });

    console.log("Mobile navigation fix applied successfully!");

    // Global function for manual menu closing
    window.closeMobileMenu = closeMobileMenu;
  }

  // Expose fix function globally
  window.MobileNavigationFix = {
    init: initMobileFix,
    diagnose: function () {
      const mobileToggle = document.getElementById("mobileToggle");
      const navLinks = document.getElementById("navLinks");
      const hasMainJs = !!document.querySelector('script[src*="main.js"]');
      const hasNavigationJs = !!document.querySelector(
        'script[src*="navigation.js"]'
      );

      console.log("Mobile Navigation Diagnosis:", {
        mobileToggle: !!mobileToggle,
        navLinks: !!navLinks,
        hasMainJs,
        hasNavigationJs,
        windowWidth: window.innerWidth,
        mainJsInitialized: !!window.ESL,
        navigationInitialized: !!window.eslNavigationInitialized,
      });

      return {
        mobileToggle: !!mobileToggle,
        navLinks: !!navLinks,
        hasMainJs,
        hasNavigationJs,
      };
    },
  };
})();
