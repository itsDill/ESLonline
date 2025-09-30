/**
 * Enhanced Features JavaScript for All Featured Pages
 * Provides consistent functionality across ESL Fun Online featured pages
 */

class ESLEnhancedFeatures {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeFeatures()
      );
    } else {
      this.initializeFeatures();
    }
  }

  initializeFeatures() {
    this.initScrollProgress();
    this.initNavigationEnhancements();
    this.initProgressTracking();
    this.initAccessibilityEnhancements();
    this.initMobileOptimizations();
    this.initAdSenseOptimizations();
    this.initPerformanceOptimizations();
  }

  // Scroll Progress Indicator
  initScrollProgress() {
    const progressBar = document.getElementById("scrollProgress");
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + "%";
    };

    // Throttled scroll handler for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress(); // Initial call
  }

  // Enhanced Navigation Features
  initNavigationEnhancements() {
    // Enhanced dropdown keyboard navigation
    const dropdowns = document.querySelectorAll('.dropdown[role="menu"]');
    dropdowns.forEach((dropdown) => {
      const items = dropdown.querySelectorAll(".dropdown-item");
      items.forEach((item, index) => {
        item.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = items[index + 1] || items[0];
            next.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = items[index - 1] || items[items.length - 1];
            prev.focus();
          } else if (e.key === "Escape") {
            e.preventDefault();
            const parentToggle = dropdown
              .closest(".nav-item")
              .querySelector(".nav-link");
            parentToggle.focus();
            dropdown.style.display = "none";
          }
        });
      });
    });

    // Mobile menu toggle enhancement
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("show");
        navLinks.classList.toggle("show");
        mobileToggle.setAttribute("aria-expanded", !isOpen);

        // Trap focus in mobile menu when open
        if (!isOpen) {
          this.trapFocus(navLinks);
        }
      });
    }

    // Theme toggle enhancement
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      const currentTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", currentTheme);

      themeToggle.addEventListener("click", () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Update icon
        const icon = themeToggle.querySelector("i");
        icon.className = newTheme === "light" ? "fas fa-moon" : "fas fa-sun";
      });
    }
  }

  // Progress Tracking for Interactive Content
  initProgressTracking() {
    const progressFill = document.getElementById("progressFill");
    const revealedCount = document.getElementById("revealedCount");

    if (!progressFill || !revealedCount) return;

    let revealed = 0;
    const total = document.querySelectorAll(
      ".reveal-answer, .quiz-item, .interactive-item"
    ).length;

    // Track reveal button clicks
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("reveal-answer") ||
        e.target.closest(".reveal-answer")
      ) {
        const button = e.target.classList.contains("reveal-answer")
          ? e.target
          : e.target.closest(".reveal-answer");

        if (!button.classList.contains("revealed")) {
          button.classList.add("revealed");
          revealed++;
          this.updateProgress(revealed, total, progressFill, revealedCount);

          // Achievement feedback
          if (revealed === total) {
            this.showAchievement(
              "🎉 Congratulations! You completed everything!"
            );
          } else if (revealed === Math.floor(total / 2)) {
            this.showAchievement("🌟 Great progress! You're halfway there!");
          }
        }
      }
    });

    // Initialize progress
    this.updateProgress(0, total, progressFill, revealedCount);
  }

  updateProgress(current, total, progressElement, countElement) {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    progressElement.style.width = percentage + "%";
    countElement.textContent = current;

    // Update progress bar color based on completion
    if (percentage === 100) {
      progressElement.style.background =
        "linear-gradient(90deg, #10b981 0%, #34d399 100%)";
    } else if (percentage >= 50) {
      progressElement.style.background =
        "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)";
    }
  }

  showAchievement(message) {
    // Create achievement notification
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="achievement-content">
        <span class="achievement-text">${message}</span>
        <button class="achievement-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #10b981, #34d399);
      color: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto-hide and close button
    const close = () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    };

    notification
      .querySelector(".achievement-close")
      .addEventListener("click", close);
    setTimeout(close, 5000);
  }

  // Enhanced Accessibility Features
  initAccessibilityEnhancements() {
    // Add skip link functionality
    const skipLink = document.querySelector(".skip-link, .skip-to-content");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target =
          document.querySelector(skipLink.getAttribute("href")) ||
          document.querySelector("#main-content") ||
          document.querySelector("main");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          target.focus();
        }
      });
    }

    // Enhanced focus management
    document.addEventListener("keydown", (e) => {
      // Escape key handling for modals/dropdowns
      if (e.key === "Escape") {
        const openDropdowns = document.querySelectorAll(
          '.dropdown:not([style*="display: none"])'
        );
        openDropdowns.forEach((dropdown) => {
          dropdown.style.display = "none";
        });
      }
    });

    // Add ARIA live region for dynamic content
    if (!document.getElementById("aria-live-region")) {
      const liveRegion = document.createElement("div");
      liveRegion.id = "aria-live-region";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.style.cssText =
        "position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;";
      document.body.appendChild(liveRegion);
    }
  }

  // Mobile-Specific Optimizations
  initMobileOptimizations() {
    // Touch-friendly interactions
    if ("ontouchstart" in window) {
      document.body.classList.add("touch-device");

      // Add touch feedback to interactive elements
      const touchElements = document.querySelectorAll(
        ".feature-card, .reveal-answer, .nav-link"
      );
      touchElements.forEach((element) => {
        element.addEventListener(
          "touchstart",
          () => {
            element.style.transform = "scale(0.98)";
          },
          { passive: true }
        );

        element.addEventListener(
          "touchend",
          () => {
            setTimeout(() => {
              element.style.transform = "";
            }, 150);
          },
          { passive: true }
        );
      });
    }

    // Responsive image loading
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // AdSense Optimization
  initAdSenseOptimizations() {
    // Lazy load AdSense ads
    if ("IntersectionObserver" in window) {
      const adObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const ad = entry.target;
              if (!ad.dataset.loaded) {
                // Trigger AdSense refresh if needed
                if (window.adsbygoogle && window.adsbygoogle.push) {
                  try {
                    window.adsbygoogle.push({});
                    ad.dataset.loaded = "true";
                  } catch (e) {
                    console.log("AdSense load deferred");
                  }
                }
                adObserver.unobserve(ad);
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      document
        .querySelectorAll(".adsbygoogle:not([data-loaded])")
        .forEach((ad) => {
          adObserver.observe(ad);
        });
    }
  }

  // Performance Optimizations
  initPerformanceOptimizations() {
    // Preload critical resources
    const preloadLinks = [
      { href: "../css/header.css", as: "style" },
      { href: "../css/main.css", as: "style" },
      { href: "../js/main.js", as: "script" },
    ];

    preloadLinks.forEach((link) => {
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        const linkElement = document.createElement("link");
        linkElement.rel = "preload";
        linkElement.href = link.href;
        linkElement.as = link.as;
        document.head.appendChild(linkElement);
      }
    });

    // Intersection Observer for animations
    if ("IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              animationObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        animationObserver.observe(element);
      });
    }
  }

  // Utility: Focus trap for modals
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    firstElement.focus();
  }
}

// Initialize enhanced features
new ESLEnhancedFeatures();

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = ESLEnhancedFeatures;
}
