// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {

  // Toggle the dropdown content visibility when clicking the dropdown toggle
  document.querySelectorAll(".dropdown-toggle").forEach(dropdownToggle => {
    dropdownToggle.addEventListener("click", function(event) {
      event.preventDefault();  // Prevent default anchor behavior
      const dropdownContent = this.nextElementSibling; // Select the <ul> element after the toggle

      // Toggle the hidden class to show/hide the dropdown content
      if (dropdownContent) {
        dropdownContent.classList.toggle("hidden");
      }
    });
  });

  // Add event listeners to the anchor tags inside the dropdown for project display
  document.querySelectorAll(".dropdown-content a").forEach(project => {
    project.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Hide all dropdowns
      document.querySelectorAll(".dropdown-content").forEach(dc => {
        dc.classList.add("hidden");
      });

      // Hide all sections in the main
      document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
      });

      // Show the selected project section
      const targetId = this.getAttribute("href").substring(1); // Remove '#' from href
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });

});
