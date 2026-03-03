// ===== Progress bar =====
const bar = document.getElementById("bar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (bar) bar.style.width = `${scrolled}%`;
});

// ===== Sticky header style =====
const header = document.querySelector(".site-header");
function onScrollHeader(){
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", onScrollHeader);
onScrollHeader();

// ===== Mobile menu =====
const burger = document.getElementById("burger");
const mobilePanel = document.getElementById("mobilePanel");

burger?.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close mobile panel when you click a link
mobilePanel?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  mobilePanel.classList.remove("open");
  burger?.setAttribute("aria-expanded","false");
});

// ===== Search modal =====
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");

function openSearch(){
  modal?.classList.add("open");
  setTimeout(() => searchInput?.focus(), 50);
}
function closeSearchModal(){
  modal?.classList.remove("open");
}

searchBtn?.addEventListener("click", openSearch);
closeSearch?.addEventListener("click", closeSearchModal);

// Click outside closes
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeSearchModal();
});

// ESC closes
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearchModal();
});

// Basic on-page search (highlights section headings)
searchInput?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;

  const headings = [...document.querySelectorAll("h1,h2,h3")];
  const hit = headings.find(h => h.textContent.toLowerCase().includes(q));
  if (hit){
    closeSearchModal();
    hit.scrollIntoView({ behavior:"smooth", block:"center" });
  }
});

// ===== Progress bar =====
const bar = document.getElementById("bar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (bar) bar.style.width = `${scrolled}%`;
});

// ===== Sticky header style =====
const header = document.querySelector(".site-header");
function onScrollHeader(){
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", onScrollHeader);
onScrollHeader();

// ===== Mobile menu =====
const burger = document.getElementById("burger");
const mobilePanel = document.getElementById("mobilePanel");

burger?.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});

mobilePanel?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  mobilePanel.classList.remove("open");
  burger?.setAttribute("aria-expanded","false");
});

// ===== Search modal =====
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");

function openSearch(){
  modal?.classList.add("open");
  setTimeout(() => searchInput?.focus(), 60);
}
function closeSearchModal(){
  modal?.classList.remove("open");
}

searchBtn?.addEventListener("click", openSearch);
closeSearch?.addEventListener("click", closeSearchModal);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeSearchModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearchModal();
});

searchInput?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;

  const headings = [...document.querySelectorAll("h1,h2,h3")];
  const hit = headings.find(h => h.textContent.toLowerCase().includes(q));
  if (hit){
    closeSearchModal();
    hit.scrollIntoView({ behavior:"smooth", block:"center" });
  }
});