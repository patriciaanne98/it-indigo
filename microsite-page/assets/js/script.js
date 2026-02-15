// ===== progress bar =====
const bar = document.getElementById("bar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  bar.style.width = `${scrolled}%`;
});

// ===== reveal on scroll =====
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));

// ===== card tilt + glow =====
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = x / r.width - 0.5;
    const cy = y / r.height - 0.5;

    card.style.setProperty("--mx", `${(x / r.width) * 100}%`);
    card.style.setProperty("--my", `${(y / r.height) * 100}%`);
    card.style.transform =
      `perspective(900px) rotateX(${(-cy * 8).toFixed(2)}deg) rotateY(${(cx * 10).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// ===== button glow follow mouse =====
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    btn.style.setProperty("--mx", `${(x / r.width) * 100}%`);
    btn.style.setProperty("--my", `${(y / r.height) * 100}%`);
  });
});

// ===== animated counters =====
function animateCount(el, target){
  const duration = 800;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = v;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
document.querySelectorAll("[data-count]").forEach(el => {
  animateCount(el, Number(el.dataset.count));
});

// ===== toast =====
function toast(msg){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

// ===== ROAST ENGINE =====
let mode = "roast"; // roast | calm
let selectedVibe = null;

const roastOut = document.getElementById("roastOut");
const newRoast = document.getElementById("newRoast");
const calmMode = document.getElementById("calmMode");

const ROASTS = {
  gremlin: [
    "You said “minimum payment” with your whole chest 😭 — autopay the statement balance, bestie.",
    "Your budget is vibes. Your bank account is screaming. We can fix this. ✅",
    "If late fees were a personality trait, you’d be famous."
  ],
  main: [
    "Main character energy is great, but interest charges are literally the villain arc. 👹",
    "Yes you can have travel points. No you cannot carry a balance for them. 😤",
    "You want a soft life? Autopay is the soft life starter pack."
  ],
  queen: [
    "Responsible Queen detected 👑. The bank hates to see you coming.",
    "Autopay on? Utilization low? Calm money energy? Iconic.",
    "You’re so stable the interest monster is unemployed."
  ]
};

const CALM = {
  gremlin: [
    "No shame — habits are built, not born. Start with autopay for the statement balance.",
    "You’re not bad with money. You just need a system that runs itself.",
    "One card. One autopay. One weekly check-in. That’s enough."
  ],
  main: [
    "Your goals are valid. Let’s build a simple setup that earns points without stress.",
    "Pick one points card + one backup card and keep it consistent.",
    "You can be the main character and still be responsible. Promise."
  ],
  queen: [
    "Keep doing what you’re doing — you’re building long-term freedom.",
    "You’re proof money can feel calm and intentional.",
    "Small consistent habits > complicated strategies."
  ]
};

function pickLine(){
  if (!selectedVibe) return "Pick a personality above to unlock your roast.";
  const pool = mode === "roast" ? ROASTS[selectedVibe] : CALM[selectedVibe];
  return pool[Math.floor(Math.random()*pool.length)];
}

document.querySelectorAll(".vibe").forEach(card => {
  card.addEventListener("click", (e) => {
    selectedVibe = card.dataset.vibe;
    roastOut.textContent = pickLine();
    toast(mode === "roast" ? "Roast delivered 🔥" : "Support delivered 🤝");
    confettiBurst(60);
  });
});

newRoast.addEventListener("click", () => {
  roastOut.textContent = pickLine();
  toast("Another one 😭");
});

calmMode.addEventListener("click", () => {
  mode = (mode === "roast") ? "calm" : "roast";
  calmMode.textContent = mode === "roast" ? "Switch to supportive mode 🤝" : "Switch to roast mode 🔥";
  roastOut.textContent = pickLine();
  toast(mode === "roast" ? "Roast Mode ON 🔥" : "Calm Mode ON 🤝");
});

// ===== INTEREST MONSTER =====
const balance = document.getElementById("balance");
const balOut = document.getElementById("balOut");
const interestOut = document.getElementById("interestOut");
const rewardsOut = document.getElementById("rewardsOut");
const netOut = document.getElementById("netOut");
const netText = document.getElementById("netText");

const monsterFace = document.getElementById("monsterFace");
const meterFill = document.getElementById("meterFill");
const monsterLine = document.getElementById("monsterLine");

function fmt(n){ return `$${Math.round(n)}`; }
const APR = 0.24;
const CASHBACK = 0.02;

function updateMonster(val){
  const b = Number(val);
  const monthlyInterest = b * (APR / 12);
  const rewards = b * CASHBACK;
  const net = rewards - monthlyInterest;

  balOut.textContent = fmt(b);
  interestOut.textContent = fmt(monthlyInterest);
  rewardsOut.textContent = fmt(rewards);
  netOut.textContent = (net >= 0 ? "+" : "") + fmt(net);

  // monster level 0–100
  const level = Math.min(100, Math.round((b / 2000) * 100));
  meterFill.style.width = `${Math.max(6, level)}%`;

  // face + message
  if (b === 0){
    monsterFace.textContent = "😴";
    monsterLine.textContent = "Monster is asleep. You’re free. 🫡";
    netText.textContent = "Elite behavior. Zero balance carried.";
  } else if (net < 0){
    monsterFace.textContent = level > 65 ? "👹" : "😈";
    monsterLine.textContent = "It’s getting fed. Please stop. 😭";
    netText.textContent = "Congrats, the bank is eating your rewards.";
  } else {
    monsterFace.textContent = "😏";
    monsterLine.textContent = "You’re surviving… but don’t get comfortable. 😤";
    netText.textContent = "Breaking even-ish. Pay it off anyway.";
  }

  // tiny shake when big
  monsterFace.style.transform = `scale(${1 + level/180}) rotate(${(level/18)-2}deg)`;
}

updateMonster(balance.value);
balance.addEventListener("input", (e) => updateMonster(e.target.value));

// ===== OATH BUTTON =====
document.getElementById("oathBtn").addEventListener("click", () => {
  toast("Oath accepted ✅");
  confettiBurst(160);
});

// ===== confetti =====
function confettiBurst(n = 120){
  for (let i = 0; i < n; i++){
    const p = document.createElement("span");
    p.style.position = "fixed";
    p.style.left = "50%";
    p.style.top = "55%";
    p.style.width = "8px";
    p.style.height = "8px";
    p.style.borderRadius = "2px";
    p.style.background = `hsl(${Math.random()*360}, 90%, 60%)`;
    p.style.zIndex = "99999";
    p.style.pointerEvents = "none";
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 10;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 8;

    let x = 0, y = 0, t = 0;
    const tick = () => {
      t += 1;
      x += vx;
      y += vy + t * 0.22;
      p.style.transform = `translate(${x}px, ${y}px) rotate(${t*10}deg)`;
      p.style.opacity = `${1 - t / 55}`;
      if (t < 55) requestAnimationFrame(tick);
      else p.remove();
    };
    requestAnimationFrame(tick);
  }
}

// ===== canvas sparkles =====
const canvas = document.getElementById("sparkles");
const ctx = canvas.getContext("2d");
let W, H;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
let mouse = { x: W/2, y: H/2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  for (let i=0; i<3; i++){
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random()-0.5)*1.6,
      vy: (Math.random()-0.5)*1.6,
      life: 60 + Math.random()*20,
      r: 1.5 + Math.random()*2.5,
      hue: Math.random()*360
    });
  }
});

function draw(){
  ctx.clearRect(0,0,W,H);
  for (let i=particles.length-1; i>=0; i--){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${Math.max(0,p.life/80)})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();

    if (p.life <= 0) particles.splice(i,1);
  }
  requestAnimationFrame(draw);
}
draw();
