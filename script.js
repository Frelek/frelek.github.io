document.addEventListener("DOMContentLoaded", () => {
  // ===== Dropdown Menu Logic =====
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
    toggle.setAttribute("aria-expanded", "false");
    if (content?.classList.contains("dropdown-content")) {
      content.setAttribute("aria-hidden", "true");
      toggle.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        closeAllDropdowns();
        content.classList.toggle("hidden");
        const hidden = content.classList.contains("hidden");
        toggle.setAttribute("aria-expanded", (!hidden).toString());
        content.setAttribute("aria-hidden", hidden.toString());
      });
    }
  });

  document.addEventListener("click", closeAllDropdowns);

  // ===== Section Navigation Logic =====
  const allSections = document.querySelectorAll("main section");
  function showSectionById(id) {
    allSections.forEach(sec => sec.classList.add("hidden"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.remove("hidden");
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      closeAllDropdowns();
      const targetId = link.getAttribute("href").slice(1);
      showSectionById(targetId);
    });
  });

  // Initially show only #introduction
  allSections.forEach(sec => {
    sec.classList.toggle("hidden", sec.id !== "introduction");
  });

  // ===== Slider Logic =====
  document.querySelectorAll('.slider-container').forEach(container => {
    const slides = container.querySelectorAll('.slider-image');
    if (!slides.length) return;
    let index = 0;
    const show = i => slides.forEach((s, j) => s.classList.toggle('active', j === i));
    show(0);
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

  // ===== Modal Logic =====
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll(".slider-image img").forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener("click", () => {
      modalImg.src = image.src;
      modalImg.alt = image.alt;
      modal.classList.remove("hidden");
      modal.style.display = 'flex';
      closeBtn.focus();
    });
  });

  function closeModal() {
    modal.classList.add("hidden");
    modal.style.display = 'none';
    modalImg.src = "";
  }

  modal.addEventListener("click", e => {
    if (e.target === modal || e.target === closeBtn) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // ===== GLOBAL CLICK‑TO‑ZOOM (for any <img class="zoomable">) =====
  document.querySelectorAll('img.zoomable').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => {
      e.stopPropagation();          // don’t bubble into slider/modal
      img.classList.toggle('zoomed');
    });
  });

}); // end DOMContentLoaded
