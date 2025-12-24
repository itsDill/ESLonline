// Credentials validation for ESL Fun Online login system
// NOTE: In production, authentication should be handled server-side
// This is a client-side demo placeholder

/**
 * Validates user credentials
 * In a real application, this would make an API call to a secure backend
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @param {string} userType - Either 'student' or 'teacher'
 * @returns {Object} - Validation result object
 */
function validateCredentials(username, password, userType) {
  // Input validation
  if (!username || !password || !userType) {
    return {
      success: false,
      message: "Please fill in all required fields.",
      userId: null,
      dashboard: null,
    };
  }

  // Normalize inputs
  username = username.toLowerCase().trim();
  userType = userType.toLowerCase();

  // Check if user type is valid
  if (!["student", "teacher"].includes(userType)) {
    return {
      success: false,
      message: "Invalid user type selected.",
      userId: null,
      dashboard: null,
    };
  }

  // Accept specific demo student credentials for local testing
  // Passwords are set to the username (or a known test password) for simplicity.
  const studentCredentials = {
    bamreview: {
      password: "bamreview",
      name: "Bam Review",
      dashboard: "students/bamreview.html",
    },
    temreview: {
      password: "temreview",
      name: "Tem Review",
      dashboard: "students/temreview.html",
    },
    // Allow the short username `tem` to sign in using the `temreview` password
    tem: {
      password: "temreview",
      name: "Tem Review",
      dashboard: "students/temreview.html",
    },
  };

  if (
    userType === "student" &&
    Object.prototype.hasOwnProperty.call(studentCredentials, username) &&
    password === studentCredentials[username].password
  ) {
    const u = studentCredentials[username];
    return {
      success: true,
      message: `Welcome ${u.name}!`,
      userId: username,
      dashboard: u.dashboard,
      userName: u.name,
      userType: userType,
    };
  }

  // For all other credentials, return a helpful message
  return {
    success: false,
    message: "Invalid credentials.",
    userId: null,
    dashboard: null,
  };
}

/**
 * Gets user information by username and type
 * @param {string} username - Username to look up
 * @param {string} userType - Either 'student' or 'teacher'
 * @returns {Object|null} - User information or null if not found
 */
function getUserInfo(username, userType) {
  // Support the test student accounts
  username = username && username.toLowerCase && username.toLowerCase();
  if (username === "bamreview") {
    return {
      username: "bamreview",
      name: "Bam Review",
      dashboard: "students/bamreview.html",
      userType: userType,
    };
  }
  if (username === "temreview" || username === "tem") {
    return {
      username: username === "tem" ? "tem" : "temreview",
      name: "Tem Review",
      dashboard: "students/temreview.html",
      userType: userType,
    };
  }
  return null;
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validateCredentials, getUserInfo };
}
