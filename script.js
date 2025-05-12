// script.js - Handles dropdowns, sliders, and fullscreen modal

document.addEventListener("DOMContentLoaded", () => {
  // ----- Dropdown Menu Logic -----
  document.querySelectorAll(".dropdown-toggle").forEach(menu => {
    menu.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll(".dropdown-content").forEach(dc => dc.classList.add("hidden"));
      // Toggle this one
      const content = menu.nextElementSibling;
      if (content) content.classList.toggle("hidden");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-content").forEach(dc => dc.classList.add("hidden"));
    }
  });

  // Navigation between sections
  document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      // Hide all dropdowns
      document.querySelectorAll(".dropdown-content").forEach(dc => dc.classList.add("hidden"));
      // Hide all sections
      document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
      // Show target
      const targetId = link.getAttribute("href").slice(1);
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.classList.remove("hidden");
    });
  });

  // Always show introduction initially
  const intro = document.getElementById("introduction");
  if (intro) intro.classList.remove("hidden");

  // ----- Slider Logic -----
  function initSlider(sliderContainer) {
    const slides = sliderContainer.querySelectorAll('figure.slider-image');
    if (!slides.length) return;
    let currentIndex = 0;

    function show(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    // Show first
    show(0);

    // Button events
    const leftBtn = sliderContainer.querySelector('.left-btn');
    const rightBtn = sliderContainer.querySelector('.right-btn');

    leftBtn?.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      show(currentIndex);
    });

    rightBtn?.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      show(currentIndex);
    });
  }

  // Initialize all sliders
  document.querySelectorAll('.slider-container').forEach(initSlider);

  // ----- Fullscreen Modal Logic -----
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".slider-image img").forEach(img => {
    img.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    });
  });

  function closeModal() {
    modal.classList.add("hidden");
    modalImg.src = "";
  }

  modal.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);
});
