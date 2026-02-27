// ========================
// CONFIG (edit these)
// ========================
const API_KEY = "PASTE_YOUR_TOKEN_HERE"; // <-- PUT YOUR KEY HERE

// Massive conversion endpoint from your screenshot:
// https://api.massive.com/v1/conversion/AUD/USD?amount=100&precision=2&apiKey=YOUR_API_KEY
function buildMassiveConversionUrl({ base, quote, amount, precision }) {
  return `https://api.massive.com/v1/conversion/${encodeURIComponent(base)}/${encodeURIComponent(
    quote
  )}?amount=${encodeURIComponent(amount)}&precision=${encodeURIComponent(
    precision
  )}&apiKey=${encodeURIComponent(API_KEY)}`;
}

// At least 5 currencies
const CURRENCIES = [
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "Great Britain Pound" },
  { code: "EUR", label: "Euro" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" }
];

// We’ll always chart "1 base currency to quote currency"
const AMOUNT = 1;
const PRECISION = 6;

// ========================
// DOM
// ========================
const form = document.getElementById("fxForm");
const baseSel = document.getElementById("base");
const quoteSel = document.getElementById("quote");
const fromInp = document.getElementById("fromDate");
const toInp = document.getElementById("toDate");

const errBase = document.getElementById("errBase");
const errQuote = document.getElementById("errQuote");
const errFrom = document.getElementById("errFrom");
const errTo = document.getElementById("errTo");
const errGlobal = document.getElementById("errGlobal");

const btnClear = document.getElementById("btnClear");
const chartTitle = document.getElementById("chartTitle");

let chartInstance = null;

// ========================
// INIT
// ========================
fillCurrencySelect(baseSel);
fillCurrencySelect(quoteSel);

form.addEventListener("submit", onSubmit);
btnClear.addEventListener("click", onClear);

// ========================
// Helpers
// ========================
function fillCurrencySelect(selectEl) {
  for (const c of CURRENCIES) {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = c.label;
    selectEl.appendChild(opt);
  }
}

function clearErrors() {
  errBase.textContent = "";
  errQuote.textContent = "";
  errFrom.textContent = "";
  errTo.textContent = "";
  errGlobal.textContent = "";
}

// expects mm/dd/yyyy -> returns YYYY-MM-DD or null
function parseMMDDYYYY(str) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str.trim());
  if (!m) return null;

  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);

  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;

  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (d.getUTCFullYear() !== yyyy || d.getUTCMonth() !== (mm - 1) || d.getUTCDate() !== dd) return null;

  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  const ctx = document.getElementById("chartjs-0").getContext("2d");
  ctx.clearRect(0, 0, 650, 420);
}

function validateInputs() {
  clearErrors();
  let ok = true;

  if (!baseSel.value) { errBase.textContent = "Base Currency is Required"; ok = false; }
  if (!quoteSel.value) { errQuote.textContent = "Convert To Currency is Required"; ok = false; }

  const fromISO = parseMMDDYYYY(fromInp.value);
  if (!fromInp.value.trim()) { errFrom.textContent = "From Date is Required"; ok = false; }
  else if (!fromISO) { errFrom.textContent = "Use mm/dd/yyyy"; ok = false; }

  const toISO = parseMMDDYYYY(toInp.value);
  if (!toInp.value.trim()) { errTo.textContent = "To Date is Required"; ok = false; }
  else if (!toISO) { errTo.textContent = "Use mm/dd/yyyy"; ok = false; }

  if (fromISO && toISO) {
    const fromD = new Date(fromISO + "T00:00:00Z");
    const toD = new Date(toISO + "T00:00:00Z");
    if (fromD > toD) { errTo.textContent = "To Date must be after From Date"; ok = false; }
  }

  return { ok, base: baseSel.value, quote: quoteSel.value, fromISO, toISO };
}

function daysBetweenInclusive(startISO, endISO) {
  const start = new Date(startISO + "T00:00:00Z");
  const end = new Date(endISO + "T00:00:00Z");
  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return diffDays + 1;
}

function buildDateLabels(startISO, count) {
  const labels = [];
  const start = new Date(startISO + "T00:00:00Z");
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    labels.push(d.toLocaleString("en-US", { month: "short", day: "2-digit" }));
  }
  return labels;
}

// ========================
// Events
// ========================
function onClear() {
  baseSel.value = "";
  quoteSel.value = "";
  fromInp.value = "";
  toInp.value = "";
  chartTitle.textContent = "";
  clearErrors();
  destroyChart();
}

async function onSubmit(e) {
  e.preventDefault();

  const v = validateInputs();
  if (!v.ok) return;

  if (v.base === v.quote) {
    errGlobal.textContent = "Pick two different currencies.";
    return;
  }

  destroyChart();
  errGlobal.textContent = "";
  chartTitle.textContent = `${v.base} to ${v.quote}`;

  // Build Massive conversion URL
  const url = buildMassiveConversionUrl({
    base: v.base,
    quote: v.quote,
    amount: AMOUNT,
    precision: PRECISION
  });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const json = await res.json();
    console.log("MASSIVE JSON:", json);

    // Try common field names (we'll lock it once you see console output)
    const rate =
      json?.rate ??
      json?.result ??
      json?.value ??
      json?.conversion ??
      json?.data?.rate ??
      json?.data?.value;

    if (rate == null) {
      throw new Error("Could not find the conversion rate in the API response. Check console log.");
    }

    // Because this endpoint is NOT historical, we "fake" a series by repeating the same rate
    // across the date range so your chart draws.
    const n = daysBetweenInclusive(v.fromISO, v.toISO);
    const labels = buildDateLabels(v.fromISO, n);
    const values = Array(n).fill(Number(rate));

    drawChart(labels, values, `One ${v.base} to ${v.quote}`, v.quote);
  } catch (err) {
    errGlobal.textContent = err.message;
  }
}

// ========================
// Chart.js
// ========================
function drawChart(labels, data, seriesLabel, yAxisLabel) {
  const ctx = document.getElementById("chartjs-0").getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: seriesLabel, data, fill: false, tension: 0.2 }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      scales: {
        y: { title: { display: true, text: yAxisLabel } }
      }
    }
  });
}