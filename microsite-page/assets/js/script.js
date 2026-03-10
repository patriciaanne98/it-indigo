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

const filterButtons = document.querySelectorAll(".filter-btn");
const blogArticles = document.querySelectorAll(".blog-article");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    blogArticles.forEach((article) => {
      const matches =
        filter === "all" || article.dataset.category === filter;

      article.style.display = matches ? "grid" : "none";
    });
  });
});

const readMoreButtons = document.querySelectorAll(".read-more");

readMoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const article = button.closest(".blog-content");
    const fullText = article.querySelector(".full-text");

    const expanded = button.getAttribute("aria-expanded") === "true";

    fullText.style.display = expanded ? "none" : "block";
    button.textContent = expanded ? "Read More" : "Show Less";
    button.setAttribute("aria-expanded", String(!expanded));
  });
});

const wellnessTabs = document.querySelectorAll(".wellness-tab");
const editorialCards = document.querySelectorAll(".editorial-card");

wellnessTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    wellnessTabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");

    editorialCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.hidden = !matches;
    });
  });
});