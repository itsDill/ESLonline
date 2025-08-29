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

    // Mobile menu functionality
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-item");

    if (mobileToggle && navLinks) {
      const mobileIcon = mobileToggle.querySelector("i");

      // Mobile menu toggle
      mobileToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = navLinks.classList.contains("active");

        // Toggle menu state
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Functions to handle menu state
      function openMenu() {
        navLinks.classList.add("active");
        if (mobileIcon) mobileIcon.className = "fas fa-times";
        body.style.overflow = "hidden";
      }

      function closeMenu() {
        navLinks.classList.remove("active");
        if (mobileIcon) mobileIcon.className = "fas fa-bars";
        body.style.overflow = "auto";
        // Close all dropdowns when closing menu
        navItems.forEach(resetDropdown);
      }

      // Dropdown functionality for mobile
      navItems.forEach((item) => {
        const link = item.querySelector(".nav-link");
        const dropdown = item.querySelector(".dropdown");
        const chevron = link?.querySelector(".fa-chevron-down");

        if (link && dropdown && chevron) {
          // Handle dropdown toggle
          link.addEventListener("click", function (e) {
            // Only handle dropdown links (with chevron)
            if (!chevron) return;

            e.preventDefault();
            e.stopPropagation();

            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
              toggleMobileDropdown(item, chevron);
            } else {
              toggleDesktopDropdown(item, chevron);
            }
          });

          // Add touch event for better mobile support
          if (chevron) {
            link.addEventListener("touchend", function (e) {
              const isMobile = window.innerWidth <= 768;
              if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileDropdown(item, chevron);
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
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
          if (navLinks.classList.contains("active")) {
            closeMenu();
          }
        }
      });

      // Handle window resize
      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          closeMenu();
        }
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
