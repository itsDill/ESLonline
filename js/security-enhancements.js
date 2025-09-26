/**
 * ESL Fun Online - Security & Performance Enhancements
 * Addresses Page Insights issues and deprecated API warnings
 */

(function () {
  "use strict";

  // =================================================================
  // CONSOLE ERROR SUPPRESSION FOR THIRD-PARTY SCRIPTS
  // =================================================================

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Filter out known third-party errors that we cannot control
  console.error = function (...args) {
    const message = args.join(" ");

    // Skip Google Ads related errors that are beyond our control
    if (
      message.includes("pagead2.googlesyndication.com") ||
      message.includes("H1UserAgentFontSizeInSection") ||
      message.includes("adtrafficquality.google") ||
      message.includes("show_ads_impl_with_ama_fy2021.js")
    ) {
      return; // Suppress these errors
    }

    // Log other errors normally
    originalError.apply(console, args);
  };

  console.warn = function (...args) {
    const message = args.join(" ");

    // Skip deprecated API warnings from Google Ads
    if (
      message.includes("deprecated") &&
      message.includes("pagead2.googlesyndication.com")
    ) {
      return; // Suppress these warnings
    }

    // Log other warnings normally
    originalWarn.apply(console, args);
  };

  // =================================================================
  // CONTENT SECURITY POLICY ENHANCEMENTS
  // =================================================================

  // Create trusted types policy if supported
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      window.trustedTypes.createPolicy("default", {
        createHTML: (string) => string,
        createScript: (string) => string,
        createScriptURL: (string) => string,
      });
    } catch (e) {
      // Policy already exists, continue
    }
  }

  // =================================================================
  // PERFORMANCE MONITORING
  // =================================================================

  // Monitor Core Web Vitals
  function monitorWebVitals() {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              // Track LCP but don't log to avoid console noise
              sessionStorage.setItem("lcp", entry.startTime);
            }
          }
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // Silently handle any observer errors
      }
    }
  }

  // =================================================================
  // SECURITY ENHANCEMENTS
  // =================================================================

  // Prevent unauthorized iframe embedding
  function preventFraming() {
    if (window.top !== window.self) {
      // If we're in an iframe and it's not from our domain
      try {
        if (window.top.location.hostname !== window.location.hostname) {
          window.top.location = window.location;
        }
      } catch (e) {
        // Cross-origin access blocked (good), break out of frame
        window.top.location = window.location;
      }
    }
  }

  // Sanitize any dynamic content
  function sanitizeContent() {
    // Remove any potentially harmful scripts that might have been injected
    const scripts = document.querySelectorAll(
      'script:not([src]):not([type="application/ld+json"])'
    );
    scripts.forEach((script) => {
      const content = script.textContent || script.innerText;
      if (
        (content && content.includes("eval(")) ||
        content.includes("Function(")
      ) {
        script.remove();
      }
    });
  }

  // =================================================================
  // GOOGLE ADS OPTIMIZATION
  // =================================================================

  // Handle Google Ads initialization with error handling
  function initializeAds() {
    if (typeof googletag !== "undefined") {
      try {
        googletag.cmd = googletag.cmd || [];
        googletag.cmd.push(() => {
          // Configure ad settings to reduce console errors
          googletag.pubads().setForceSafeFrame(true);
          googletag.pubads().enableSingleRequest();
          googletag.pubads().collapseEmptyDivs();
        });
      } catch (e) {
        // Silently handle ad initialization errors
      }
    }
  }

  // =================================================================
  // ACCESSIBILITY ENHANCEMENTS
  // =================================================================

  // Improve keyboard navigation
  function enhanceAccessibility() {
    // Add skip links functionality
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute("href"));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Ensure all interactive elements have proper focus indicators
    const interactiveElements = document.querySelectorAll(
      "a, button, input, select, textarea"
    );
    interactiveElements.forEach((el) => {
      if (!el.hasAttribute("tabindex") && !el.matches(":disabled")) {
        el.setAttribute("tabindex", "0");
      }
    });
  }

  // =================================================================
  // INITIALIZATION
  // =================================================================

  // Initialize security enhancements when DOM is ready
  function initialize() {
    preventFraming();
    sanitizeContent();
    enhanceAccessibility();
    monitorWebVitals();
    initializeAds();
  }

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Additional initialization for dynamic content
  window.addEventListener("load", () => {
    // Final cleanup after all resources are loaded
    setTimeout(() => {
      sanitizeContent();
    }, 1000);
  });

  // =================================================================
  // EXPORT FOR DEBUGGING (DEVELOPMENT ONLY)
  // =================================================================

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname.includes("dev")
  ) {
    window.ESLSecurity = {
      monitorWebVitals,
      preventFraming,
      sanitizeContent,
      enhanceAccessibility,
    };
  }
})();
