/**
 * Game Ads Integration System
 * Handles Google Ad display before game start with UX optimization
 * Author: ESL Fun Online
 * Version: 1.0.0
 */

class GameAdsManager {
  constructor() {
    this.config = {
      // Your actual Google AdSense publisher ID
      publisherId: "ca-pub-2456627863532019",

      // Ad unit IDs for different screen sizes (you'll need to get these from Google AdSense)
      adUnits: {
        mobile: "ca-pub-2456627863532019/1234567890", // Replace with mobile ad unit
        tablet: "ca-pub-2456627863532019/2345678901", // Replace with tablet ad unit
        desktop: "ca-pub-2456627863532019/3456789012", // Replace with desktop ad unit
      },

      showDelay: 500, // Reduced delay for better UX
      minDisplayTime: 3000, // Minimum time ad should be visible
      maxDisplayTime: 25000, // Maximum time before auto-close
      enabledDevices: ["mobile", "tablet", "desktop"],
      enabledGames: "all", // 'all' or array of game names
      frequency: "session", // Changed to session for better UX
    };

    this.state = {
      adLoaded: false,
      adDisplayed: false,
      gameToLoad: null,
      startTime: null,
      isClosing: false,
    };

    this.modalElement = null;
    this.currentGame = null;
    this.adContainer = null;

    this.init();
  }

  init() {
    this.createAdModal();
    this.bindEvents();
    this.loadGoogleAds();
    console.log("🎮 Game Ads Manager initialized");
  }

  // Load Google AdSense script if not already loaded
  loadGoogleAds() {
    if (window.adsbygoogle) {
      this.initializeAds();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.publisherId}`;
    script.crossOrigin = "anonymous";
    script.onload = () => this.initializeAds();
    script.onerror = () => {
      console.warn("⚠️ Google Ads failed to load, using fallback");
      this.createFallbackAd();
    };
    document.head.appendChild(script);
  }

  initializeAds() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      this.state.adLoaded = true;
      console.log("✅ Google Ads initialized");
    } catch (error) {
      console.warn("⚠️ Ad initialization failed:", error);
      this.createFallbackAd();
    }
  }

  // Create the responsive ad modal
  createAdModal() {
    this.modalElement = document.createElement("div");
    this.modalElement.className = "game-ad-modal";
    this.modalElement.innerHTML = `
      <div class="game-ad-overlay"></div>
      <div class="game-ad-container">
        <div class="game-ad-header">
          <div class="game-ad-title">
            <i class="fas fa-gamepad"></i>
            <span>Starting Game...</span>
          </div>
          <div class="game-ad-timer">
            <i class="fas fa-clock"></i>
            <span class="timer-text">Please wait <span class="countdown">5</span>s</span>
          </div>
        </div>
        
        <div class="game-ad-content">
          <div class="ad-placeholder" id="game-ad-slot">
            <div class="ad-loading">
              <div class="loading-spinner"></div>
              <p>Loading advertisement...</p>
            </div>
          </div>
        </div>
        
        <div class="game-ad-footer">
          <button 
            class="game-ad-close" 
            id="gameAdClose" 
            disabled
            aria-label="Close ad and continue to game"
          >
            <i class="fas fa-times"></i>
            <span class="close-text">Close & Continue</span>
          </button>
          
          <div class="game-ad-info">
            <p class="ad-disclaimer">
              <i class="fas fa-info-circle"></i>
              Ads help keep our games free
            </p>
          </div>
        </div>
        
        <div class="game-progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalElement);
    this.adContainer = this.modalElement.querySelector("#game-ad-slot");
  }

