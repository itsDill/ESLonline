/**
 * Shared Navigation JavaScript
 * ESL Fun Online
 */

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme") || "light";
    body.classList.toggle("dark-mode", savedTheme === "dark");
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      const theme = isDark ? "dark" : "light";

      localStorage.setItem("theme", theme);
      updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
      if (themeIcon) {
        themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    const mobileIcon = mobileToggle.querySelector("i");

    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      navLinks.classList.toggle("active");
      const isOpen = navLinks.classList.contains("active");

      if (mobileIcon) {
        mobileIcon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }
    });

    // Close mobile menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link")) {
        navLinks.classList.remove("active");
        if (mobileIcon) {
          mobileIcon.className = "fas fa-bars";
        }
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        if (mobileIcon) {
          mobileIcon.className = "fas fa-bars";
        }
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      navLinks &&
      navLinks.classList.contains("active")
    ) {
      navLinks.classList.remove("active");
      const mobileIcon = mobileToggle?.querySelector("i");
      if (mobileIcon) {
        mobileIcon.className = "fas fa-bars";
      }
      if (mobileToggle) {
        mobileToggle.focus();
      }
    }
  });

  // Header scroll effect
  let lastScroll = 0;
  const header = document.querySelector("header");

  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.background = body.classList.contains("dark-mode")
          ? "rgba(31, 41, 55, 0.98)"
          : "rgba(255, 255, 255, 0.98)";
        header.style.backdropFilter = "blur(15px)";
        header.classList.add("scrolled");
      } else {
        header.style.background = body.classList.contains("dark-mode")
          ? "rgba(31, 41, 55, 0.95)"
          : "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(10px)";
        header.classList.remove("scrolled");
      }

      lastScroll = currentScroll;
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#!") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Loading animation
  window.addEventListener("load", () => {
    body.classList.remove("loading");
    body.classList.add("loaded");
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe animate-on-scroll elements
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Performance optimization: Lazy load images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Analytics tracking (placeholder)
  function trackEvent(category, action, label) {
    // Replace with your analytics implementation
    console.log(`Event: ${category} - ${action} - ${label}`);
  }

  // Track clicks on resource cards
  document.querySelectorAll(".resource-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent;
      if (title) {
        trackEvent("Resource", "Click", title);
      }
    });
  });

  // Error handling for failed resource loads
  window.addEventListener("error", (e) => {
    console.error("Resource failed to load:", e.target?.src || e.target?.href);
  });
});
