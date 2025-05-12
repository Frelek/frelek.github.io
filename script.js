document.addEventListener("DOMContentLoaded", function() {
  // Rozwijanie dropdownów – po kliknięciu na Section2, 3, 4
  document.querySelectorAll(".dropdown-toggle").forEach(menu => {
    menu.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      // Ukryj wszystkie inne dropdowny
      document.querySelectorAll(".dropdown-content").forEach(dc => {
        if (dc !== this.nextElementSibling) {
          dc.classList.add("hidden");
        }
      });
      // Przełącz widoczność klikniętego dropdownu
      let dropdownContent = this.nextElementSibling;
      if (dropdownContent) {
        dropdownContent.classList.toggle("hidden");
      }
    });
  });

  // Kliknięcie w link projektu – pokazuje projekt i chowa dropdowny
  document.querySelectorAll(".dropdown-content a").forEach(project => {
    project.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      // Schowaj wszystkie dropdowny
      document.querySelectorAll(".dropdown-content").forEach(dc => {
        dc.classList.add("hidden");
      });
      // Ukryj wszystkie sekcje w <main>
      document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
      });
      // Pokaż wybrany projekt
      let targetId = this.getAttribute("href").substring(1);
      let targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });

  // Kliknięcie w "Strona Główna" – powrót do widoku głównego
  document.getElementById("home-link").addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    // Schowaj wszystkie dropdowny
    document.querySelectorAll(".dropdown-content").forEach(dc => {
      dc.classList.add("hidden");
    });
    // Ukryj wszystkie sekcje w <main>
    document.querySelectorAll("main section").forEach(section => {
      section.classList.add("hidden");
    });
    // Pokaż stronę główną
    document.getElementById("introduction").classList.remove("hidden");
  });

  // Globalny klik – jeżeli klikniesz poza dropdownem, schowa wszystkie dropdowny
  document.addEventListener("click", function(event) {
    if (!event.target.closest(".dropdown") && !event.target.closest(".dropdown-toggle")) {
      document.querySelectorAll(".dropdown-content").forEach(dc => {
        dc.classList.add("hidden");
      });
    }
  });

  // Domyślnie pokaż stronę główną
  document.getElementById("introduction").classList.remove("hidden");

  // Inicjalizacja slidera w projekcie 1 (jeśli istnieje)
 // Inicjalizacja wszystkich sliderów
document.querySelectorAll(".slider-container").forEach(function(slider) {
  initSlider(slider);
});


  // Funkcja inicjująca slider
  function initSlider(sliderContainer) {
  const slider = sliderContainer.querySelector('.slider');
  const figures = slider.querySelectorAll('.slider-image');
  let currentIndex = 0;

  const leftBtn = sliderContainer.querySelector('.left-btn');
  const rightBtn = sliderContainer.querySelector('.right-btn');

  function showImage(index) {
    figures.forEach((fig, idx) => {
      if (idx === index) {
        fig.classList.add('active');
        fig.style.display = 'block';
      } else {
        fig.classList.remove('active');
        fig.style.display = 'none';
      }
    });
  }

  leftBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + figures.length) % figures.length;
    showImage(currentIndex);
  });

  rightBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % figures.length;
    showImage(currentIndex);
  });

  // Show first image
  showImage(currentIndex);
}
});
