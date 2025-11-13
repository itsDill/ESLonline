/* ========================================
   UTILITIES AND CACHE BUSTING
   Centralized utility functions for all pages
   ======================================== */

// Dynamic Cache Busting
(function () {
  const timestamp = Date.now();
  const version = Math.floor(timestamp / 1000);

  // Update CSS cache busting
  const cssLinks = document.querySelectorAll(
    'link[rel="stylesheet"][href*="?v="]'
  );
  cssLinks.forEach(function (link) {
    link.href = link.href.replace("?v=", "?v=" + version);
  });

  // Update preload cache busting
  const preloadLinks = document.querySelectorAll(
    'link[rel="preload"][href*="css/"]'
  );
  preloadLinks.forEach(function (link) {
    if (link.href.indexOf("?") === -1) {
      link.href += "?v=" + version;
    }
  });

  // Set dynamic meta tags
  const lastModified = document.querySelector(
    'meta[http-equiv="Last-Modified"]'
  );
  const etag = document.querySelector('meta[http-equiv="ETag"]');
  if (lastModified) lastModified.content = new Date().toUTCString();
  if (etag) etag.content = '"' + version + '"';

  // Force reload on browser back/forward
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

  // Clear browser cache on load
  if ("caches" in window) {
    caches.keys().then(function (names) {
      names.forEach(function (name) {
        if (name.includes("eslfun") || name.includes("static")) {
          caches.delete(name);
        }
      });
    });
  }
})();

// Scroll Progress Indicator
document.addEventListener("DOMContentLoaded", function () {
  // Create scroll progress element if it doesn't exist
  if (!document.querySelector(".scroll-progress")) {
    const scrollProgress = document.createElement("div");
    scrollProgress.className = "scroll-progress";
    document.body.prepend(scrollProgress);
  }

  // Update scroll progress
  window.addEventListener("scroll", function () {
    const scrollProgress = document.querySelector(".scroll-progress");
    if (scrollProgress) {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + "%";
    }
  });
});

// Smooth scroll for anchor links
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "#!") {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
});

// Utility: Debounce function
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

// Utility: Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Utility: Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export utilities if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport,
  };
}
