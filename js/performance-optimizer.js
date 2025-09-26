// Performance Optimization Script
// Reduces CLS, improves FCP/LCP, and optimizes animations

(function () {
  "use strict";

  // Performance monitoring
  const perfObserver = {
    cls: 0,
    fcp: null,
    lcp: null,
    fid: null,
    ttfb: null,
  };

  // Optimize font loading to prevent FOIT/FOUT
  function optimizeFontLoading() {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        document.body.classList.add("fonts-loaded");
        console.log("Fonts loaded successfully");
      });
    }

    // Fallback for browsers without Font Loading API
    const fallbackTimer = setTimeout(() => {
      document.body.classList.add("fonts-loaded");
      console.log("Font loading fallback triggered");
    }, 3000);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        clearTimeout(fallbackTimer);
      });
    }
  }

  // Prevent layout shifts during image loading
  function preventImageLayoutShifts() {
    const images = document.querySelectorAll("img[width][height]");

    images.forEach((img) => {
      // Set aspect ratio to prevent CLS
      const width = parseInt(img.getAttribute("width"), 10);
      const height = parseInt(img.getAttribute("height"), 10);

      if (width && height) {
        const aspectRatio = (height / width) * 100;
        img.style.aspectRatio = `${width} / ${height}`;

        if (!img.complete) {
          // Add placeholder with correct aspect ratio
          img.style.backgroundColor = "#f3f4f6";
          img.style.minHeight = `${aspectRatio}%`;
        }
      }
    });
  }

  // Optimize hero image loading to prevent CLS
  function optimizeHeroImage() {
    const heroImg = document.querySelector(".hero-bg");
    if (heroImg) {
      // Reserve space immediately
      heroImg.style.aspectRatio = "16/9";
      heroImg.style.backgroundColor = "#f3f4f6";

      // Remove background when image loads
      heroImg.addEventListener(
        "load",
        function () {
          this.style.backgroundColor = "";
          console.log("Hero image loaded");
        },
        { once: true }
      );
    }
  }

  // Optimize floating elements to prevent CLS
  function optimizeFloatingElements() {
    const floatingElements = document.querySelectorAll(".floating-element");
    floatingElements.forEach((el, index) => {
      // Set initial position to prevent jumps
      el.style.opacity = "0";
      el.style.transform = "translateZ(0)"; // Force GPU acceleration

      // Animate in after a delay
      setTimeout(() => {
        el.style.transition = "opacity 0.3s ease-out";
        el.style.opacity = "1";
      }, 100 + index * 50);
    });
  }

  // Optimize animations for better performance
  function optimizeAnimations() {
    // Use will-change property judiciously
    const animatedElements = document.querySelectorAll(
      ".hero-title, .hero-subtitle, .stat-number"
    );

    animatedElements.forEach((el) => {
      el.style.willChange = "transform, opacity";

      // Remove will-change after animation
      el.addEventListener(
        "animationend",
        function () {
          this.style.willChange = "auto";
        },
        { once: true }
      );
    });
  }

  // Lazy load non-critical images
  function lazyLoadImages() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        }
      );

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // Optimize scroll performance
  function optimizeScrollPerformance() {
    let ticking = false;

    function updateScrollElements() {
      // Batch DOM reads and writes
      const scrollY = window.pageYOffset;

      // Update scroll-dependent elements efficiently
      const scrollIndicator = document.querySelector(".scroll-indicator");
      if (scrollIndicator) {
        const opacity = Math.max(0, 1 - scrollY / 500);
        scrollIndicator.style.opacity = opacity;

        if (opacity <= 0 && scrollIndicator.style.display !== "none") {
          scrollIndicator.style.display = "none";
        } else if (opacity > 0 && scrollIndicator.style.display === "none") {
          scrollIndicator.style.display = "block";
        }
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
      }
    }

    // Throttle scroll events
    window.addEventListener("scroll", requestTick, { passive: true });
  }

  // Optimize third-party scripts
  function optimizeThirdPartyScripts() {
    // Delay non-critical third-party scripts
    const delayedScripts = [
      "https://www.googletagmanager.com/gtag/js",
      "https://pagead2.googlesyndication.com",
    ];

    let userInteracted = false;
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    function triggerDelayedScripts() {
      if (userInteracted) return;
      userInteracted = true;

      // Remove event listeners
      events.forEach((event) => {
        document.removeEventListener(event, triggerDelayedScripts, {
          passive: true,
        });
      });

      console.log("User interaction detected, loading third-party scripts");

      // Trigger any delayed script loading here
      window.dispatchEvent(new CustomEvent("userInteraction"));
    }

    // Listen for user interaction
    events.forEach((event) => {
      document.addEventListener(event, triggerDelayedScripts, {
        passive: true,
      });
    });

    // Fallback: load after 5 seconds even without interaction
    setTimeout(triggerDelayedScripts, 5000);
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      // Monitor CLS
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            perfObserver.cls += entry.value;
            console.log(
              "CLS detected:",
              entry.value,
              "Total:",
              perfObserver.cls
            );
          }
        }
      });

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        console.warn("CLS monitoring not supported");
      }

      // Monitor LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        perfObserver.lcp = lastEntry.startTime;
        console.log("LCP:", perfObserver.lcp);
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        console.warn("LCP monitoring not supported");
      }

      // Monitor FCP
      const fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            perfObserver.fcp = entry.startTime;
            console.log("FCP:", perfObserver.fcp);
          }
        }
      });

      try {
        fcpObserver.observe({ entryTypes: ["paint"] });
      } catch (e) {
        console.warn("FCP monitoring not supported");
      }
    }
  }

  // Report performance metrics
  function reportPerformanceMetrics() {
    setTimeout(() => {
      console.log("Performance Summary:", {
        CLS: perfObserver.cls,
        LCP: perfObserver.lcp,
        FCP: perfObserver.fcp,
      });

      // Send to analytics if available
      if (window.gtag) {
        window.gtag("event", "page_performance", {
          custom_parameter_cls: Math.round(perfObserver.cls * 1000) / 1000,
          custom_parameter_lcp: Math.round(perfObserver.lcp),
          custom_parameter_fcp: Math.round(perfObserver.fcp),
        });
      }
    }, 5000);
  }

  // Initialize all optimizations
  function initialize() {
    // Run immediately
    preventImageLayoutShifts();
    optimizeHeroImage();
    optimizeFontLoading();
    optimizeFloatingElements();
    optimizeAnimations();

    // Run after DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        lazyLoadImages();
        optimizeScrollPerformance();
        initPerformanceMonitoring();
      });
    } else {
      lazyLoadImages();
      optimizeScrollPerformance();
      initPerformanceMonitoring();
    }

    // Run after page load
    window.addEventListener("load", () => {
      optimizeThirdPartyScripts();
      reportPerformanceMetrics();
    });
  }

  // Start optimization
  initialize();

  // Expose performance data for debugging
  window.perfOptimizer = {
    getMetrics: () => perfObserver,
    cls: () => perfObserver.cls,
    lcp: () => perfObserver.lcp,
    fcp: () => perfObserver.fcp,
  };
})();
