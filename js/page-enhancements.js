/**
 * Page Enhancement Scripts
 * Consolidated UI enhancements and performance optimizations
 */

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const progressBar = document.getElementById("scrollProgress");
  window.addEventListener(
    "scroll",
    () => {
      const scrolled =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      if (progressBar) progressBar.style.width = scrolled + "%";
    },
    { passive: true },
  );

  // ============================================
  // SMOOTH SCROLLING FOR INTERNAL LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "#!") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.dataset.index !== undefined) {
            entry.target.style.transitionDelay = `${entry.target.dataset.index * 0.1}s`;
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".animate-on-scroll").forEach((el, index) => {
    el.dataset.index = index;
    revealObserver.observe(el);
  });

  // Observe specific sections and cards
  const elementsToReveal = document.querySelectorAll(
    ".resource-card, .journey-card, .stat-item, .trust-card, .feature-card, .quick-link-card, .dual-option-card, .resource-box, .cta-box",
  );
  elementsToReveal.forEach((el, index) => {
    el.dataset.index = index;
    revealObserver.observe(el);
  });

  // ============================================
  // COUNTER ANIMATION FOR STATS
  // ============================================
  const counters = document.querySelectorAll(".stat-number[data-target]");
  const animateCounter = (counter) => {
    const target = counter.dataset.target;
    const isPercentage = target.includes("%");
    const isTime = target.includes("/");
    const isPlus = target.includes("+");

    if (isTime) {
      counter.textContent = target;
      return;
    }

    const numericValue = parseInt(target.replace(/[^0-9]/g, ""));
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < numericValue) {
        counter.textContent = Math.ceil(current) + (isPlus ? "+" : "");
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // ============================================
  // LAZY LOAD IMAGES
  // ============================================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              img.classList.add("loaded");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: "50px 0px" },
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Performance optimizations
  function initPerformanceOptimizations() {
    // Debounce scroll events and avoid dropdown interference
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;

    window.addEventListener(
      "scroll",
      () => {
        // Don't process scroll events if dropdowns are open
        if (
          document.querySelector(".nav-links.mobile-menu-open") ||
          document.querySelector(".nav-item.desktop-open") ||
          document.querySelector(".nav-item.dropdown-protected") ||
          document.querySelector(".nav-item:hover")
        ) {
          return;
        }

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          if (originalScrollHandler) originalScrollHandler();
        }, 10);
      },
      { passive: true },
    );

    // Optimize animations for performance
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty("--transition-normal", "none");
    }

    // Add keyboard navigation for accessibility
    document.addEventListener("keydown", (e) => {
      // Press 'T' to go to top
      if (
        (e.key === "t" || e.key === "T") &&
        !e.target.matches("input, textarea")
      ) {
        e.preventDefault();
        scrollToTop();
      }
      // Press 'F' to go to features
      if (
        (e.key === "f" || e.key === "F") &&
        !e.target.matches("input, textarea")
      ) {
        e.preventDefault();
        scrollToSection("features");
      }
      // Press 'A' to go to activity
      if (
        (e.key === "a" || e.key === "A") &&
        !e.target.matches("input, textarea")
      ) {
        e.preventDefault();
        scrollToSection("activity");
      }
    });

    // Add visual feedback for reduced motion users
    if (prefersReducedMotion.matches) {
      document.body.classList.add("reduced-motion");
    }
  }

  // Hero Background Lazy Loading for Desktop Only
  function initHeroOptimization() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // Only load background image on desktop
      const img = new Image();
      img.onload = function () {
        hero.style.setProperty("--hero-bg-loaded", 'url("images/hero.webp")');
        hero.classList.add("bg-loaded");
      };
      img.src = "images/hero.webp";
    } else {
      // On mobile, ensure background is just gradient
      hero.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";
    }

    // Optimize scroll indicator for mobile
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator && isMobile) {
      scrollIndicator.style.display = "none"; // Hide on very small screens
    }
  }

  // Initialize performance optimizations
  initPerformanceOptimizations();

  // Call hero optimization - use requestIdleCallback for non-critical
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initHeroOptimization);
  } else {
    initHeroOptimization();
  }
});

// Helper functions (if not already defined elsewhere)
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
