// Credentials validation for ESL Fun Online login system
// This file contains user authentication logic

// Sample credentials database (in a real application, this would be server-side)
const credentialsDatabase = {
  students: {
    // Sample student accounts
    student001: {
      password: "welcome123",
      name: "Demo Student",
      dashboard: "students/dashboard.html",
    },
    demo: {
      password: "demo",
      name: "Demo Student",
      dashboard: "students/dashboard.html",
    },
    test: {
      password: "test",
      name: "Test Student",
      dashboard: "students/dashboard.html",
    },
    // Student accounts
    tem: {
      password: "5555",
      name: "Tem",
      dashboard: "students/temreview.html",
    },
    bam: {
      password: "5555",
      name: "Bam",
      dashboard: "students/bamreview.html",
    },
    corey: {
      password: "5555",
      name: "Corey",
      dashboard: "students/coreyreview.html",
    },
  },
  teachers: {
    // Sample teacher accounts
    teacher001: {
      password: "",
      name: "Demo Teacher",
      dashboard: "teachers/dashboard.html",
    },
    admin: {
      password: "admin",
      name: "Administrator",
      dashboard: "admin.html",
    },
    "demo-teacher": {
      password: "demo",
      name: "Demo Teacher",
      dashboard: "teachers/dashboard.html",
    },
  },
};

/**
 * Validates user credentials against the database
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @param {string} userType - Either 'student' or 'teacher'
 * @returns {Object} - Validation result object
 */
function validateCredentials(username, password, userType) {
  try {
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

    // Get the appropriate credentials database
    const userDatabase = credentialsDatabase[userType + "s"]; // students or teachers

    // Check if username exists
    if (!userDatabase || !userDatabase[username]) {
      return {
        success: false,
        message: `Invalid ${userType} credentials. Please check your username and try again.`,
        userId: null,
        dashboard: null,
      };
    }

    // Check password
    const userRecord = userDatabase[username];
    if (userRecord.password !== password) {
      return {
        success: false,
        message: "Invalid password. Please try again.",
        userId: null,
        dashboard: null,
      };
    }

    // Successful login
    return {
      success: true,
      message: `Welcome back, ${userRecord.name}!`,
      userId: username,
      dashboard: userRecord.dashboard,
      userName: userRecord.name,
      userType: userType,
    };
  } catch (error) {
    console.error("Error validating credentials:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
      userId: null,
      dashboard: null,
    };
  }
}

/**
 * Adds a new user to the credentials database (for development/demo purposes)
 * @param {string} username - Username for the new account
 * @param {string} password - Password for the new account
 * @param {string} userType - Either 'student' or 'teacher'
 * @param {string} name - Display name for the user
 * @param {string} dashboard - Dashboard URL for the user
 * @returns {boolean} - True if user was added successfully
 */
function addUser(username, password, userType, name, dashboard) {
  try {
    userType = userType.toLowerCase();
    username = username.toLowerCase().trim();

    if (!["student", "teacher"].includes(userType)) {
      return false;
    }

    const userDatabase = credentialsDatabase[userType + "s"];

    // Check if user already exists
    if (userDatabase[username]) {
      return false;
    }

    // Add new user
    userDatabase[username] = {
      password: password,
      name: name,
      dashboard: dashboard,
    };

    return true;
  } catch (error) {
    console.error("Error adding user:", error);
    return false;
  }
}

/**
 * Gets user information by username and type
 * @param {string} username - Username to look up
 * @param {string} userType - Either 'student' or 'teacher'
 * @returns {Object|null} - User information or null if not found
 */
function getUserInfo(username, userType) {
  try {
    username = username.toLowerCase().trim();
    userType = userType.toLowerCase();

    const userDatabase = credentialsDatabase[userType + "s"];

    if (!userDatabase || !userDatabase[username]) {
      return null;
    }

    return {
      username: username,
      name: userDatabase[username].name,
      dashboard: userDatabase[username].dashboard,
      userType: userType,
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

/**
 * Changes a user's password
 * @param {string} username - Username
 * @param {string} userType - Either 'student' or 'teacher'
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {boolean} - True if password was changed successfully
 */
function changePassword(username, userType, oldPassword, newPassword) {
  try {
    // First validate current credentials
    const validation = validateCredentials(username, oldPassword, userType);

    if (!validation.success) {
      return false;
    }

    // Update password
    username = username.toLowerCase().trim();
    userType = userType.toLowerCase();
    const userDatabase = credentialsDatabase[userType + "s"];

    userDatabase[username].password = newPassword;
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
}

// Export functions for use in other modules (if using modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateCredentials,
    addUser,
    getUserInfo,
    changePassword,
  };
}

// Development helpers - remove in production
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  // Expose functions to global scope for debugging
  window.devCredentials = {
    validateCredentials,
    addUser,
    getUserInfo,
    changePassword,
    viewDatabase: () => credentialsDatabase,
  };

  console.log("Development mode: Credentials system loaded");
  console.log("Available test accounts:");
  console.log("Students: demo/demo, test/test, student001/welcome123");
  console.log(
    "Teachers: demo-teacher/demo, admin/admin, teacher001/teacher123"
  );
}
