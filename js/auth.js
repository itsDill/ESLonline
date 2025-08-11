// credentials.js - Simple credential storage (For demo purposes only - NOT for production!)
// In a real application, use secure server-side authentication with encrypted passwords

const loginCredentials = {
  students: {
    // Student ID: Password
    STU001: "student123",
    STU002: "mypassword",
    STU003: "learn2024",
    STU100: "password",
    STU200: "student456",
  },

  teachers: {
    // Teacher ID: Password
    TCH001: "teacher123",
    TCH002: "educate2024",
    TCH003: "myteachpass",
    TCH100: "teaching456",
    TCH200: "classroom",
  },
};

// Function to validate login credentials
function validateCredentials(userId, password, userType) {
  const credentials =
    userType === "student"
      ? loginCredentials.students
      : loginCredentials.teachers;

  if (credentials[userId] && credentials[userId] === password) {
    return {
      success: true,
      userId: userId,
      userType: userType,
    };
  }

  return {
    success: false,
    message: `Invalid ${userType} credentials`,
  };
}

// Export for use in other files (if using modules)
// export { loginCredentials, validateCredentials };
