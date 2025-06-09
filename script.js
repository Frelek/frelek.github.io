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

  // ===== Section Navigation =====
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

  allSections.forEach(sec => {
    sec.classList.toggle("hidden", sec.id !== "introduction");
  });

  // ===== SLIDER LOGIC =====
  document.querySelectorAll('.slider-container').forEach(container => {
    const slides = Array.from(container.querySelectorAll('.slider-image'));
    let index = 0;

    const show = i => {
      slides.forEach((s, j) => s.classList.toggle('active', j === i));
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

  // ===== MODAL ZOOM PREVIEW (Image Modal for .slider-image img) =====
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

  const closeMainModal = () => {
    modal.classList.add("hidden");
    modal.style.display = "none";
    modalImg.src = "";
    (document.querySelector('.slider-image.active') || {}).focus?.();
  };

  modal.addEventListener("click", e => {
    if (e.target === modal || e.target === closeBtn) {
      closeMainModal();
    }
  });

  closeBtn?.addEventListener("click", closeMainModal);

  modal.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMainModal();
  });

  // ===== SIMPLE CLICK-TO-ZOOM (toggle zoomed class) =====
  document.querySelectorAll('img.zoomable').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      img.classList.toggle('zoomed');
    });
  });

  // ===== ADVANCED MODAL VIEWER FOR #project7 IMAGES =====
  const zoomImages = document.querySelectorAll('#project7 .zoomable');
  const advancedModal = document.getElementById('imageModal');
  const advancedImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentZoomIndex = 0;
  const imageArray = Array.from(zoomImages);

  const openAdvancedModal = (index) => {
    currentZoomIndex = index;
    advancedImg.src = imageArray[index].src;
    advancedModal.classList.add('active');
  };

  const closeAdvancedModal = () => {
    advancedModal.classList.remove('active');
  };

  const showPrev = () => {
    currentZoomIndex = (currentZoomIndex - 1 + imageArray.length) % imageArray.length;
    advancedImg.src = imageArray[currentZoomIndex].src;
  };

  const showNext = () => {
    currentZoomIndex = (currentZoomIndex + 1) % imageArray.length;
    advancedImg.src = imageArray[currentZoomIndex].src;
  };

  zoomImages.forEach((img, index) => {
    img.addEventListener('click', () => openAdvancedModal(index));
  });

  modalClose?.addEventListener('click', closeAdvancedModal);
  modalPrev?.addEventListener('click', showPrev);
  modalNext?.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!advancedModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeAdvancedModal();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  advancedModal.addEventListener('click', (e) => {
    if (e.target === advancedModal) closeAdvancedModal();
  });
});
