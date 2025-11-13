/* ========================================
   HERO SECTION JAVASCRIPT
   Centralized hero functionality for all pages
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Hero background image lazy loading
  const hero = document.querySelector(".hero");

  if (hero) {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    // Only load background image on desktop
    if (!isMobile) {
      const bgImage = hero.getAttribute("data-bg-image");
      if (bgImage) {
        const img = new Image();
        img.onload = function () {
          hero.style.setProperty("--hero-bg-loaded", `url(${bgImage})`);
          hero.classList.add("bg-loaded");
        };
        img.src = bgImage;
      }
    }

    // Add scroll indicator functionality
    const scrollIndicator = hero.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", function () {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }
});

// Hero parallax effect (optional - only on desktop)
if (window.innerWidth > 768) {
  window.addEventListener("scroll", function () {
    const hero = document.querySelector(".hero");
    if (hero) {
      const scrolled = window.pageYOffset;
      const heroContent = hero.querySelector(".hero-content");
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    }
  });
}

// CTA button analytics/tracking (placeholder)
document.addEventListener("DOMContentLoaded", function () {
  const ctaButtons = document.querySelectorAll(".cta-primary, .cta-secondary");

  ctaButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      const buttonText = this.textContent.trim();
      const buttonType = this.classList.contains("cta-primary")
        ? "primary"
        : "secondary";

      // Analytics tracking (if Google Analytics is available)
      if (typeof gtag !== "undefined") {
        gtag("event", "cta_click", {
          event_category: "engagement",
          event_label: buttonText,
          button_type: buttonType,
        });
      }

      // Console log for debugging
      console.log(`CTA clicked: ${buttonText} (${buttonType})`);
    });
  });
});

// Floating elements animation control
document.addEventListener("DOMContentLoaded", function () {
  const floatingElements = document.querySelectorAll(".floating-element");

  // Pause animations when tab is not visible (performance optimization)
  document.addEventListener("visibilitychange", function () {
    floatingElements.forEach(function (element) {
      if (document.hidden) {
        element.style.animationPlayState = "paused";
      } else {
        element.style.animationPlayState = "running";
      }
    });
  });
});

// Hero stats counter animation
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Trigger counter animations when stats come into view
document.addEventListener("DOMContentLoaded", function () {
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("animated")
          ) {
            const finalValue = parseInt(
              entry.target.getAttribute("data-count") ||
                entry.target.textContent.replace(/,/g, "")
            );
            entry.target.classList.add("animated");
            animateCounter(entry.target, 0, finalValue, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (stat) {
      observer.observe(stat);
    });
  }
});

// Export functions if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    animateCounter,
  };
}
