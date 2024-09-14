document.addEventListener("DOMContentLoaded", (event) => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentSections = document.querySelectorAll(".content-section");
  
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSection = e.target.getAttribute("data-section");
        changeSection(targetSection);
      });
    });
  
    function changeSection(targetSectionId) {
      // Update active nav link
      navLinks.forEach((navLink) => {
        navLink.classList.toggle("active", navLink.getAttribute("data-section") === targetSectionId);
      });
  
      // Find the current active section and the target section
      const currentSection = document.querySelector(".content-section.active");
      const targetSection = document.getElementById(targetSectionId);
  
      if (currentSection === targetSection) return; // Do nothing if clicking the current section
  
      // Fade out current section
      fadeOut(currentSection, () => {
        currentSection.classList.remove("active");
        // Fade in target section
        fadeIn(targetSection);
      });
  
      // Update URL without page reload
      history.pushState(null, "", `#${targetSectionId}`);
    }
  
    function fadeOut(element, callback) {
      element.style.opacity = 1;
      (function fade() {
        if ((element.style.opacity -= 0.1) < 0) {
          element.style.display = "none";
          if (callback) callback();
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
  
    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
      const sectionId = location.hash.slice(1) || "about"; // Default to 'about' if no hash
      changeSection(sectionId);
    });
  
    // Initial load
    const initialSection = location.hash.slice(1) || "about";
    changeSection(initialSection);