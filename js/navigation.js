/**
 * Enhanced Navigation Support
 * ESL Fun Online - Clean mobile menu and theme functionality
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
  console.log("ESL Navigation: Primary initialization starting...");

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
      savedTheme === "dark"
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

      console.log("Theme toggled to:", theme);
    });
  }

  // Mobile menu functionality - CRITICAL SECTION
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");

  if (mobileToggle && navLinks) {
    console.log("ESL Navigation: Mobile elements found, setting up...");

    // Remove existing listeners by cloning the mobile toggle
    const newMobileToggle = mobileToggle.cloneNode(true);
    mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);

    // Get fresh references
    const freshMobileToggle = document.getElementById("mobileToggle");
    const freshNavLinks = document.getElementById("navLinks");
    const mobileIcon = freshMobileToggle.querySelector("i");
    let isMenuOpen = false;

    // Functions to handle menu state
    function openMenu() {
      isMenuOpen = true;
      freshNavLinks.classList.add("active");
      if (mobileIcon) mobileIcon.className = "fas fa-times";
      body.style.overflow = "hidden";
      body.classList.add("mobile-menu-open");
      console.log("ESL Navigation: Menu opened");
    }

    function closeMenu() {
      isMenuOpen = false;
      freshNavLinks.classList.remove("active");
      if (mobileIcon) mobileIcon.className = "fas fa-bars";
      body.style.overflow = "auto";
      body.classList.remove("mobile-menu-open");
      // Close all dropdowns when closing menu
      navItems.forEach(resetDropdown);
      console.log("ESL Navigation: Menu closed");
    }

    // Mobile menu toggle - MAIN HANDLER
    freshMobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        "ESL Navigation: Mobile toggle clicked, current state:",
        isMenuOpen
      );

      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Touch support for mobile toggle
    freshMobileToggle.addEventListener("touchend", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Prevent double-triggering with click event
        setTimeout(() => {
          if (!isMenuOpen) {
            openMenu();
          } else {
            closeMenu();
          }
        }, 50);
      }
    });

    // Dropdown functionality for mobile
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

        // Handle dropdown toggle
        freshLink.addEventListener("click", function (e) {
          // Only handle dropdown links (with chevron)
          if (!freshChevron) return;

          e.preventDefault();
          e.stopPropagation();

          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            toggleMobileDropdown(item, freshChevron);
          } else {
            toggleDesktopDropdown(item, freshChevron);
          }
        });

        // Add touch event for better mobile support
        if (freshChevron) {
          freshLink.addEventListener("touchend", function (e) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
              e.preventDefault();
              e.stopPropagation();
              setTimeout(() => {
                toggleMobileDropdown(item, freshChevron);
              }, 50);
            }
          });
        }
      }
    });

    // Mobile dropdown toggle function
    function toggleMobileDropdown(item, chevron) {
      const isOpen = item.classList.contains("mobile-open");

      // Close all other dropdowns first
      navItems.forEach((otherItem) => {
        if (otherItem !== item) {
          resetDropdown(otherItem);
        }
      });

      // Toggle current dropdown
      if (isOpen) {
        resetDropdown(item);
      } else {
        item.classList.add("mobile-open");
        chevron.style.transform = "rotate(180deg)";
      }
    }

    // Desktop dropdown toggle function
    function toggleDesktopDropdown(item, chevron) {
      const isOpen = item.classList.contains("desktop-open");

      // Close all other dropdowns
      navItems.forEach((otherItem) => {
        if (otherItem !== item) {
          resetDropdown(otherItem);
        }
      });

      // Toggle current dropdown
      if (isOpen) {
        resetDropdown(item);
      } else {
        item.classList.add("desktop-open");
        chevron.style.transform = "rotate(180deg)";
      }
    }

    // Reset dropdown to closed state
    function resetDropdown(item) {
      item.classList.remove("mobile-open", "desktop-open");
      const chevron = item.querySelector(".fa-chevron-down");
      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
      }
    }

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        isMenuOpen &&
        !freshMobileToggle.contains(e.target) &&
        !freshNavLinks.contains(e.target)
      ) {
        closeMenu();
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

    console.log("ESL Navigation: Mobile menu setup complete");
  } else {
    console.warn("ESL Navigation: Mobile toggle or nav links not found!", {
      mobileToggle: !!mobileToggle,
      navLinks: !!navLinks,
    });
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

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
    });
  }

  console.log("ESL Navigation initialized successfully!");
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
      document.body.style.overflow = "auto";
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
  console.log("ESL Navigation: Manual reset triggered");
  if (window.eslNavigationInitialized) {
    initializeNavigation();
  }
};
