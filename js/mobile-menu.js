/**
 * MOBILE MENU FUNCTIONALITY - ESL Fun Online
 * Unified mobile menu handler for all pages
 * Version: 3.0
 */

(function () {
  "use strict";

  function initMobileMenu() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    const body = document.body;

    if (!mobileToggle || !navLinks) {
      console.warn("Mobile menu elements not found");
      return;
    }

    console.log("Mobile menu initialized");

    let isMenuOpen = false;

    function toggleMenu(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();

      isMenuOpen = !isMenuOpen;
      const icon = mobileToggle.querySelector("i");

      if (isMenuOpen) {
        navLinks.classList.add("active");
        body.classList.add("mobile-menu-open");
        body.style.overflow = "hidden";
        if (icon) icon.className = "fas fa-times";
        mobileToggle.setAttribute("aria-expanded", "true");
      } else {
        navLinks.classList.remove("active");
        body.classList.remove("mobile-menu-open");
        body.style.overflow = "";
        if (icon) icon.className = "fas fa-bars";
        mobileToggle.setAttribute("aria-expanded", "false");

        // Close all dropdowns
        document.querySelectorAll(".nav-item").forEach((item) => {
          item.classList.remove("mobile-open", "mobile-dropdown-open");
          const chevron = item.querySelector(".fa-chevron-down");
          if (chevron) chevron.style.transform = "rotate(0deg)";
        });
      }
    }

    // Unified click handler - prevents double-firing
    let lastToggleTime = 0;

    function handleToggleClick(e) {
      const now = Date.now();
      if (now - lastToggleTime < 300) {
        return;
      }
      lastToggleTime = now;

      e.preventDefault();
      e.stopPropagation();
      toggleMenu(e);
    }

    mobileToggle.addEventListener("click", handleToggleClick);
    mobileToggle.addEventListener("touchend", handleToggleClick);

    // Handle dropdown toggles on mobile
    document.querySelectorAll(".nav-item").forEach((item) => {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown");
      const chevron = link?.querySelector(".fa-chevron-down");

      if (link && dropdown && chevron) {
        let lastDropdownToggle = 0;

        function handleDropdownClick(e) {
          if (window.innerWidth > 768) return; // Only on mobile

          const now = Date.now();
          if (now - lastDropdownToggle < 300) {
            return;
          }
          lastDropdownToggle = now;

          e.preventDefault();
          e.stopPropagation();

          const isOpen = item.classList.contains("mobile-open");

          // Close other dropdowns
          document.querySelectorAll(".nav-item").forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("mobile-open", "mobile-dropdown-open");
              const otherChevron = otherItem.querySelector(".fa-chevron-down");
              if (otherChevron) otherChevron.style.transform = "rotate(0deg)";
            }
          });

          // Toggle current dropdown
          if (isOpen) {
            item.classList.remove("mobile-open", "mobile-dropdown-open");
            chevron.style.transform = "rotate(0deg)";
            link.setAttribute("aria-expanded", "false");
          } else {
            item.classList.add("mobile-open", "mobile-dropdown-open");
            chevron.style.transform = "rotate(180deg)";
            link.setAttribute("aria-expanded", "true");
          }
        }

        if (link.getAttribute("href") === "#") {
          link.style.cursor = "pointer";
        }

        link.addEventListener("click", handleDropdownClick);
        link.addEventListener("touchend", handleDropdownClick);
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768 && isMenuOpen) {
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
          toggleMenu(null);
        }
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu(null);
        mobileToggle.focus();
      }
    });

    // Close menu on window resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && isMenuOpen) {
        toggleMenu(null);
      }
    });

    // Close menu after dropdown link click
    document.querySelectorAll(".dropdown a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768 && isMenuOpen) {
          setTimeout(() => {
            toggleMenu(null);
          }, 100);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }

  // Theme toggle functionality
  function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", currentTheme === "dark");

    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      if (icon) {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      }

      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // Initialize theme toggle
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }

  // Scroll progress indicator
  function updateScrollProgress() {
    const scrollProgress = document.getElementById("scrollProgress");
    if (!scrollProgress) return;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
  }

  window.addEventListener("scroll", updateScrollProgress);
})();
