// ===== progress bar =====
const bar = document.getElementById("bar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  bar.style.width = `${scrolled}%`;
});

// ===== slot machine logic (FIXED) =====
const reelEls = [
  document.querySelector("#reel1 .strip"),
  document.querySelector("#reel2 .strip"),
  document.querySelector("#reel3 .strip"),
];

const pullBtn = document.getElementById("pullBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");

const winline = document.getElementById("winline");
const pullsEl = document.getElementById("pulls");
const winsEl = document.getElementById("wins");
const statPulls = document.getElementById("statPulls");
const statWins = document.getElementById("statWins");
const statTime = document.getElementById("statTime");

let pulls = 0;
let wins = 0;
let auto = false;
let autoTimer = null;

let startTime = null;
let timeTimer = null;

const SYMBOLS = ["🍒","🍋","🔔","⭐️","💎","7️⃣"];
const REEL_HEIGHT = 120; // must match .symbol height in CSS
const SPIN_MS = 900;
const WIN_RATE = 0.30;

// IMPORTANT FIX:
// Make the strip long enough for multiple loops.
// 12 loops worth of symbols = 12 * 6 = 72 items (plenty)
const LOOPS_IN_STRIP = 12;
const ITEM_COUNT = LOOPS_IN_STRIP * SYMBOLS.length;

function setReelContent(stripEl){
  const items = [];
  for (let i = 0; i < ITEM_COUNT; i++){
    const sym = SYMBOLS[i % SYMBOLS.length];
    items.push(`<div class="symbol">${sym}</div>`);
  }
  stripEl.innerHTML = items.join("");
  stripEl.style.transform = "translateY(0px)";
}

reelEls.forEach(setReelContent);

function startClock(){
  if (startTime) return;
  startTime = Date.now();
  timeTimer = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    statTime.textContent = `${s}s`;
  }, 250);
}

function resetClock(){
  if (timeTimer) clearInterval(timeTimer);
  timeTimer = null;
  startTime = null;
  statTime.textContent = "0s";
}

function updateStats(){
  pullsEl.textContent = pulls;
  winsEl.textContent = wins;
  statPulls.textContent = pulls;
  statWins.textContent = wins;
}

function randIndex(){
  return Math.floor(Math.random() * SYMBOLS.length);
}

function spinReel(stripEl, targetIndex, delay){
  // Keep loops small enough to never exceed our strip length.
  // With ITEM_COUNT = 72, loops up to 6 is safe:
  const loops = 5 + Math.floor(Math.random() * 2); // 5–6 loops

  // total steps we move down the strip
  const steps = loops * SYMBOLS.length + targetIndex;

  // safety clamp (shouldn't be needed, but prevents blanks forever)
  const maxSteps = ITEM_COUNT - 1;
  const safeSteps = Math.min(steps, maxSteps);

  const targetOffset = safeSteps * REEL_HEIGHT;

  stripEl.style.transition = "none";
  stripEl.style.transform = "translateY(0px)";
  stripEl.getBoundingClientRect(); // force reflow

  setTimeout(() => {
    stripEl.style.transition = `transform ${SPIN_MS}ms cubic-bezier(.2,.9,.2,1)`;
    stripEl.style.transform = `translateY(-${targetOffset}px)`;
  }, delay);

  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay + SPIN_MS + 30);
  });
}

function outcomeMessage(isWin, symbols){
  if (isWin) return `Win! ${symbols.join(" ")} — reward hit.`;
  return `No win (${symbols.join(" ")}). Notice how you still want “one more pull.”`;
}

async function pull(){
  startClock();

  pulls++;
  updateStats();
  pullBtn.disabled = true;

  // Choose final symbols (win = all match)
  const win = Math.random() < WIN_RATE;
  let a = randIndex(), b = randIndex(), c = randIndex();

  if (win){
    a = randIndex();
    b = a;
    c = a;
  }

  const final = [SYMBOLS[a], SYMBOLS[b], SYMBOLS[c]];

  await Promise.all([
    spinReel(reelEls[0], a, 0),
    spinReel(reelEls[1], b, 140),
    spinReel(reelEls[2], c, 280),
  ]);

  if (win) wins++;
  updateStats();
  winline.textContent = outcomeMessage(win, final);

  pullBtn.disabled = false;
}

pullBtn.addEventListener("click", pull);

autoBtn.addEventListener("click", () => {
  auto = !auto;
  autoBtn.classList.toggle("on", auto);
  autoBtn.textContent = auto ? "Auto: On" : "Auto: Off";
  autoBtn.setAttribute("aria-pressed", auto ? "true" : "false");

  if (auto){
    autoTimer = setInterval(() => {
      if (!pullBtn.disabled) pull();
    }, 1200);
  } else {
    clearInterval(autoTimer);
    autoTimer = null;
  }
});

resetBtn.addEventListener("click", () => {
  pulls = 0;
  wins = 0;
  updateStats();
  winline.textContent = "Pull to begin.";

  if (auto){
    auto = false;
    autoBtn.classList.remove("on");
    autoBtn.textContent = "Auto: Off";
    autoBtn.setAttribute("aria-pressed","false");
    clearInterval(autoTimer);
    autoTimer = null;
  }

  reelEls.forEach(strip => {
    strip.style.transition = "none";
    strip.style.transform = "translateY(0px)";
  });

  resetClock();
});
