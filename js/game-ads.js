"use strict";
// Game Ads JavaScript - Handle ad loading and display for game pages

function initializePendingGameAds() {
  if (typeof adsbygoogle === "undefined") {
    return;
  }

  const ads = document.querySelectorAll(".adsbygoogle");
  ads.forEach((ad) => {
    if (
      ad.hasAttribute("data-adsbygoogle-status") ||
      ad.hasAttribute("data-game-ad-initialized")
    ) {
      return;
    }

    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
      ad.setAttribute("data-game-ad-initialized", "true");
    } catch (e) {
      // Ad failed to load - silent handling
    }
  });
}

// Initialize ads when page loads
document.addEventListener("DOMContentLoaded", function () {
  initializePendingGameAds();
});

// Backward-compatible hook: initialize pending ad units once.
function refreshGameAds() {
  initializePendingGameAds();
}

// Export for use in other scripts
window.refreshGameAds = refreshGameAds;
