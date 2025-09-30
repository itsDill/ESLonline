// Game Ads JavaScript - Handle ad loading and display for game pages

// Initialize ads when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Game ads script loaded");

  // Check if AdSense is available
  if (typeof adsbygoogle !== "undefined") {
    // Push ads that might not have been loaded
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      if (!ad.hasAttribute("data-adsbygoogle-status")) {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Error loading ad:", e);
        }
      }
    });
  }
});

// Function to refresh ads (if needed)
function refreshGameAds() {
  if (typeof adsbygoogle !== "undefined") {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Error refreshing ads:", e);
    }
  }
}

// Export for use in other scripts
window.refreshGameAds = refreshGameAds;
