/**
 * Mobile Menu Initialization - Inline Script Extracted
 * Optimized with passive listeners for better INP performance
 */
(function () {
  "use strict";
  var isMenuOpen = false,
    lastToggle = 0;

  function initMobileMenu() {
    var mobileToggle = document.getElementById("mobileToggle");
    var navLinks = document.getElementById("navLinks");
    if (!mobileToggle || !navLinks) return;

    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      var icon = mobileToggle.querySelector("i");
      if (isMenuOpen) {
        navLinks.classList.add("active");
        document.body.classList.add("mobile-menu-open");
        document.body.style.overflow = "hidden";
        if (icon) icon.className = "fas fa-times";
      } else {
        navLinks.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
        document.body.style.overflow = "";
        if (icon) icon.className = "fas fa-bars";
        // Use requestAnimationFrame for DOM updates (better INP)
        requestAnimationFrame(function () {
          document
            .querySelectorAll(".nav-item.mobile-open")
            .forEach(function (item) {
              item.classList.remove("mobile-open", "mobile-dropdown-open");
            });
        });
      }
    }

    // Single touch handler only (prevents double-firing, better INP)
    mobileToggle.addEventListener(
      "click",
      function (e) {
        var now = Date.now();
        if (now - lastToggle < 250) return;
        lastToggle = now;
        e.preventDefault();
        toggleMenu();
      },
      { passive: false },
    );

    // Passive touch listeners for better scrolling performance
    navLinks.addEventListener("touchstart", function () {}, {
      passive: true,
    });

    // Dropdown handling - event delegation (single listener, better INP)
    navLinks.addEventListener(
      "click",
      function (e) {
        if (window.innerWidth > 768) return;
        var link = e.target.closest(".nav-link");
        if (!link || e.target.closest(".dropdown-item")) return;
        var item = link.closest(".nav-item");
        var dropdown = item && item.querySelector(".dropdown");
        if (!dropdown) return;

        e.preventDefault();
        var isOpen = item.classList.contains("mobile-open");
        // Close others first
        document
          .querySelectorAll(".nav-item.mobile-open")
          .forEach(function (other) {
            if (other !== item)
              other.classList.remove("mobile-open", "mobile-dropdown-open");
          });
        item.classList.toggle("mobile-open", !isOpen);
        item.classList.toggle("mobile-dropdown-open", !isOpen);
      },
      { passive: false },
    );

    // Close menu on outside click - use capture for efficiency
    document.addEventListener(
      "click",
      function (e) {
        if (
          window.innerWidth <= 768 &&
          isMenuOpen &&
          !mobileToggle.contains(e.target) &&
          !navLinks.contains(e.target)
        ) {
          toggleMenu();
        }
      },
      { passive: true, capture: true },
    );

    // Resize handler with debounce for better performance
    var resizeTimer;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (window.innerWidth > 768 && isMenuOpen) toggleMenu();
        }, 100);
      },
      { passive: true },
    );
  }

  // Initialize immediately
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
