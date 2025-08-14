// Demo user database
const users = [
  {
    id: "student1",
    password: "pass1",
    type: "student",
    dashboard: "student-dashboard.html",
  },
  {
    id: "student2",
    password: "pass2",
    type: "student",
    dashboard: "student2-dashboard.html",
  },
  {
    id: "teacher1",
    password: "teachpass",
    type: "teacher",
    dashboard: "teacher-dashboard.html",
  },
  {
    id: "admin",
    password: "admin",
    type: "admin",
    dashboard: "admin.html",
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
