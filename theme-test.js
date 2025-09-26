// Theme Toggle Test Script
// Run this in the browser console to test theme functionality

console.log("=== THEME TOGGLE DIAGNOSTIC ===");

// Check if theme toggle button exists
const themeToggle = document.getElementById("themeToggle");
console.log("Theme toggle button found:", !!themeToggle);

if (themeToggle) {
  console.log("Theme toggle element:", themeToggle);
  console.log("Current icon class:", themeToggle.querySelector("i")?.className);
}

// Check current theme state
const isDarkMode = document.body.classList.contains("dark-mode");
console.log("Current dark mode state:", isDarkMode);
console.log("Body classes:", document.body.className);
console.log("HTML classes:", document.documentElement.className);

// Check localStorage
const savedTheme = localStorage.getItem("theme");
console.log("Saved theme in localStorage:", savedTheme);

// Check CSS variables
const computedStyle = getComputedStyle(document.body);
console.log("Computed background color:", computedStyle.backgroundColor);
console.log("Computed text color:", computedStyle.color);

// Check if CSS custom properties are working
const bgPrimary = computedStyle.getPropertyValue("--bg-primary");
const textPrimary = computedStyle.getPropertyValue("--text-primary");
console.log("CSS --bg-primary variable:", bgPrimary);
console.log("CSS --text-primary variable:", textPrimary);

// Test theme toggle function
console.log("=== TESTING THEME TOGGLE ===");
if (themeToggle) {
  // Simulate click
  console.log("Simulating theme toggle click...");
  themeToggle.click();

  setTimeout(() => {
    const newDarkMode = document.body.classList.contains("dark-mode");
    console.log("After toggle - dark mode state:", newDarkMode);
    console.log("After toggle - body classes:", document.body.className);

    const newComputedStyle = getComputedStyle(document.body);
    console.log(
      "After toggle - background color:",
      newComputedStyle.backgroundColor
    );
    console.log("After toggle - text color:", newComputedStyle.color);

    // Toggle back
    themeToggle.click();
  }, 500);
} else {
  console.log("Cannot test toggle - button not found");
}

console.log("=== END DIAGNOSTIC ===");
