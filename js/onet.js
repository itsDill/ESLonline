// O-NET Page JavaScript

(function () {
  "use strict";

  // Mobile Menu Initialization
  function initMobileMenu() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    const body = document.body;

    if (!mobileToggle || !navLinks) return;

    let isMenuOpen = false;

    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      isMenuOpen = !isMenuOpen;
      const icon = mobileToggle.querySelector("i");

      if (isMenuOpen) {
        navLinks.classList.add("active");
        body.classList.add("mobile-menu-open");
        body.style.overflow = "hidden";
        if (icon) icon.className = "fas fa-times";
      } else {
        navLinks.classList.remove("active");
        body.classList.remove("mobile-menu-open");
        body.style.overflow = "";
        if (icon) icon.className = "fas fa-bars";
      }
    }

    mobileToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768 && isMenuOpen) {
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
          toggleMenu(null);
        }
      }
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu(null);
      }
    });
  }

  // Smooth Scroll for Anchor Links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Subject Card Interactions
  function initSubjectCards() {
    const subjectCards = document.querySelectorAll(".subject-card");

    subjectCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-15px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  // Practice Test Timer
  function startPracticeTest(testName, duration) {
    const confirmed = confirm(
      `Start ${testName}? You will have ${duration} minutes to complete the test.`
    );

    if (confirmed) {
      // Store test start time
      localStorage.setItem("testStartTime", new Date().getTime());
      localStorage.setItem("testDuration", duration);
      localStorage.setItem("testName", testName);

      // Redirect to test page (placeholder for now)
      alert(`Starting ${testName}. Test interface coming soon!`);
    }
  }

  // Practice Test Button Handlers
  function initPracticeTests() {
    const practiceButtons = document.querySelectorAll(".btn-practice");

    practiceButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const card = this.closest(".practice-card");
        const testName = card.querySelector("h3").textContent;
        const duration = card
          .querySelector(".practice-info")
          .textContent.match(/\d+/);

        if (duration) {
          startPracticeTest(testName, duration[0]);
        }
      });
    });
  }

  // Study Progress Tracker
  function initProgressTracker() {
    const progressSteps = document.querySelectorAll(".timeline-item");

    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem("onetProgress");
    let currentStep = savedProgress ? parseInt(savedProgress) : 1;

    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      const marker = step.querySelector(".timeline-marker");

      if (stepNumber < currentStep) {
        marker.innerHTML = '<i class="fas fa-check"></i>';
        marker.style.background = "#10b981";
      } else if (stepNumber === currentStep) {
        marker.style.background = "#667eea";
      }
    });

    // Add click handlers to timeline buttons
    const timelineButtons = document.querySelectorAll(".btn-timeline");
    timelineButtons.forEach((button, index) => {
      button.addEventListener("click", function (e) {
        const nextStep = index + 2;
        if (nextStep <= 4) {
          localStorage.setItem("onetProgress", nextStep);
        }
      });
    });
  }

  // Scroll Animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(
        ".fade-in-up, .subject-card, .tip-card, .practice-card, .overview-card"
      )
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        observer.observe(el);
      });
  }

  // Statistics Counter Animation
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach((counter) => {
      const target = parseInt(counter.textContent.replace(/[^0-9]/g, ""));
      const suffix = counter.textContent.replace(/[0-9]/g, "");
      let current = 0;
      const increment = target / 60;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };

      // Start animation when element is visible
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCounter();
          observer.disconnect();
        }
      });

      observer.observe(counter);
    });
  }

  // Study Tips Bookmark System
  function initBookmarks() {
    const tipCards = document.querySelectorAll(".tip-card");
    const savedBookmarks = JSON.parse(
      localStorage.getItem("onetBookmarks") || "[]"
    );

    tipCards.forEach((card, index) => {
      const bookmark = document.createElement("button");
      bookmark.className = "bookmark-btn";
      bookmark.innerHTML = '<i class="far fa-bookmark"></i>';
      bookmark.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: none;
        font-size: 1.5rem;
        color: #667eea;
        cursor: pointer;
        transition: all 0.3s ease;
      `;

      if (savedBookmarks.includes(index)) {
        bookmark.innerHTML = '<i class="fas fa-bookmark"></i>';
      }

      bookmark.addEventListener("click", function (e) {
        e.stopPropagation();
        const icon = this.querySelector("i");
        const isBookmarked = icon.classList.contains("fas");

        if (isBookmarked) {
          icon.classList.remove("fas");
          icon.classList.add("far");
          const idx = savedBookmarks.indexOf(index);
          if (idx > -1) savedBookmarks.splice(idx, 1);
        } else {
          icon.classList.remove("far");
          icon.classList.add("fas");
          savedBookmarks.push(index);
        }

        localStorage.setItem("onetBookmarks", JSON.stringify(savedBookmarks));
      });

      card.style.position = "relative";
      card.appendChild(bookmark);
    });
  }

  // Resource Download Tracker
  function initResourceTracking() {
    const resourceLinks = document.querySelectorAll(".resource-link");

    resourceLinks.forEach((link) => {
      link.addEventListener("click", function () {
        const resourceName =
          this.closest(".resource-card").querySelector("h4").textContent;

        // Track usage
        const usage = JSON.parse(localStorage.getItem("resourceUsage") || "{}");
        usage[resourceName] = (usage[resourceName] || 0) + 1;
        localStorage.setItem("resourceUsage", JSON.stringify(usage));
      });
    });
  }

  // Initialize all features
  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initSmoothScroll();
    initSubjectCards();
    initPracticeTests();
    initProgressTracker();
    initScrollAnimations();
    animateCounters();
    initBookmarks();
    initResourceTracking();

    console.log("O-NET page initialized successfully");
  });

  // Export for potential external use
  window.OnetPage = {
    startPracticeTest,
  };
})();
