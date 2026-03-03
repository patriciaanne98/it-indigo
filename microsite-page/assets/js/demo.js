const reelA = document.getElementById("reelA");
const reelB = document.getElementById("reelB");
const reelC = document.getElementById("reelC");

const pullBtn = document.getElementById("pullBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");

const winline = document.getElementById("winline");
const pullsEl = document.getElementById("pulls");
const winsEl = document.getElementById("wins");
const timeEl = document.getElementById("time");

const SYMBOLS = ["🍒","🍋","🔔","⭐️","💎","7️⃣"];
const WIN_RATE = 0.30;

let pulls = 0;
let wins = 0;

let auto = false;
let autoTimer = null;

let startTime = null;
let timeTimer = null;

function randSym(){
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function startClock(){
  if (startTime) return;
  startTime = Date.now();
  timeTimer = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = `${s}s`;
  }, 250);
}

function resetClock(){
  if (timeTimer) clearInterval(timeTimer);
  timeTimer = null;
  startTime = null;
  timeEl.textContent = "0s";
}

function updateStats(){
  pullsEl.textContent = pulls;
  winsEl.textContent = wins;
}

function outcomeMessage(isWin, syms){
  return isWin
    ? `Win! ${syms.join(" ")} — reward hit.`
    : `No win (${syms.join(" ")}). Notice the urge to try again.`;
}

async function pull(){
  startClock();
  pulls++;
  updateStats();
  pullBtn.disabled = true;

  const win = Math.random() < WIN_RATE;
  let a = randSym(), b = randSym(), c = randSym();
  if (win){ a = randSym(); b = a; c = a; }

  for (let i = 0; i < 14; i++){
    reelA.textContent = randSym();
    reelB.textContent = randSym();
    reelC.textContent = randSym();
    await new Promise(r => setTimeout(r, 40));
  }

  reelA.textContent = a;
  reelB.textContent = b;
  reelC.textContent = c;

  if (win) wins++;
  updateStats();
  winline.textContent = outcomeMessage(win, [a,b,c]);
  pullBtn.disabled = false;
}

pullBtn?.addEventListener("click", pull);

autoBtn?.addEventListener("click", () => {
  auto = !auto;
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

resetBtn?.addEventListener("click", () => {
  pulls = 0;
  wins = 0;
  updateStats();
  winline.textContent = "Pull to begin.";

  reelA.textContent = "🍒";
  reelB.textContent = "🍋";
  reelC.textContent = "🔔";

  if (auto){
    auto = false;
    autoBtn.textContent = "Auto: Off";
    autoBtn.setAttribute("aria-pressed","false");
    clearInterval(autoTimer);
    autoTimer = null;
  }
  resetClock();
});