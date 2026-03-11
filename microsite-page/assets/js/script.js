// =========================
// MOBILE NAVIGATION
// This function opens and closes the mobile menu when the hamburger icon is clicked.
// It also updates aria-expanded for better accessibility.
// =========================
function toggleMenu() {
  const nav = document.querySelector(".nav-center");
  const button = document.querySelector(".hamburger");

  // Stops the function if the nav or button is missing on a page
  if (!nav || !button) return;

  // Adds or removes the "active" class to show/hide the mobile nav
  nav.classList.toggle("active");

  // Updates accessibility state for screen readers
  button.setAttribute("aria-expanded", nav.classList.contains("active"));
}

// =========================
// FEATURED VIDEO CAROUSEL
// These variables grab the featured carousel elements on the videos page.
// =========================
const track = document.getElementById("featuredTrack");
const slides = document.querySelectorAll(".featured-slide");
const nextBtn = document.querySelector(".featured-btn.next");
const prevBtn = document.querySelector(".featured-btn.prev");

// Keeps track of which slide is currently showing
let currentIndex = 0;

// Moves the carousel left/right based on the current slide index
function updateCarousel() {
  if (!track) return;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Only runs if the buttons and slides actually exist on the page
if (nextBtn && prevBtn && slides.length > 0) {
  // Moves to the next slide
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  // Moves to the previous slide
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });
}

// =========================
// BLOG FILTER BUTTONS
// These are used on pages with filterable blog/article content.
// Clicking a filter button shows only the matching category.
// =========================
const filterButtons = document.querySelectorAll(".filter-btn");
const blogArticles = document.querySelectorAll(".blog-article");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // Removes active styling from all buttons first
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Adds active styling to the clicked button
    button.classList.add("active");

    // Shows or hides articles depending on the selected category
    blogArticles.forEach((article) => {
      const matches =
        filter === "all" || article.dataset.category === filter;

      article.style.display = matches ? "grid" : "none";
    });
  });
});

// =========================
// READ MORE / SHOW LESS
// This expands and collapses extra text inside blog article cards.
// =========================
const readMoreButtons = document.querySelectorAll(".read-more");

readMoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const article = button.closest(".blog-content");
    const fullText = article.querySelector(".full-text");

    // Checks whether the text is currently expanded
    const expanded = button.getAttribute("aria-expanded") === "true";

    // Toggles the full text visibility
    fullText.style.display = expanded ? "none" : "block";

    // Changes the button text depending on state
    button.textContent = expanded ? "Read More" : "Show Less";

    // Updates accessibility state
    button.setAttribute("aria-expanded", String(!expanded));
  });
});

// =========================
// WELLNESS PAGE FILTER
// This filters the editorial-style article cards by category.
// =========================
const wellnessTabs = document.querySelectorAll(".wellness-tab");
const editorialCards = document.querySelectorAll(".editorial-card");

wellnessTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    // Removes active state from all tabs first
    wellnessTabs.forEach((btn) => btn.classList.remove("active"));

    // Adds active state to the clicked tab
    tab.classList.add("active");

    // Shows only cards that match the selected category
    editorialCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.hidden = !matches;
    });
  });
});

// =========================
// VIDEO SIDEBAR ACTIVE STATE
// Keeps the clicked video category highlighted in the sidebar.
// This helps users know which section they selected.
// =========================
const categoryLinks = document.querySelectorAll(".video-sidebar-nav a");

categoryLinks.forEach(link => {
  link.addEventListener("click", function () {

    // Removes active class from all category links
    categoryLinks.forEach(item => item.classList.remove("active"));

    // Adds active class to the clicked category
    this.classList.add("active");

  });
});