document.addEventListener("DOMContentLoaded", () => {
  // ----- Dropdown Menu Logic -----
  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content").forEach(dc => {
      dc.classList.add("hidden");
      dc.setAttribute("aria-hidden", "true");

      const toggle = dc.previousElementSibling;
      if (toggle?.classList.contains("dropdown-toggle")) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
    const content = toggle.nextElementSibling;
    if (content && content.classList.contains("dropdown-content")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", content.id);
      content.setAttribute("aria-hidden", "true");

      toggle.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        // Close other dropdowns
        closeAllDropdowns();

        // Toggle this one
        content.classList.toggle("hidden");
        const isHidden = content.classList.contains("hidden");
        toggle.setAttribute("aria-expanded", (!isHidden).toString());
        content.setAttribute("aria-hidden", isHidden.toString());
      });
    }
  });

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  // ----- Section Navigation Logic -----
  document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

// Hide all sections
document.querySelectorAll("main section").forEach(sec => {
  sec.style.display = 'none';
});

// Show clicked section
const targetId = link.getAttribute("href").slice(1);
const targetSec = document.getElementById(targetId);
if (targetSec) {
  // overwrite any inline style
  targetSec.style.display = '';
}

  // ----- Init: Show Only Introduction -----
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.toggle("hidden", sec.id !== "introduction");
  });

  // ----- Slider Logic -----
  document.querySelectorAll('.slider-container').forEach(container => {
    const slides = container.querySelectorAll('.slider-image');
    if (!slides.length) return;

    let index = 0;
    const show = i => {
      slides.forEach((img, j) => img.classList.toggle('active', j === i));
    };
    show(index);

    container.querySelector('.left-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      show(index);
    });

    container.querySelector('.right-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      show(index);
    });
  });

  // ----- Modal Logic -----
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".slider-image").forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      closeBtn?.focus();
    });
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    modalImg.src = "";
    const activeImage = document.querySelector('.slider-image.active:focus') || document.querySelector('.slider-image.active');
    if (activeImage) activeImage.focus();
  };

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
    closeBtn.setAttribute("aria-label", "Close image modal");
  }

  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
});

// … on nav-link click …
document.querySelectorAll("main section").forEach(sec => {
  sec.classList.add("hidden");    // now *really* hides everything
});
document.getElementById(targetId).classList.remove("hidden");