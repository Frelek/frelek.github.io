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

  // ----- Section Navigation Logic -----
  document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      closeAllDropdowns();

      // Ukryj wszystkie sekcje
      document.querySelectorAll("main section").forEach(sec =>
        sec.classList.add("hidden")
      );

      // Pokaż tylko klikniętą
      const targetId = link.getAttribute("href").slice(1);
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.classList.remove("hidden");
    });
  });

  // ----- Init: pokaz tylko #introduction na start -----
  document.querySelectorAll("main section").forEach(sec =>
    sec.classList.toggle("hidden", sec.id !== "introduction")
  );

  // ----- Slider Logic (bez zmian) -----
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

  // ----- Modal Logic (bez zmian) -----
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
    (document.querySelector('.slider-image.active') || {}).focus?.();
  };
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
