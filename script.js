// Get the toggle button and body element for dark mode
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Check for saved mode preference
const savedMode = localStorage.getItem("mode");
if (savedMode) {
  body.classList.add(savedMode);
}

// Toggle between dark and light modes
darkModeToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("mode", "light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("mode", "dark-mode");
  }
});

// Tab switching functionality
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanes = document.querySelectorAll(".tab-pane");

tabLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Hide all tab panes
    tabPanes.forEach((pane) => pane.classList.add("hidden"));
    // Remove active state from all tabs
    tabLinks.forEach((link) => link.classList.remove("active"));
    // Show the clicked tab's content
    const target = document.getElementById(link.dataset.target);
    target.classList.remove("hidden");
    // Set clicked tab to active
    link.classList.add("active");
  });
});
