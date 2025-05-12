document.addEventListener("DOMContentLoaded", () => {
    // ----- Dropdown Menu Logic (Improved Accessibility - should still work) -----
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

    // ----- Slider Logic (Adjusted for img.slider-image) -----
    function initSlider(sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.slider-image');
        if (!slides.length) return;
        let currentIndex = 0;
        const leftBtn = sliderContainer.querySelector('.left-btn');
        const rightBtn = sliderContainer.querySelector('.right-btn');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function updateButtons() {
            if (leftBtn) leftBtn.disabled = currentIndex === 0;
            if (rightBtn) rightBtn.disabled = currentIndex === slides.length - 1;
        }

        // Initialize
        showSlide(0);
        updateButtons();

        // Button events
        if (leftBtn) {
            leftBtn.setAttribute("aria-label", "Previous image");
            leftBtn.addEventListener('click', e => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
                updateButtons();
            });
        }

        if (rightBtn) {
            rightBtn.setAttribute("aria-label", "Next image");
            rightBtn.addEventListener('click', e => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
                updateButtons();
            });
        }
    }

    // Initialize all sliders
    document.querySelectorAll(".slider-image img").forEach(img => {

    // ----- Fullscreen Modal Logic (Adjusted for img.slider-image) -----
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("modal-close");

    document.querySelectorAll(".slider-image").forEach(img => { // Directly target img.slider-image
        img.style.cursor = 'zoom-in'; // Ensure cursor for non-hover zoom

        img.addEventListener("click", () => {
            modal.classList.remove("hidden");
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            // Trap focus in modal (basic implementation)
            closeBtn?.focus();
        });
    });

    function closeModal() {
        modal.classList.add("hidden");
        modalImg.src = "";
        // Restore focus to the image that opened the modal (more advanced)
        const activeImage = document.querySelector('.slider-image.active:focus') || document.querySelector('.slider-image.active');
        if (activeImage) {
            activeImage.focus();
        }
    }

    modal.addEventListener("click", (event) => {
        // Close only if the user clicks outside the image
        if (event.target === modal) {
            closeModal();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
        closeBtn.setAttribute("aria-label", "Close image modal");
    }

    // Keyboard navigation for modal
    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});