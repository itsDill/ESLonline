// Test Preparation Pages - Shared JavaScript
(function () {
  "use strict";

  // Utility functions
  function debounce(func, wait) {
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

  // Theme management
  function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || "light";

    document.body.classList.toggle("dark-theme", savedTheme === "dark");

    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }

      themeToggle.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        const icon = this.querySelector("i");
        if (icon) {
          icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
        }
      });
    }
  }

  // Mobile navigation
  function initMobileNav() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", function () {
        navLinks.classList.toggle("show");
        const icon = this.querySelector("i");
        if (icon) {
          icon.className = navLinks.classList.contains("show")
            ? "fas fa-times"
            : "fas fa-bars";
        }
      });

      // Close mobile menu when clicking on links
      navLinks.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          this.classList.remove("show");
          const icon = mobileToggle.querySelector("i");
          if (icon) {
            icon.className = "fas fa-bars";
          }
        }
      });
    }
  }

  // Accordion functionality
  function initAccordions() {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const item = this.parentElement;
        const content = this.nextElementSibling;
        const icon = this.querySelector(".accordion-icon");
        const isActive = item.classList.contains("active");

        // Close all accordions
        accordionHeaders.forEach((otherHeader) => {
          const otherItem = otherHeader.parentElement;
          const otherContent = otherHeader.nextElementSibling;
          const otherIcon = otherHeader.querySelector(".accordion-icon");

          if (otherItem !== item) {
            otherItem.classList.remove("active");
            if (otherContent) otherContent.style.maxHeight = "0";
            if (otherIcon) otherIcon.classList.remove("active");
          }
        });

        // Toggle current accordion
        if (!isActive) {
          item.classList.add("active");
          if (content) content.style.maxHeight = content.scrollHeight + "px";
          if (icon) icon.classList.add("active");
        } else {
          item.classList.remove("active");
          if (content) content.style.maxHeight = "0";
          if (icon) icon.classList.remove("active");
        }
      });
    });
  }

  // Form validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Newsletter subscription
  function initNewsletterForms() {
    const forms = document.querySelectorAll(".newsletter-form");

    forms.forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && validateEmail(emailInput.value)) {
          // Simulate successful subscription
          const button = this.querySelector("button");
          if (button) {
            const originalText = button.textContent;
            button.textContent = "Subscribed!";
            button.disabled = true;

            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
              emailInput.value = "";
            }, 2000);
          }
        } else {
          alert("Please enter a valid email address.");
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      e.preventDefault();
      const targetId = target.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  // Scroll progress indicator
  function initScrollProgress() {
    const progressBar = document.getElementById("progressBar");
    if (!progressBar) return;

    const updateProgress = debounce(() => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.transform = `scaleX(${Math.min(scrolled / 100, 1)})`;
    }, 10);

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial call
  }

  // Card hover effects
  function initCardEffects() {
    const cards = document.querySelectorAll(
      ".test-card, .section-card, .resource-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
      });
    });
  }

  // Initialize all functionality when DOM is ready
  function init() {
    initTheme();
    initMobileNav();
    initAccordions();
    initNewsletterForms();
    initSmoothScrolling();
    initScrollProgress();
    initCardEffects();
  }

  // Start initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Error handling
  window.addEventListener("error", function (e) {
    console.error("JavaScript error:", e.error);
  });
})();
