/**
 * Enhanced Navigation Support
 * ESL Fun Online - Clean mobile menu and theme functionality
 */

// Prevent multiple initializations
if (!window.eslNavigationInitialized) {
  window.eslNavigationInitialized = true;

  document.addEventListener("DOMContentLoaded", function () {
    // Enhanced theme management
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    if (themeToggle) {
      const savedTheme = localStorage.getItem("theme") || "light";
      body.classList.toggle("dark-mode", savedTheme === "dark");

      const themeIcon = themeToggle.querySelector("i");
      if (themeIcon) {
        themeIcon.className =
          savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }

      themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        const theme = isDark ? "dark" : "light";

        localStorage.setItem("theme", theme);
        if (themeIcon) {
          themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
        }
      });
    }

    // Enhanced mobile menu functionality
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-item");

    if (mobileToggle && navLinks) {
      const mobileIcon = mobileToggle.querySelector("i");

      // Toggle mobile menu
      mobileToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = navLinks.classList.contains("active");
        navLinks.classList.toggle("active", !isOpen);

        if (mobileIcon) {
          mobileIcon.className = isOpen ? "fas fa-bars" : "fas fa-times";
        }

        // Prevent body scroll when menu is open
        body.style.overflow = isOpen ? "auto" : "hidden";
      });

      // Handle mobile dropdown toggles
      navItems.forEach((item) => {
        const link = item.querySelector(".nav-link");
        const dropdown = item.querySelector(".dropdown");

        if (link && dropdown) {
          link.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
              e.preventDefault();

              // Close other dropdowns
              navItems.forEach((otherItem) => {
                if (otherItem !== item) {
                  otherItem.classList.remove("mobile-open");
                }
              });

              // Toggle current dropdown
              item.classList.toggle("mobile-open");
            }
          });
        }
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !mobileToggle.contains(e.target) &&
          !navLinks.contains(e.target) &&
          navLinks.classList.contains("active")
        ) {
          navLinks.classList.remove("active");
          body.style.overflow = "auto";

          if (mobileIcon) {
            mobileIcon.className = "fas fa-bars";
          }

          // Close all mobile dropdowns
          navItems.forEach((item) => {
            item.classList.remove("mobile-open");
          });
        }
      });

      // Handle window resize
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          navLinks.classList.remove("active");
          body.style.overflow = "auto";

          if (mobileIcon) {
            mobileIcon.className = "fas fa-bars";
          }

          // Close all mobile dropdowns
          navItems.forEach((item) => {
            item.classList.remove("mobile-open");
          });
        }
      });
    }

    // Enhanced scroll behavior for header
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

        // Auto-hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.classList.add("hidden");
        } else {
          header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
      });
    }
  });
}

// Utility functions
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
    }

    const icon = mobileToggle?.querySelector("i");
    if (icon) icon.className = "fas fa-bars";

    // Close all dropdowns
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("mobile-open");
    });
  },

  openPage(url) {
    this.closeMobileMenu();
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  },
};
