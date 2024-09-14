document.addEventListener("DOMContentLoaded", (event) => {
  const navLinks = document.querySelectorAll(".nav-link");
  const contentSections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = e.target.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      e.target.classList.add("active");

      // Fade out current section and fade in target section
      contentSections.forEach((section) => {
        if (section.id === targetSection) {
          fadeIn(section);
        } else if (section.classList.contains("active")) {
          fadeOut(section);
        }
      });
    });
  });

  function fadeOut(element) {
    element.style.opacity = 1;
    (function fade() {
      if ((element.style.opacity -= 0.1) < 0) {
        element.style.display = "none";
        element.classList.remove("active");
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = "block";
    element.classList.add("active");
    (function fade() {
      var val = parseFloat(element.style.opacity);
      if (!((val += 0.1) > 1)) {
        element.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
});
