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

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark');
    } else {
        body.classList.add('light'); // Default to light if no preference
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        body.classList.toggle('light');

        // Save preference
        if (body.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.removeItem('darkMode');
        }
    });

    // Fade-in effect for sections on scroll (if needed, or keep timed)
    // const sections = document.querySelectorAll('.fade-in');
    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.style.animationPlayState = 'running';
    //             observer.unobserve(entry.target);
    //         }
    //     });
    // }, { threshold: 0.1 });

    // sections.forEach(section => {
    //     section.style.animationPlayState = 'paused'; // Start paused
    //     observer.observe(section);
    // });

    // --- Terminal Modal Logic --- //
    const terminalModal = document.getElementById('terminal-modal');
    const terminalToggleButton = document.getElementById('terminal-toggle-button');
    const terminalCloseButton = document.getElementById('terminal-close-button');
    const terminalInput = document.getElementById('terminal-input'); // Need this for focus

    if (terminalModal && terminalToggleButton && terminalCloseButton) {
        terminalToggleButton.addEventListener('click', () => {
            terminalModal.classList.add('show');
            terminalModal.classList.remove('hidden'); // Ensure Tailwind hidden is removed
            // Focus the input when the modal opens
            // Use setTimeout to ensure the element is visible and focusable
            setTimeout(() => terminalInput?.focus(), 50); 
        });

        terminalCloseButton.addEventListener('click', () => {
            terminalModal.classList.remove('show');
            terminalModal.classList.add('hidden'); // Re-apply Tailwind hidden if needed
        });

        // Optional: Close modal if clicking outside the terminal content
        terminalModal.addEventListener('click', (event) => {
            // Check if the click is directly on the modal background
            if (event.target === terminalModal) {
                terminalModal.classList.remove('show');
                terminalModal.classList.add('hidden');
            }
        });
    }

    // --- Splash Text Logic --- //
    const splashTextElement = document.getElementById('splash-text');
    const splashMessages = [
        "Try the terminal!",
        "New Feature: Terminal!",
        "Click the button! ->",
        "Hack the planet! (with the terminal)",
        "What does this button do?",
        "Secret commands inside?",
        "Interactive Terminal >>",
        "HELLO, WORLD!",
        "user@pena-site:~$ _"
    ];

    if (splashTextElement && terminalToggleButton) { // Only show if button exists
        const randomMessage = splashMessages[Math.floor(Math.random() * splashMessages.length)];
        splashTextElement.textContent = randomMessage + " >>"; // Add arrow indicator
        splashTextElement.classList.add('show'); // Make it visible

        // Optional: Hide splash text after a delay or on button click
        // Commenting this out because it looks so dope LOL I LOVE THIS THING!!!! Undeniably my favorite part
        // this website lol
        //
        // If you're reading this, the floating splash text is a homage to Minecraft. I grew up playing it since
        // I was around 12 years old, and I still play it today. I love the art style and the community. One of my 
        // favorite memories is playing with my friends in the old days. Never grow up!!!
        //
          // setTimeout(() => {
          //     splashTextElement.classList.remove('show');
          //     setTimeout(() => splashTextElement.style.display = 'none', 500); // Allow fade out animation
          // }, 5000); // Hide after 5 seconds

          // Man this thing is so cool I removed this part too.... starting to think I've got a lot of commented
          // out code. I'm starting to like it. Anti-pattern? Maybe. But I like it. It's my personal style. Trust I dont
          // write code like this for work. This is just for fun.
          //
        // terminalToggleButton.addEventListener('click', () => {
        //      splashTextElement.classList.remove('show');
        //      setTimeout(() => splashTextElement.style.display = 'none', 500); // Allow fade out animation
        // }, { once: true }); // Only hide on the first click
    }
});
