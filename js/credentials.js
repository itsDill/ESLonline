// Demo user database
const users = [
  {
    id: "Tem",
    password: "555",
    type: "student",
    dashboard: "temdashboard.html",
  },
  {
    id: "Bam",
    password: "555",
    type: "student",
    dashboard: "tamdashboard.html",
  },
  {
    id: "Dill",
    password: "555",
    type: "teacher",
    dashboard: "students/tembam.html",
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
