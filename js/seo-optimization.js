// SEO Optimization JavaScript

// Initialize SEO optimizations when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeSEOOptimizations();
});

function initializeSEOOptimizations() {
  // Lazy loading for images
  initializeLazyLoading();

  // Schema.org structured data
  addStructuredData();

  // Meta tag optimization
  optimizeMetaTags();

  // Performance monitoring
  initializePerformanceMonitoring();

  // Analytics initialization
  initializeAnalytics();

  // Page visibility tracking
  initializeVisibilityTracking();

  // Scroll depth tracking
  initializeScrollTracking();
}

// Lazy loading implementation
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      img.classList.add("loaded");
    });
  }
}

// Add structured data for better SEO
function addStructuredData() {
  const page = document.body.dataset.page;

  if (page === "home") {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ESL Fun Online",
      url: "https://eslfunonline.com",
      description:
        "Interactive English learning platform for ESL students and teachers",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://eslfunonline.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ESL Fun Online",
      url: "https://eslfunonline.com",
      logo: "https://eslfunonline.com/images/logo.png",
      description:
        "Your premier destination for English as a Second Language learning resources, games, and interactive tools.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-ESL-LEARN",
        contactType: "customer service",
      },
    };

    addJSONLD(websiteSchema);
    addJSONLD(organizationSchema);
  }

  // Add breadcrumb schema
  addBreadcrumbSchema();
}

function addJSONLD(schema) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function addBreadcrumbSchema() {
  const breadcrumbs = document.querySelector(".breadcrumb");
  if (!breadcrumbs) return;

  const items = Array.from(
    breadcrumbs.querySelectorAll(".breadcrumb-item")
  ).map((item, index) => {
    const link = item.querySelector("a");
    return {
      "@type": "ListItem",
      position: index + 1,
      name: item.textContent.trim(),
      item: link ? link.href : window.location.href,
    };
  });

  if (items.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };

    addJSONLD(breadcrumbSchema);
  }
}

// Optimize meta tags dynamically
function optimizeMetaTags() {
  // Add viewport meta if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(viewport);
  }

  // Add charset if missing
  if (!document.querySelector("meta[charset]")) {
    const charset = document.createElement("meta");
    charset.setAttribute("charset", "UTF-8");
    document.head.insertBefore(charset, document.head.firstChild);
  }

  // Add preconnect hints for external resources
  addPreconnectHints();

  // Optimize Open Graph tags
  optimizeOpenGraphTags();
}

function addPreconnectHints() {
  const preconnects = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com",
    "https://pagead2.googlesyndication.com",
  ];

  preconnects.forEach((url) => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      if (url.includes("gstatic")) {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
    }
  });
}

function optimizeOpenGraphTags() {
  // Ensure required OG tags exist
  const requiredOGTags = {
    "og:title": document.title,
    "og:description":
      document.querySelector('meta[name="description"]')?.content ||
      "ESL Fun Online - Interactive English Learning",
    "og:url": window.location.href,
    "og:type": "website",
    "og:site_name": "ESL Fun Online",
  };

  Object.entries(requiredOGTags).forEach(([property, content]) => {
    if (!document.querySelector(`meta[property="${property}"]`) && content) {
      const meta = document.createElement("meta");
      meta.setAttribute("property", property);
      meta.content = content;
      document.head.appendChild(meta);
    }
  });
}

// Performance monitoring
function initializePerformanceMonitoring() {
  // Core Web Vitals
  if ("web-vital" in window) {
    measureCoreWebVitals();
  }

  // Page load time
  window.addEventListener("load", () => {
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;

    // Send to analytics if available
    if (typeof gtag !== "undefined") {
      gtag("event", "page_load_time", {
        event_category: "Performance",
        value: Math.round(loadTime),
      });
    }
  });

  // Resource timing
  monitorResourceTiming();
}

function measureCoreWebVitals() {
  // Measure FCP (First Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        console.log("FCP:", entry.startTime);
        if (typeof gtag !== "undefined") {
          gtag("event", "first_contentful_paint", {
            event_category: "Web Vitals",
            value: Math.round(entry.startTime),
          });
        }
      }
    }
  });
  observer.observe({ entryTypes: ["paint"] });

  // Measure LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
    if (typeof gtag !== "undefined") {
      gtag("event", "largest_contentful_paint", {
        event_category: "Web Vitals",
        value: Math.round(lastEntry.startTime),
      });
    }
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
}

function monitorResourceTiming() {
  window.addEventListener("load", () => {
    const resources = performance.getEntriesByType("resource");

    // Identify slow-loading resources
    const slowResources = resources.filter(
      (resource) => resource.duration > 1000
    );

    if (slowResources.length > 0) {
      console.warn("Slow loading resources:", slowResources);
    }
  });
}

// Analytics initialization
function initializeAnalytics() {
  // Track custom events
  trackCustomEvents();

  // Track user engagement
  trackUserEngagement();
}

function trackCustomEvents() {
  // Track external link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && link.hostname !== window.location.hostname) {
      if (typeof gtag !== "undefined") {
        gtag("event", "click", {
          event_category: "External Links",
          event_label: link.href,
        });
      }
    }
  });

  // Track form submissions
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.tagName === "FORM") {
      if (typeof gtag !== "undefined") {
        gtag("event", "form_submit", {
          event_category: "Forms",
          event_label: form.name || form.id || "unnamed_form",
        });
      }
    }
  });
}

function trackUserEngagement() {
  let startTime = Date.now();

  // Track time on page
  window.addEventListener("beforeunload", () => {
    const timeOnPage = Date.now() - startTime;
    if (typeof gtag !== "undefined") {
      gtag("event", "timing_complete", {
        name: "time_on_page",
        value: Math.round(timeOnPage / 1000),
      });
    }
  });
}

// Page visibility tracking
function initializeVisibilityTracking() {
  let visibilityStart = Date.now();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Page became hidden
      const visibleTime = Date.now() - visibilityStart;
      if (typeof gtag !== "undefined") {
        gtag("event", "page_visible_time", {
          event_category: "Engagement",
          value: Math.round(visibleTime / 1000),
        });
      }
    } else {
      // Page became visible
      visibilityStart = Date.now();
    }
  });
}

// Scroll depth tracking
function initializeScrollTracking() {
  const scrollThresholds = [25, 50, 75, 100];
  const triggeredThresholds = new Set();

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      scrollThresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
          triggeredThresholds.add(threshold);
          if (typeof gtag !== "undefined") {
            gtag("event", "scroll", {
              event_category: "Engagement",
              event_label: `${threshold}%`,
              value: threshold,
            });
          }
        }
      });
    }, 250)
  );
}

// Utility functions
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export for use in other modules
window.ESLSEOOptimizations = {
  initializeLazyLoading,
  addStructuredData,
  optimizeMetaTags,
  initializePerformanceMonitoring,
  initializeAnalytics,
};
