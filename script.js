document.addEventListener("DOMContentLoaded", () => {
    // ----- Dropdown Menu Logic (Improved Accessibility) -----
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
                document.querySelectorAll(".dropdown-content").forEach(dc => {
                    if (dc !== content) {
                        dc.classList.add("hidden");
                        const relatedToggle = dc.previousElementSibling;
                        if (relatedToggle && relatedToggle.classList.contains("dropdown-toggle")) {
                            relatedToggle.setAttribute("aria-expanded", "false");
                        }
                        dc.setAttribute("aria-hidden", "true");
                    }
                });

                // Toggle this one
                content.classList.toggle("hidden");
                const isHidden = content.classList.contains("hidden");
                toggle.setAttribute("aria-expanded", (!isHidden).toString());
                content.setAttribute("aria-hidden", isHidden.toString());
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", event => {
        document.querySelectorAll(".dropdown-content:not(.hidden)").forEach(dc => {
            dc.classList.add("hidden");
            const relatedToggle = dc.previousElementSibling;
            if (relatedToggle && relatedToggle.classList.contains("dropdown-toggle")) {
                relatedToggle.setAttribute("aria-expanded", "false");
            }
            dc.setAttribute("aria-hidden", "true");
        });
    });

    // Navigation between sections
    document.querySelectorAll(".dropdown-content a, #home-link").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            // Hide all dropdowns
            document.querySelectorAll(".dropdown-content").forEach(dc => {
                dc.classList.add("hidden");
                const relatedToggle = dc.previousElementSibling;
                if (relatedToggle && relatedToggle.classList.contains("dropdown-toggle")) {
                    relatedToggle.setAttribute("aria-expanded", "false");
                }
                dc.setAttribute("aria-hidden", "true");
            });

            // Hide all sections
            document.querySelectorAll("main section:not(#introduction)").forEach(sec => sec.classList.add("hidden"));

            // Show target
            const targetId = link.getAttribute("href").slice(1);
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.remove("hidden");
        });
    });

    // Always show introduction initially
    const intro = document.getElementById("introduction");
    if (intro) intro.classList.remove("hidden");

    // ----- Slider Logic (Improved Accessibility) -----
    // ----- Slider Logic -----
function initSlider(sliderContainer) {
  const slides = sliderContainer.querySelectorAll('.slider > .slider-image');
  if (!slides.length) return;
  let currentIndex = 0;

  function show(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  show(0);

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

// initialize all sliders
document.querySelectorAll('.slider-container').forEach(initSlider);

});