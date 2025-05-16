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

  // Obsługa linków z dropdownów i linka Home
  document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      closeAllDropdowns();
      const targetId = link.getAttribute("href").slice(1);
      showSectionById(targetId);
    });
  });

  // ===== Init: pokaż tylko #introduction na start =====
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

  // ===== CLICK‑TO‑ZOOM IMAGE MODAL =====
  document.querySelectorAll('.slider-image img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById('image-modal');
      const modalImg = document.getElementById('modal-img');
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.remove('hidden');          // show the overlay
      modal.style.display = 'flex';             // ensure flex centering
      document.getElementById('modal-close').focus();
    });
  });



  
  // ===== Modal Logic =====
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");

// new, correct binding on the <img> tag
document.querySelectorAll(".slider-image img").forEach(image => {
  image.style.cursor = 'zoom-in';
  image.addEventListener("click", () => {
    modalImg.src = image.src;
    modalImg.alt = image.alt;
    modal.classList.remove("hidden");       // show it
    modal.style.display = 'flex';           // ensure flex centering
    closeBtn.focus();                       // focus the × button
  });
});


  // ===== CLOSE MODAL ON OVERLAY OR “×” CLICK =====
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target === closeBtn) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
      modalImg.src = '';
    }
  });




  const closeModal = () => {
    modal.classList.add("hidden");
    modalImg.src = "";
    (document.querySelector('.slider-image.active') || {}).focus?.();
  };

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});

// GLOBAL click‑to‑zoom handler for any <img class="zoomable">
document.querySelectorAll('img.zoomable').forEach(img => {
  img.addEventListener('click', e => {
    e.stopPropagation();
    img.classList.toggle('zoomed');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('img.zoomable').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();               // don’t bubble into slider
      img.classList.toggle('zoomed');
    });
  });
});


  const zoomImages = document.querySelectorAll('#project7 .zoomable');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentZoomIndex = 0;
  const imageArray = Array.from(zoomImages);

  const openModal = (index) => {
    currentZoomIndex = index;
    modalImg.src = imageArray[index].src;
    modal.classList.add('active');
  };

  const closeModal = () => {
    modal.classList.remove('active');
  };

  const showPrev = () => {
    currentZoomIndex = (currentZoomIndex - 1 + imageArray.length) % imageArray.length;
    modalImg.src = imageArray[currentZoomIndex].src;
  };

  const showNext = () => {
    currentZoomIndex = (currentZoomIndex + 1) % imageArray.length;
    modalImg.src = imageArray[currentZoomIndex].src;
  };

  zoomImages.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
  });

  modalClose.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', showPrev);
  modalNext.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

