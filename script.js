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

let nameClicks = 0;
document.getElementById("nameHeader").addEventListener("click", function () {
  nameClicks++;
  if (nameClicks === 3) {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Rickroll URL
  }
});
