// Demo user database
const users = [
  {
    id: "Tem",
    password: "5555",
    type: "student",
    dashboard: "students/example.html",
  },
  {
    id: "Bam",
    password: "5555",
    type: "student",
    dashboard: "students/student-review.html",
  },
  {
    id: "Dill",
    password: "5555",
    type: "teacher",
    dashboard: "students/tembam.html",
  },
  {
    id: "admin",
    password: "admin",
    type: "admin",
    dashboard: "students/example.html",
  },
];

// Validate credentials and return dashboard info
function validateCredentials(userId, password, userType) {
  const user = users.find(
    (u) => u.id === userId && u.password === password && u.type === userType
  );
  if (user) {
    return { success: true, userId: user.id, dashboard: user.dashboard };
  }
  return { success: false, message: "Invalid credentials. Please try again." };
}