  // Create fallback ad when Google Ads fail
  createFallbackAd() {
    const deviceType = this.getDeviceType();
    const gameTitle = this.currentGame?.title || "the game";

    const fallbackAd = `
      <div class="fallback-ad">
        <div class="fallback-content">
          <i class="fas fa-rocket fallback-icon"></i>
          <h3>🎯 Ready to play ${gameTitle}?</h3>
          <p>While you're here, discover more ways to improve your English!</p>
          <div class="fallback-links">
            <a href="../english/grammar.html" class="fallback-btn" target="_blank">
              <i class="fas fa-spell-check"></i> Grammar Mastery
            </a>
            <a href="../english/vocabguide.html" class="fallback-btn" target="_blank">
              <i class="fas fa-book-open"></i> Vocabulary Builder
            </a>
            ${
              deviceType !== "mobile"
                ? `
            <a href="../blog/blog.html" class="fallback-btn" target="_blank">
              <i class="fas fa-lightbulb"></i> Learning Tips
            </a>`
                : ""
            }
          </div>
          <div class="fallback-stats">
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <span>50K+ Learners</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-star"></i>
              <span>4.8★ Rating</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (this.adContainer) {
      this.adContainer.innerHTML = fallbackAd;
    }
  }

  // Bind event handlers
  bindEvents() {
    // Close button click
    document.addEventListener("click", (e) => {
      if (e.target.closest("#gameAdClose")) {
        this.closeAdAndContinue();
      }

      // Prevent closing by clicking overlay during minimum display time
      if (e.target.classList.contains("game-ad-overlay")) {
        if (this.canClose()) {
          this.closeAdAndContinue();
        } else {
          this.showCloseHint();
        }
      }
    });

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (this.state.adDisplayed) {
        if (e.key === "Escape" && this.canClose()) {
          this.closeAdAndContinue();
        }
        // Prevent navigation during ad display
        if (["Tab", "F5", "F12"].includes(e.key)) {
          e.preventDefault();
        }
      }
    });

    // Page visibility change
    document.addEventListener("visibilitychange", () => {
      if (this.state.adDisplayed && document.hidden) {
        this.pauseTimer();
      } else if (this.state.adDisplayed && !document.hidden) {
        this.resumeTimer();
      }
    });

    // Handle back button
    window.addEventListener("popstate", (e) => {
      if (this.state.adDisplayed) {
        e.preventDefault();
        if (this.canClose()) {
          this.closeAdAndContinue();
        }
        history.pushState(null, null, window.location.href);
      }
    });
  }

  // Show ad before game starts
  showAdBeforeGame(gameUrl, gameTitle = "Game") {
    if (!this.shouldShowAd()) {
      this.loadGame(gameUrl);
      return;
    }

    this.currentGame = { url: gameUrl, title: gameTitle };
    this.state.gameToLoad = gameUrl;
    this.state.startTime = Date.now();
    this.state.adDisplayed = true;
    this.state.isClosing = false;

    // Update modal content
    this.updateModalForGame(gameTitle);

    // Show modal with animation
    this.modalElement.classList.add("show");
    document.body.style.overflow = "hidden";

    // Add to browser history to handle back button
    history.pushState({ adModal: true }, "", window.location.href);

    // Load the actual ad
    this.loadAd();

    // Start timer and progress bar
    this.startTimer();

    // Auto-close after maximum time
    setTimeout(() => {
      if (this.state.adDisplayed && !this.state.isClosing) {
        this.closeAdAndContinue();
      }
    }, this.config.maxDisplayTime);

    // Track ad display
    this.trackAdDisplay(gameTitle);

    console.log(`🎯 Showing ad for: ${gameTitle}`);
  }

  // Check if ad should be shown based on configuration
  shouldShowAd() {
    // Check device compatibility
    const device = this.getDeviceType();
    if (!this.config.enabledDevices.includes(device)) {
      return false;
    }

    // Check frequency settings
    if (this.config.frequency === "session") {
      const sessionShown = sessionStorage.getItem("gameAdShown");
      if (sessionShown) return false;
    } else if (this.config.frequency === "daily") {
      const lastShown = localStorage.getItem("gameAdLastShown");
      const today = new Date().toDateString();
      if (lastShown === today) return false;
    }

    return true;
  }

  // Update modal for specific game
  updateModalForGame(gameTitle) {
    const titleElement = this.modalElement.querySelector(".game-ad-title span");
    titleElement.textContent = `Starting ${gameTitle}...`;

    // Add game-specific styling
    this.modalElement.className = "game-ad-modal show";
  }

  // Load actual ad or fallback
  loadAd() {
    if (this.state.adLoaded && window.adsbygoogle) {
      this.loadGoogleAd();
    } else {
      this.createFallbackAd();
    }
  }

  // Load Google Ad
  loadGoogleAd() {
    // Clear loading state
    this.adContainer.innerHTML = "";

    // Get the appropriate ad unit based on device type
    const deviceType = this.getDeviceType();
    const adUnitId = this.getAdUnitForDevice(deviceType);

    // Create the ad element
    const adElement = document.createElement("ins");
    adElement.className = "adsbygoogle";
    adElement.style.display = "block";
    adElement.style.width = "100%";
    adElement.style.minHeight = this.getMinHeightForDevice(deviceType);

    // Set ad attributes
    adElement.setAttribute("data-ad-client", this.config.publisherId);
    adElement.setAttribute("data-ad-slot", this.extractSlotId(adUnitId));
    adElement.setAttribute("data-ad-format", "auto");
    adElement.setAttribute("data-full-width-responsive", "true");

    // For better mobile experience, set specific format
    if (deviceType === "mobile") {
      adElement.setAttribute("data-ad-format", "rectangle");
    }

    this.adContainer.appendChild(adElement);

    try {
      // Push to adsbygoogle array to load the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log(`✅ Google Ad loaded for ${deviceType}`);

      // Set up error handling for ad load failures
      setTimeout(() => {
        if (
          !this.adContainer.querySelector(
            '.adsbygoogle[data-ad-status="filled"]'
          )
        ) {
          console.warn("Ad may not have loaded properly, showing fallback");
          this.createFallbackAd();
        }
      }, 5000);
    } catch (error) {
      console.warn("Ad loading failed:", error);
      this.createFallbackAd();
    }
  }

  // Start countdown timer
  startTimer() {
    let timeLeft = Math.ceil(this.config.minDisplayTime / 1000);
    const countdownElement = this.modalElement.querySelector(".countdown");
    const closeButton = this.modalElement.querySelector("#gameAdClose");
    const progressBar = this.modalElement.querySelector(".progress-fill");

    const timer = setInterval(() => {
      if (!this.state.adDisplayed) {
        clearInterval(timer);
        return;
      }

      timeLeft--;
      countdownElement.textContent = timeLeft;

      // Update progress bar
      const progress =
        ((this.config.minDisplayTime / 1000 - timeLeft) /
          (this.config.minDisplayTime / 1000)) *
        100;
      progressBar.style.width = `${progress}%`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        this.enableCloseButton();
      }
    }, 1000);

    this.currentTimer = timer;
  }

  // Enable close button after minimum time
  enableCloseButton() {
    const closeButton = this.modalElement.querySelector("#gameAdClose");
    const timerText = this.modalElement.querySelector(".timer-text");

    closeButton.disabled = false;
    closeButton.classList.add("enabled");
    timerText.innerHTML = '<i class="fas fa-check"></i> You can now continue!';

    // Add pulse animation to draw attention
    closeButton.classList.add("pulse");

    // Play a subtle sound notification if supported
    this.playNotificationSound();
  }

  // Check if ad can be closed
  canClose() {
    if (!this.state.startTime) return false;
    const elapsed = Date.now() - this.state.startTime;
    return elapsed >= this.config.minDisplayTime;
  }

  // Show hint when user tries to close too early
  showCloseHint() {
    const hint = document.createElement("div");
    hint.className = "close-hint";
    hint.innerHTML = `
      <i class="fas fa-info-circle"></i>
      Please wait a moment before continuing...
    `;

    this.modalElement.appendChild(hint);

    setTimeout(() => {
      hint.remove();
    }, 2000);
  }

  // Close ad and continue to game
  closeAdAndContinue() {
    if (this.state.isClosing) return;

    this.state.isClosing = true;

    // Clear timer
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }

    // Record ad completion
    this.recordAdCompletion();

    // Hide modal with animation
    this.modalElement.classList.add("closing");

    setTimeout(() => {
      this.modalElement.classList.remove("show", "closing");
      document.body.style.overflow = "";
      this.state.adDisplayed = false;
      this.state.isClosing = false;

      // Navigate to game
      if (this.state.gameToLoad) {
        this.loadGame(this.state.gameToLoad);
      }

      // Remove from history
      if (history.state && history.state.adModal) {
        history.back();
      }
    }, 300);
  }

  // Load the game
  loadGame(gameUrl) {
    // Add loading state
    document.body.style.cursor = "wait";

    // Smooth transition
    setTimeout(() => {
      window.location.href = gameUrl;
    }, 200);
  }

  // Record ad completion for frequency control
  recordAdCompletion() {
    if (this.config.frequency === "session") {
      sessionStorage.setItem("gameAdShown", "true");
    } else if (this.config.frequency === "daily") {
      localStorage.setItem("gameAdLastShown", new Date().toDateString());
    }
  }

  // Track ad display for analytics
  trackAdDisplay(gameTitle) {
    try {
      // Google Analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "ad_impression", {
          event_category: "games",
          event_label: gameTitle,
          custom_map: {
            dimension1: this.getDeviceType(),
          },
        });
      }

      // Custom tracking
      const trackingData = {
        event: "game_ad_shown",
        game: gameTitle,
        device: this.getDeviceType(),
        timestamp: new Date().toISOString(),
      };

      // Send to your analytics endpoint
      // fetch('/api/track', { method: 'POST', body: JSON.stringify(trackingData) });
    } catch (error) {
      console.warn("Analytics tracking failed:", error);
    }
  }

  // Get device type for responsive handling
  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
  }

  // Get the appropriate ad unit for the device type
  getAdUnitForDevice(deviceType) {
    return this.config.adUnits[deviceType] || this.config.adUnits.desktop;
  }

  // Extract slot ID from ad unit (last part after the slash)
  extractSlotId(adUnit) {
    return adUnit.split("/").pop();
  }

  // Get minimum height for ad based on device
  getMinHeightForDevice(deviceType) {
    const heights = {
      mobile: "250px",
      tablet: "280px",
      desktop: "320px",
    };
    return heights[deviceType] || heights.desktop;
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Create a subtle notification sound
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }

  // Pause timer when page is hidden
  pauseTimer() {
    // Implementation for pausing timer during page visibility changes
  }

  // Resume timer when page is visible
  resumeTimer() {
    // Implementation for resuming timer during page visibility changes
  }

  // Public method to show ad for specific game
  static showAdForGame(gameUrl, gameTitle) {
    if (!window.gameAdsManager) {
      window.gameAdsManager = new GameAdsManager();
    }
    window.gameAdsManager.showAdBeforeGame(gameUrl, gameTitle);
  }

  // Public method to configure the ad manager
  static configure(options) {
    if (!window.gameAdsManager) {
      window.gameAdsManager = new GameAdsManager();
    }
    Object.assign(window.gameAdsManager.config, options);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.gameAdsManager = new GameAdsManager();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameAdsManager;
}
