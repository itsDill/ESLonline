// Game Ads JavaScript - Handle ad loading and display for game pages

// Initialize ads when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Check if AdSense is available
  if (typeof adsbygoogle !== "undefined") {
    // Push ads that might not have been loaded
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      if (!ad.hasAttribute("data-adsbygoogle-status")) {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          // Ad failed to load - silent handling
        }
      }
    });
  }
});

// Function to refresh ads (if needed)
function refreshGameAds() {
  if (typeof adsbygoogle !== "undefined") {
    try {
      refreshAds();
    } catch (e) {
      // Ad refresh failed - silent handling
    }
  }
}

// Export for use in other scripts
window.refreshGameAds = refreshGameAds;
