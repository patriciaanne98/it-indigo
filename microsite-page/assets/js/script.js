// =========================
// MOBILE NAVIGATION
// Opens and closes the mobile menu when the hamburger icon is clicked.
// Also updates aria-expanded for accessibility.
// =========================
function toggleMenu() {
  const nav = document.querySelector(".nav-center");
  const button = document.querySelector(".hamburger");

  // Stops the function if the menu or button does not exist on the page
  if (!nav || !button) return;

  // Shows or hides the mobile navigation
  nav.classList.toggle("active");

  // Updates screen reader state
  button.setAttribute("aria-expanded", nav.classList.contains("active"));
}

// =========================
// RUN PAGE FEATURES AFTER HTML LOADS
// This makes sure all page elements exist before JavaScript tries to use them.
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // FEATURED VIDEO CAROUSEL
  // Controls the next/previous buttons on the featured videos section.
  // =========================
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

  // =========================
  // BLOG FILTER BUTTONS
  // Filters standard blog cards by category.
  // =========================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogArticles = document.querySelectorAll(".blog-article");

  if (filterButtons.length > 0 && blogArticles.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        blogArticles.forEach((article) => {
          const matches = filter === "all" || article.dataset.category === filter;
          article.style.display = matches ? "grid" : "none";
        });
      });
    });
  }

  // =========================
  // READ MORE / SHOW LESS
  // Expands and collapses longer blog text content.
  // =========================
  const readMoreButtons = document.querySelectorAll(".read-more");

  if (readMoreButtons.length > 0) {
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const article = button.closest(".blog-content");

        // Stops if the expected blog content wrapper does not exist
        if (!article) return;

        const fullText = article.querySelector(".full-text");

        // Stops if no hidden text exists
        if (!fullText) return;

        const expanded = button.getAttribute("aria-expanded") === "true";

        fullText.style.display = expanded ? "none" : "block";
        button.textContent = expanded ? "Read More" : "Show Less";
        button.setAttribute("aria-expanded", String(!expanded));
      });
    });
  }

  // =========================
  // WELLNESS PAGE FILTER
  // Filters editorial cards by selected wellness category.
  // =========================
  const wellnessTabs = document.querySelectorAll(".wellness-tab");
  const editorialCards = document.querySelectorAll(".editorial-card");

  if (wellnessTabs.length > 0 && editorialCards.length > 0) {
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
  }

  // =========================
  // VIDEO SIDEBAR ACTIVE STATE
  // Keeps the clicked category highlighted on the videos page.
  // =========================
  const categoryLinks = document.querySelectorAll(".video-sidebar-nav a");

  if (categoryLinks.length > 0) {
    categoryLinks.forEach((link) => {
      link.addEventListener("click", function () {
        categoryLinks.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // =========================
  // CONTACT PAGE URL PARAMETER SUPPORT
  // Pre-selects the contact form topic if a topic exists in the URL.
  // Example: contact.html?topic=private-session
  // =========================
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  const topicSelect = document.getElementById("topic");

  if (topic && topicSelect) {
    topicSelect.value = topic;
  }

  // =========================
  // DARK / LIGHT MODE
  // Runs only on pages that include the theme toggle button
  // and have class="theme-page" on the body.
  // =========================
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle && document.body.classList.contains("theme-page")) {
    const savedTheme = localStorage.getItem("theme-pages");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "☀️";
      themeToggle.setAttribute("aria-label", "Toggle light mode");
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");

      localStorage.setItem("theme-pages", isDark ? "dark" : "light");

      themeToggle.textContent = isDark ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Toggle light mode" : "Toggle dark mode"
      );
    });
  }
});

/* =========================
   SCROLL PROGRESS BAR
   Updates width based on page scroll
========================= */

const progressBar = document.getElementById("scroll-progress");

if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + "%";
  });
}

/* =========================
   SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// =========================
// WEATHER WIDGET
// Uses Open-Meteo geocoding + forecast APIs
// Default location is 72211 (Little Rock, AR)
// =========================
const weatherForm = document.getElementById("weatherForm");
const weatherMessage = document.getElementById("weatherMessage");
const locationInfo = document.getElementById("locationInfo");
const weatherTable = document.getElementById("weatherTable");
const clearWeatherBtn = document.getElementById("clearWeather");
const chartCanvas = document.getElementById("weatherChart");

if (weatherForm && weatherMessage && locationInfo && weatherTable && chartCanvas) {
  weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const locationInput = document.getElementById("location");
    const location = locationInput.value.trim() || "72211";

    weatherMessage.textContent = "";
    locationInfo.innerHTML = "";
    weatherTable.innerHTML = "";

    if (window.weatherLineChart) {
      window.weatherLineChart.destroy();
    }

    if (!location) {
      weatherMessage.textContent = "Please enter a location.";
      return;
    }

    try {
      weatherMessage.textContent = "Looking up location...";

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        weatherMessage.textContent = "No matching location was found.";
        return;
      }

      const place = geoData.results[0];
      const { name, admin1, country, latitude, longitude } = place;

      locationInfo.innerHTML = `
        <p><strong>Location:</strong> ${name}, ${admin1 || "N/A"}, ${country || "N/A"}</p>
        <p><strong>Latitude:</strong> ${latitude}</p>
        <p><strong>Longitude:</strong> ${longitude}</p>
      `;

      weatherMessage.textContent = "Loading forecast...";

      const forecastUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`;

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const times = forecastData.hourly.time;
      const temps = forecastData.hourly.temperature_2m;

      let tableRows = `
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody>
      `;

      for (let i = 0; i < 24; i++) {
        const formattedDate = new Date(times[i]).toLocaleString();
        tableRows += `
          <tr>
            <td>${formattedDate}</td>
            <td>${temps[i]}°F</td>
          </tr>
        `;
      }

      tableRows += `</tbody>`;
      weatherTable.innerHTML = tableRows;

      // Create chart using first 24 hours
      const labels = times.slice(0, 24).map((time) =>
        new Date(time).toLocaleString()
      );
      const chartTemps = temps.slice(0, 24);

      window.weatherLineChart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature (°F)",
              data: chartTemps,
              borderWidth: 2,
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true
        }
      });

      weatherMessage.textContent = "Forecast loaded.";
    } catch (error) {
      weatherMessage.textContent = "Something went wrong while loading the forecast.";
      console.error(error);
    }
  });

  if (clearWeatherBtn) {
    clearWeatherBtn.addEventListener("click", () => {
      weatherMessage.textContent = "";
      locationInfo.innerHTML = "";
      weatherTable.innerHTML = "";
      document.getElementById("location").value = "72211";

      if (window.weatherLineChart) {
        window.weatherLineChart.destroy();
      }
    });
  }
}

window.addEventListener("load", () => {
  if (weatherForm) {
    weatherForm.requestSubmit();
  }
});

// =========================
// FAQ ACCORDION
// Shows and hides answers when a question is clicked
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const faqToggles = document.querySelectorAll(".faq-toggle");

  if (faqToggles.length === 0) return;

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {

      const answer = toggle.nextElementSibling;
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      // close all FAQ answers first
      faqToggles.forEach((item) => {
        item.setAttribute("aria-expanded", "false");

        const otherAnswer = item.nextElementSibling;
        if (otherAnswer && otherAnswer.classList.contains("faq-answer")) {
          otherAnswer.classList.remove("open");
        }
      });

      // open the clicked one
      if (!isOpen && answer) {
        toggle.setAttribute("aria-expanded", "true");
        answer.classList.add("open");
      }

    });
  });
});