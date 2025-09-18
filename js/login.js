/**
 * Simple Login Functionality - ESL Fun Online
 * Lightweight, conflict-free login system
 */

(function () {
  "use strict";

  // Configuration
  const LOGIN_CONFIG = {
    ANIMATION_DURATION: 300,
    MESSAGE_DISPLAY_TIME: 5000,
  };

  // DOM Elements
  let elements = {};

  // State
  let selectedUserType = "student";
  let isLoading = false;

  /**
   * Initialize the login page
   */
  function initLogin() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupLogin);
    } else {
      setupLogin();
    }
  }

  /**
   * Setup login functionality
   */
  function setupLogin() {
    try {
      // Cache DOM elements
      cacheElements();

      // Initialize default state
      setupInitialState();

      // Bind event listeners
      bindEvents();

      // Apply load animation
      setTimeout(() => {
        document.body.classList.add("loaded");
      }, 100);

      console.log("Login page initialized successfully");
    } catch (error) {
      console.error("Login initialization error:", error);
    }
  }

  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    elements = {
      toggleOptions: document.querySelectorAll(".toggle-option"),
      loginForm: document.getElementById("loginForm"),
      messageContainer: document.getElementById("messageContainer"),
      loginCard: document.getElementById("loginCard"),
      logoIcon: document.getElementById("logoIcon"),
      loginSubtitle: document.getElementById("loginSubtitle"),
      userIdLabel: document.getElementById("userIdLabel"),
      userIdInput: document.getElementById("userId"),
      passwordInput: document.getElementById("password"),
      loginBtn: document.querySelector(".login-btn"),
      loginStatus: document.getElementById("login-status"),
    };

    // Validate required elements
    const requiredElements = [
      "loginForm",
      "userIdInput",
      "passwordInput",
      "loginBtn",
    ];
    for (const elementName of requiredElements) {
      if (!elements[elementName]) {
        throw new Error(`Required element not found: ${elementName}`);
      }
    }
  }

  /**
   * Setup initial state
   */
  function setupInitialState() {
    selectedUserType = "student";
    updateUIForUserType("student");
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // User type toggle
    elements.toggleOptions.forEach((option) => {
      option.addEventListener("click", handleUserTypeToggle);
      option.addEventListener("keydown", handleUserTypeKeydown);
    });

    // Form submission
    elements.loginForm.addEventListener("submit", handleFormSubmit);

    // Input validation
    elements.userIdInput.addEventListener("input", handleInputChange);
    elements.passwordInput.addEventListener("input", handleInputChange);

    // Prevent double submission
    elements.loginForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && isLoading) {
        e.preventDefault();
      }
    });
  }

  /**
   * Handle user type toggle
   */
  function handleUserTypeToggle(e) {
    e.preventDefault();
    if (isLoading) return;

    const clickedType = this.dataset.type;
    if (clickedType === selectedUserType) return;

    // Update toggle states
    elements.toggleOptions.forEach((opt) => {
      opt.classList.remove("active");
      opt.setAttribute("aria-selected", "false");
    });

    this.classList.add("active");
    this.setAttribute("aria-selected", "true");
    selectedUserType = clickedType;

    // Update form's aria-labelledby
    elements.loginForm.setAttribute(
      "aria-labelledby",
      `${selectedUserType}-tab`
    );

    updateUIForUserType(selectedUserType);
  }

  /**
   * Handle keyboard navigation for user type toggle
   */
  function handleUserTypeKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const togglesArray = Array.from(elements.toggleOptions);
      const currentIndex = togglesArray.indexOf(this);
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % togglesArray.length
          : (currentIndex - 1 + togglesArray.length) % togglesArray.length;

      togglesArray[nextIndex].focus();
      togglesArray[nextIndex].click();
    }
  }

  /**
   * Update UI based on user type
   */
  function updateUIForUserType(userType) {
    if (isLoading) return;

    // Update CSS classes
    const elementsToUpdate = [
      elements.loginCard,
      elements.logoIcon,
      elements.userIdInput,
      elements.passwordInput,
      elements.loginBtn,
    ];

    elementsToUpdate.forEach((el) => {
      if (el) {
        el.classList.remove("student-mode", "teacher-mode");
        el.classList.add(`${userType}-mode`);
      }
    });

    // Update text content
    const config = {
      student: {
        label: "Student ID",
        placeholder: "Enter your Student ID",
        subtitle: "Sign in to continue your learning journey",
      },
      teacher: {
        label: "Teacher ID",
        placeholder: "Enter your Teacher ID",
        subtitle: "Sign in to manage your classroom",
      },
    };

    const typeConfig = config[userType];
    if (elements.userIdLabel)
      elements.userIdLabel.textContent = typeConfig.label;
    if (elements.userIdInput)
      elements.userIdInput.placeholder = typeConfig.placeholder;
    if (elements.loginSubtitle)
      elements.loginSubtitle.textContent = typeConfig.subtitle;

    // Clear form
    clearForm();
    clearMessage();
  }

  /**
   * Handle input changes for real-time validation
   */
  function handleInputChange() {
    clearMessage();
    validateInput(this);
  }

  /**
   * Validate individual input
   */
  function validateInput(input) {
    const value = input.value.trim();
    const isUserId = input === elements.userIdInput;
    const minLength = isUserId ? 3 : 4;
    const fieldName = isUserId ? "Username" : "Password";

    let isValid = true;
    if (!value) {
      isValid = false;
    } else if (value.length < minLength) {
      isValid = false;
    }

    // Update visual state
    input.classList.remove("error", "success");
    if (value.length > 0) {
      input.classList.add(isValid ? "success" : "error");
    }

    return {
      isValid,
      message: isValid
        ? ""
        : `${fieldName} must be at least ${minLength} characters`,
    };
  }

  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    if (isLoading) return;

    const userId = elements.userIdInput.value.trim();
    const password = elements.passwordInput.value;

    // Validate inputs
    const userValidation = validateInput(elements.userIdInput);
    const passValidation = validateInput(elements.passwordInput);

    if (!userValidation.isValid) {
      showMessage(userValidation.message, "error");
      elements.userIdInput.focus();
      return;
    }

    if (!passValidation.isValid) {
      showMessage(passValidation.message, "error");
      elements.passwordInput.focus();
      return;
    }

    // Start login process
    performLogin(userId, password, selectedUserType);
  }

  /**
   * Perform login authentication
   */
  function performLogin(userId, password, userType) {
    setLoadingState(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        // Check for admin login
        if (userId === "admin" && password === "admin") {
          handleLoginSuccess("admin", "admin.html");
          return;
        }

        // Use credentials validation if available
        if (typeof validateCredentials === "function") {
          const result = validateCredentials(userId, password, userType);

          if (result.success) {
            const dashboardUrl = result.dashboard || "admin.html";
            handleLoginSuccess(result.userId, dashboardUrl);
          } else {
            handleLoginError(
              result.message || "Invalid credentials. Please try again."
            );
          }
        } else {
          // Fallback validation
          handleLoginError(
            "Authentication system not available. Please try again later."
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        handleLoginError("An unexpected error occurred. Please try again.");
      }
    }, 800);
  }

  /**
   * Handle successful login
   */
  function handleLoginSuccess(userId, dashboardUrl) {
    showMessage("Login successful! Redirecting...", "success");

    // Store user session
    try {
      const userData = {
        id: userId,
        type: selectedUserType,
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substr(2, 9),
      };
      sessionStorage.setItem("userSession", JSON.stringify(userData));
    } catch (storageError) {
      console.warn("Session storage failed:", storageError);
    }

    // Redirect after delay
    setTimeout(() => {
      const url = `${dashboardUrl}?user=${encodeURIComponent(userId)}`;
      window.location.href = url;
    }, 1200);
  }

  /**
   * Handle login error
   */
  function handleLoginError(message) {
    showMessage(message, "error");
    setLoadingState(false);
  }

  /**
   * Set loading state
   */
  function setLoadingState(loading) {
    isLoading = loading;

    if (loading) {
      elements.loginBtn.classList.add("loading");
      elements.loginBtn.innerHTML =
        '<span class="sr-only">Signing in, please wait...</span>';
      elements.loginStatus.textContent = "Signing in, please wait...";

      // Disable form elements
      elements.userIdInput.disabled = true;
      elements.passwordInput.disabled = true;
      elements.toggleOptions.forEach((opt) => {
        opt.style.pointerEvents = "none";
        opt.disabled = true;
      });
    } else {
      elements.loginBtn.classList.remove("loading");
      elements.loginBtn.innerHTML =
        '<i class="fas fa-sign-in-alt" aria-hidden="true"></i><span>Sign In</span>';
      elements.loginStatus.textContent = "";

      // Re-enable form elements
      elements.userIdInput.disabled = false;
      elements.passwordInput.disabled = false;
      elements.toggleOptions.forEach((opt) => {
        opt.style.pointerEvents = "";
        opt.disabled = false;
      });

      // Focus back to form
      setTimeout(() => {
        if (elements.userIdInput.value.trim() === "") {
          elements.userIdInput.focus();
        } else {
          elements.passwordInput.focus();
          elements.passwordInput.select();
        }
      }, 100);
    }
  }

  /**
   * Show message to user
   */
  function showMessage(text, type) {
    if (!elements.messageContainer) return;

    elements.messageContainer.textContent = text;
    elements.messageContainer.className = `message ${type}`;
    elements.messageContainer.style.display = "block";
    elements.messageContainer.style.opacity = "0";

    // Fade in
    setTimeout(() => {
      elements.messageContainer.style.opacity = "1";
    }, 10);

    // Auto-dismiss
    const dismissTime =
      type === "success" ? 3000 : LOGIN_CONFIG.MESSAGE_DISPLAY_TIME;
    setTimeout(() => {
      clearMessage();
    }, dismissTime);
  }

  /**
   * Clear message
   */
  function clearMessage() {
    if (!elements.messageContainer) return;

    if (elements.messageContainer.style.display === "block") {
      elements.messageContainer.style.opacity = "0";
      setTimeout(() => {
        elements.messageContainer.style.display = "none";
        elements.messageContainer.style.opacity = "";
      }, LOGIN_CONFIG.ANIMATION_DURATION);
    }
  }

  /**
   * Clear form
   */
  function clearForm() {
    elements.userIdInput.value = "";
    elements.passwordInput.value = "";
    elements.userIdInput.classList.remove("error", "success");
    elements.passwordInput.classList.remove("error", "success");
  }

  // Initialize when script loads
  initLogin();
})();
