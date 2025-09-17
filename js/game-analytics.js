/**
 * Game Analytics and Testing Suite
 * Comprehensive tracking and A/B testing for game ads and UX
 */

class GameAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.userAgent = navigator.userAgent;
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.init();
  }

  init() {
    this.setupEventTracking();
    this.setupPerformanceTracking();
    this.setupErrorTracking();
    this.startSessionTracking();
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  // Track user events
  trackEvent(eventName, properties = {}) {
    const event = {
      sessionId: this.sessionId,
      eventName,
      properties,
      timestamp: Date.now(),
      url: window.location.href,
      viewport: this.viewport,
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Track ad interactions
  trackAdInteraction(action, gameTitle, adType = "interstitial") {
    this.trackEvent("ad_interaction", {
      action, // 'shown', 'clicked', 'closed', 'timeout'
      gameTitle,
      adType,
      device: this.getDeviceType(),
      duration: action === "closed" ? this.getAdDuration() : null,
    });
  }

  // Track game launches
  trackGameLaunch(gameTitle, source = "direct") {
    this.trackEvent("game_launch", {
      gameTitle,
      source, // 'direct', 'after_ad', 'search', 'filter'
      device: this.getDeviceType(),
    });
  }

  // Track user engagement
  trackEngagement(type, value) {
    this.trackEvent("engagement", {
      type, // 'scroll_depth', 'time_on_page', 'interactions'
      value,
      device: this.getDeviceType(),
    });
  }

  // Setup automatic event tracking
  setupEventTracking() {
    // Track page views
    this.trackEvent("page_view", {
      page: "games",
      referrer: document.referrer,
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener("scroll", () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (scrollDepth % 25 === 0) {
          // Track every 25%
          this.trackEngagement("scroll_depth", scrollDepth);
        }
      }
    });

    // Track time on page
    setInterval(() => {
      const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
      if (timeOnPage % 30 === 0) {
        // Every 30 seconds
        this.trackEngagement("time_on_page", timeOnPage);
      }
    }, 1000);

    // Track clicks
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-track]");
      if (target) {
        this.trackEvent("click", {
          element: target.dataset.track,
          text: target.textContent?.substring(0, 50),
        });
      }
    });

    // Track search usage
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (e.target.value.length > 2) {
            this.trackEvent("search", {
              query: e.target.value,
              resultsCount: document.querySelectorAll(".game-card").length,
            });
          }
        }, 500);
      });
    }

    // Track filter usage
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.trackEvent("filter_use", {
          filter: btn.dataset.filter,
          value: btn.dataset.value,
          active: btn.classList.contains("active"),
        });
      });
    });
  }

  // Setup performance tracking
  setupPerformanceTracking() {
    // Track load performance
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        this.trackEvent("performance", {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded:
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart,
          firstPaint: this.getFirstPaint(),
          connection: navigator.connection?.effectiveType || "unknown",
        });
      }, 0);
    });
  }

  // Setup error tracking
  setupErrorTracking() {
    window.addEventListener("error", (e) => {
      this.trackEvent("javascript_error", {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
      });
    });

    window.addEventListener("unhandledrejection", (e) => {
      this.trackEvent("promise_rejection", {
        reason: e.reason?.toString(),
      });
    });
  }

  // Start session tracking
  startSessionTracking() {
    // Track session start
    this.trackEvent("session_start", {
      userAgent: this.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
    });

    // Track session end on page unload
    window.addEventListener("beforeunload", () => {
      this.trackEvent("session_end", {
        duration: Date.now() - this.startTime,
        eventsCount: this.events.length,
      });
      this.flushEvents();
    });

    // Track visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackEvent("visibility_change", {
        hidden: document.hidden,
      });
    });
  }

  // Get device type
  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
  }

  // Get first paint time
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint"
    );
    return firstPaint ? firstPaint.startTime : null;
  }

  // Get ad duration (to be called from ad manager)
  getAdDuration() {
    return window.gameAdsManager?.getLastAdDuration?.() || null;
  }

  // Send event to analytics service
  sendEvent(event) {
    // Send to Google Analytics if available
    if (typeof gtag !== "undefined") {
      gtag("event", event.eventName, {
        custom_parameter: JSON.stringify(event.properties),
        session_id: event.sessionId,
      });
    }

    // Send to custom analytics endpoint (replace with your endpoint)
    if (navigator.sendBeacon && this.shouldSendToServer()) {
      navigator.sendBeacon("/api/analytics", JSON.stringify(event));
    } else {
      // Store for later sending when online
      this.storeEventForLater(event);
    }
  }

  // Check if we should send to server
  shouldSendToServer() {
    return navigator.onLine && window.location.hostname !== "localhost";
  }

  // Store event for later sending
  storeEventForLater(event) {
    try {
      const stored = JSON.parse(
        localStorage.getItem("pendingAnalytics") || "[]"
      );
      stored.push(event);
      // Keep only last 100 events to prevent storage bloat
      const recent = stored.slice(-100);
      localStorage.setItem("pendingAnalytics", JSON.stringify(recent));
    } catch (error) {
      console.warn("Failed to store analytics event:", error);
    }
  }

  // Flush all pending events
  flushEvents() {
    if (this.events.length > 0 && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/batch",
        JSON.stringify({
          sessionId: this.sessionId,
          events: this.events,
        })
      );
    }
  }

  // A/B Testing functionality
  static createABTest(testName, variants) {
    const userId = localStorage.getItem("userId") || "anonymous_" + Date.now();
    const hash = this.hashCode(userId + testName);
    const variant = variants[Math.abs(hash) % variants.length];

    // Store the variant for consistency
    localStorage.setItem(`ab_test_${testName}`, variant);

    return variant;
  }

  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Get current A/B test variant
  static getABTestVariant(testName) {
    return localStorage.getItem(`ab_test_${testName}`);
  }
}

// Initialize analytics
window.gameAnalytics = new GameAnalytics();

// Setup A/B tests
document.addEventListener("DOMContentLoaded", () => {
  // Test ad timing
  const adTimingVariant = GameAnalytics.createABTest("ad_timing", [
    "fast",
    "normal",
    "slow",
  ]);
  const timingMap = { fast: 2000, normal: 3000, slow: 5000 };

  if (window.gameAdsManager) {
    window.gameAdsManager.config.minDisplayTime = timingMap[adTimingVariant];
  }

  // Test game card layout
  const layoutVariant = GameAnalytics.createABTest("card_layout", [
    "compact",
    "expanded",
  ]);
  if (layoutVariant === "compact") {
    document.body.classList.add("compact-cards");
  }

  // Track A/B test participation
  window.gameAnalytics.trackEvent("ab_test_assigned", {
    ad_timing: adTimingVariant,
    card_layout: layoutVariant,
  });
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameAnalytics;
}
