function toggleMenu() {
  const nav = document.querySelector(".nav-center");
  const button = document.querySelector(".hamburger");

  if (!nav || !button) return;

  nav.classList.toggle("active");
  button.setAttribute("aria-expanded", nav.classList.contains("active"));
}

const track = document.getElementById("featuredTrack");
const slides = document.querySelectorAll(".featured-slide");
const nextBtn = document.querySelector(".featured-btn.next");
const prevBtn = document.querySelector(".featured-btn.prev");

let currentIndex = 0;

function updateCarousel() {
  if (!track) return;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

if (nextBtn && prevBtn && slides.length > 0) {
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });
}