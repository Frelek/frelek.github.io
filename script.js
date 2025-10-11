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
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.slider-container').forEach(container => {
      const slides = Array.from(container.querySelectorAll('.slider-image'));
      let index = slides.findIndex(s => s.classList.contains('active'));
      if (index === -1) index = 0;

      const show = i => {
        slides.forEach((s, j) => s.classList.toggle('active', j === i));
      };

      show(index);

      container.querySelector('.left-btn')?.addEventListener('click', e => {
        e.preventDefault();
        index = (index - 1 + slides.length) % slides.length;
        show(index);
      });

      container.querySelector('.right-btn')?.addEventListener('click', e => {
        e.preventDefault();
        index = (index + 1) % slides.length;
        show(index);
      });
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

  // Slider logic for the Travelling section
  document.querySelectorAll('.slider-container').forEach(container => {
    const slides = Array.from(container.querySelectorAll('.slider-image'));
    let index = slides.findIndex(s => s.classList.contains('active'));
    if (index === -1) index = 0;

    const showSlide = i => {
      slides.forEach((slide, j) => slide.classList.toggle('active', j === i));
    };

    container.querySelector('.left-btn')?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    container.querySelector('.right-btn')?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });
  });

  // Expandable image logic for Travelling section
  const travellingModal = document.getElementById('image-modal');
  const travellingModalImg = document.getElementById('modal-img');
  const travellingCloseBtn = document.getElementById('modal-close');

  document.querySelectorAll('.slider-image img.expandable').forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener('click', () => {
      travellingModalImg.src = image.src;
      travellingModalImg.alt = image.alt;
      travellingModal.classList.remove('hidden');
      travellingModal.style.display = 'flex';
      travellingCloseBtn.focus();
    });
  });

  travellingCloseBtn.addEventListener('click', () => {
    travellingModal.classList.add('hidden');
    travellingModal.style.display = 'none';
    travellingModalImg.src = '';
  });

  // Add functionality to make photos clickable and expandable
  const expandableImages = document.querySelectorAll('.expandable');

  expandableImages.forEach(image => {
      image.addEventListener('click', () => {
          modalImg.src = image.src;
          modalImg.alt = image.alt;
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
      });
  });

  // Append extra images for Project 02 from images/experience/project_02/manifest.json
  (() => {
		const extra = document.getElementById('project2-gallery-extra');
		if (!extra) return;

    const topPdf = document.getElementById('project2-pdf-btn');
    const base = './images/Experience/project_02/';
		const manifestUrl = base + 'manifest.json';

		const toCaption = (name) => name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');

    fetch(manifestUrl)
			.then(r => (r.ok ? r.json() : Promise.reject()))
			.then(m => {
				// Bind PDF from folder if provided
				if (m.pdf) {
          const pdfPath = base + encodeURIComponent(m.pdf);
          if (topPdf) topPdf.href = pdfPath;
				}
        // Append images listed in manifest
				const imgs = Array.isArray(m.images) ? m.images : [];
				if (!imgs.length) return;

				const frag = document.createDocumentFragment();
				imgs.forEach(file => {
					const fig = document.createElement('figure');
					const img = document.createElement('img');
          img.src = base + encodeURIComponent(file);
					img.alt = toCaption(file);
					const cap = document.createElement('figcaption');
					cap.textContent = toCaption(file);
					fig.appendChild(img);
					fig.appendChild(cap);
					frag.appendChild(fig);
				});
        extra.appendChild(frag);

        // Also try to resolve the six primary placeholders by matching names loosely
        const mapByBase = new Map();
        imgs.forEach(f => {
          const baseName = f.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '');
          mapByBase.set(baseName, f);
        });
        document.querySelectorAll('#project2 .image-gallery img[data-file]').forEach(img => {
          const key = img.getAttribute('data-file').toLowerCase().replace(/[^a-z0-9]+/g, '');
          const match = mapByBase.get(key);
          if (match) {
            img.src = base + encodeURIComponent(match);
          }
        });
			})
			.catch(() => {
				// No manifest; leave static gallery as-is
			});
	})();

  // Resolve proper photos for Project 02 by trying common extensions
  (() => {
  const base = './images/Experience/project_02/';
    const exts = ['.png', '.jpg', '.jpeg', '.webp'];

    const resolveSrc = (basename) => new Promise((resolve, reject) => {
      let i = 0;
      const tryNext = () => {
        if (i >= exts.length) return reject();
        const url = base + basename + exts[i++];
        const probe = new Image();
        probe.onload = () => resolve(url);
        probe.onerror = tryNext;
        probe.src = url;
      };
      tryNext();
    });

    document.querySelectorAll('#project2 .image-gallery img[data-file]').forEach(img => {
      const basename = img.getAttribute('data-file');
      resolveSrc(basename)
        .then(url => { img.src = url; })
        .catch(() => {
          const fig = img.closest('figure');
          if (fig) fig.style.display = 'none';
        });
    });
  })();

  // Append extra images for Project 03 from images/Experience/project_03/manifest.json
  (() => {
    const extra = document.getElementById('project3-gallery-extra');
    if (!extra) return;

    const topPdf = document.getElementById('project3-pdf-btn');
    const base = './images/Experience/project_03/';
    const manifestUrl = base + 'manifest.json';

    const toCaption = (name) => name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');

    fetch(manifestUrl)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(m => {
        if (m.pdf) {
          const pdfPath = base + encodeURIComponent(m.pdf);
          if (topPdf) topPdf.href = pdfPath;
        }
        const imgs = Array.isArray(m.images) ? m.images : [];
        if (!imgs.length) return;

        const frag = document.createDocumentFragment();
        imgs.forEach(file => {
          const fig = document.createElement('figure');
          const img = document.createElement('img');
          img.src = base + encodeURIComponent(file);
          img.alt = toCaption(file);
          const cap = document.createElement('figcaption');
          cap.textContent = toCaption(file);
          fig.appendChild(img);
          fig.appendChild(cap);
          frag.appendChild(fig);
        });
        extra.appendChild(frag);

        // Try to resolve placeholders
        const mapByBase = new Map();
        imgs.forEach(f => {
          const baseName = f.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '');
          mapByBase.set(baseName, f);
        });
        document.querySelectorAll('#project3 .image-gallery img[data-file]').forEach(img => {
          const key = img.getAttribute('data-file').toLowerCase().replace(/[^a-z0-9]+/g, '');
          const match = mapByBase.get(key);
          if (match) img.src = base + encodeURIComponent(match);
        });
      })
      .catch(() => { /* silently ignore if no manifest */ });
  })();
});
