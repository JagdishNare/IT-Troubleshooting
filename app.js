// ---------- State ----------
let activeCategory = "All";
let searchTerm = "";

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strip trailing punctuation that shouldn't be part of the URL
function splitTrailingPunct(url) {
  const m = url.match(/^(.*?)([.,;:!?)\]]+)$/);
  return m ? [m[1], m[2]] : [url, ""];
}

function highlight(text, term) {
  // 1. Escape HTML
  let safe = escapeHTML(text);

  // 2. Extract URLs to placeholders so the highlight regex can't corrupt them
  const links = [];
  safe = safe.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
    const [url, trail] = splitTrailingPunct(match);
    links.push(url);
    return `${links.length - 1}${trail}`;
  });

  // 3. Apply highlight on the URL-free text
  const buildRe = () =>
    new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  if (term) {
    safe = safe.replace(buildRe(), "<mark>$1</mark>");
  }

  // 4. Re-insert URLs as anchor tags, with highlight applied to the visible text only
  safe = safe.replace(/(\d+)/g, (_, idx) => {
    const url = links[Number(idx)];
    const visible = term ? url.replace(buildRe(), "<mark>$1</mark>") : url;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${visible}</a>`;
  });

  return safe;
}

function matches(item, term) {
  if (!term) return true;
  const haystack = [
    item.title,
    item.category || "",
    item.summary || "",
    (item.symptoms || []).join(" "),
    (item.steps || []).join(" "),
    item.tip || "",
    item.body || ""
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

// ---------- Tabs ----------
function setupTabs() {
  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      $$(".tab").forEach((b) => b.classList.toggle("active", b === btn));
      $$(".panel").forEach((p) =>
        p.classList.toggle("active", p.id === target)
      );
    });
  });
}

// ---------- Categories ----------
function renderCategories() {
  const cats = ["All", ...new Set(troubleshooting.map((t) => t.category))];
  const bar = $("#categoryBar");
  bar.innerHTML = cats
    .map(
      (c) =>
        `<button class="chip ${c === activeCategory ? "active" : ""}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`
    )
    .join("");
  bar.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.cat;
      renderCategories();
      renderTroubleshooting();
    });
  });
}

// ---------- Troubleshooting list ----------
function renderTroubleshooting() {
  const list = $("#troubleshootingList");
  const filtered = troubleshooting
    .filter((t) => activeCategory === "All" || t.category === activeCategory)
    .filter((t) => matches(t, searchTerm));

  $("#noResults").classList.toggle("hidden", filtered.length > 0);

  list.innerHTML = filtered
    .map(
      (t) => `
      <article class="item" data-id="${t.id}" data-category="${escapeHTML(t.category)}">
        <div class="item-header">
          <span class="item-title">${highlight(t.title, searchTerm)}</span>
          <span class="item-meta">${escapeHTML(t.category)}</span>
          <span class="chevron">▶</span>
        </div>
        <div class="item-body">
          <h4>Symptoms</h4>
          <ul>${t.symptoms.map((s) => `<li>${highlight(s, searchTerm)}</li>`).join("")}</ul>
          <h4>Steps to try</h4>
          <ol>${t.steps.map((s) => `<li>${highlight(s, searchTerm)}</li>`).join("")}</ol>
          ${t.tip ? `<div class="tip"><strong>Tip:</strong> ${highlight(t.tip, searchTerm)}</div>` : ""}
        </div>
      </article>`
    )
    .join("");

  list.querySelectorAll(".item-header").forEach((h) => {
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
  });

  // Auto-expand if searching and only a few results
  if (searchTerm && filtered.length <= 3) {
    list.querySelectorAll(".item").forEach((i) => i.classList.add("open"));
  }
}

// ---------- Policies list ----------
function renderPolicies() {
  const list = $("#policiesList");
  const filtered = policies.filter((p) => matches(p, searchTerm));

  $("#noPolicyResults").classList.toggle("hidden", filtered.length > 0);

  list.innerHTML = filtered
    .map(
      (p) => `
      <article class="item" data-id="${p.id}">
        <div class="item-header">
          <span class="item-title">${highlight(p.title, searchTerm)}</span>
          <span class="item-meta">Policy</span>
          <span class="chevron">▶</span>
        </div>
        <div class="item-body">
          <p><em>${highlight(p.summary, searchTerm)}</em></p>
          ${p.body}
        </div>
      </article>`
    )
    .join("");

  list.querySelectorAll(".item-header").forEach((h) => {
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
  });

  if (searchTerm && filtered.length <= 3) {
    list.querySelectorAll(".item").forEach((i) => i.classList.add("open"));
  }
}

// ---------- Search ----------
function setupSearch() {
  const input = $("#search");
  input.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim();
    renderTroubleshooting();
    renderPolicies();
  });
}

// ---------- IT Asset Form ----------
const IT_EMAIL = "mumbaiit@bookmyshow.com";

function setupAssetForm() {
  const form = document.getElementById("assetAllocationForm");
  if (!form) return;
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const data = {
      "Employee Name": (fd.get("employeeName") || "").trim(),
      "Employee Code": (fd.get("employeeCode") || "").trim(),
      "Asset Tag Number": (fd.get("tagNumber") || "").trim(),
      "Serial Number": (fd.get("serialNumber") || "").trim(),
      "Location": (fd.get("location") || "").trim(),
      "Reporting Manager": (fd.get("manager") || "").trim()
    };

    const accessories = fd.getAll("accessories");
    const other = (fd.get("accessoriesOther") || "").trim();
    if (other) {
      other.split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => accessories.push(s));
    }
    data["Accessories"] = accessories.length ? accessories.join(", ") : "None";

    const notes = (fd.get("notes") || "").trim();
    if (notes) data["Notes"] = notes;

    // Build email body
    const lines = ["IT Asset Allocation Details", "============================", ""];
    Object.entries(data).forEach(([k, v]) => lines.push(`${k}: ${v}`));
    lines.push("", "Submitted from the IT Helpdesk app.");

    const subject = `IT Asset Allocation - ${data["Employee Name"]} (${data["Employee Code"]})`;
    const body = lines.join("\n");
    const mailto = `mailto:${IT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open mail client
    window.location.href = mailto;

    // Show feedback
    status.classList.remove("hidden", "error");
    status.classList.add("success");
    status.innerHTML =
      `Email draft opened to <strong>${IT_EMAIL}</strong> with the asset details. ` +
      `Send it from your mail client to complete submission.`;
  });

  form.addEventListener("reset", () => {
    status.classList.add("hidden");
    status.classList.remove("success", "error");
  });
}

// ---------- Smart Symptom Matcher ----------
// A lightweight, fully client-side keyword scorer — no external AI service,
// no data leaves the browser. Weighted term overlap + a small synonym map
// for common IT phrasing, so "wifi wont connect" still matches
// "Wi-Fi not connecting".
const AI_STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "i", "my", "me", "mine", "it", "its", "this", "that", "these", "those",
  "to", "of", "in", "on", "at", "for", "with", "and", "or", "but", "so",
  "if", "then", "than", "as", "by", "from", "up", "down", "out",
  "am", "do", "does", "did", "have", "has", "had", "will", "would",
  "can", "could", "should", "get", "getting", "got",
  "please", "hey", "hi", "hello", "im", "ive"
]);

const AI_SYNONYMS = {
  wifi: "wi-fi",
  pc: "computer",
  laptop: "computer",
  notebook: "computer",
  macbook: "computer",
  mail: "email",
  "e-mail": "email",
  outlook: "email",
  gmail: "email",
  monitor: "display",
  screen: "display",
  print: "printer",
  printing: "printer",
  printers: "printer",
  internet: "network",
  connection: "network",
  connectivity: "network",
  sluggish: "slow",
  lag: "slow",
  lagging: "slow",
  laggy: "slow",
  freeze: "slow",
  freezing: "slow",
  frozen: "slow",
  hang: "slow",
  hanging: "slow",
  pwd: "password",
  lockout: "locked",
  login: "password",
  signin: "password",
  malware: "phishing",
  virus: "phishing",
  suspicious: "phishing",
  scam: "phishing",
  spam: "phishing",
  stolen: "lost",
  missing: "lost",
  app: "software",
  application: "software",
  install: "software",
  browser: "chrome",
  antivirus: "sophos",
  av: "sophos"
};

// Very light stemmer so "connect" / "connecting" / "connected" line up
function aiStem(word) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function aiTokenize(text) {
  return text
    .toLowerCase()
    .replace(/'/g, "") // normalize contractions: won't -> wont, can't -> cant (both sides of the match)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^-+|-+$/g, ""))
    .filter(Boolean)
    .filter((w) => !AI_STOPWORDS.has(w))
    .map((w) => AI_SYNONYMS[w] || w)
    .map(aiStem);
}

function aiScoreEntry(tokens, entry) {
  if (!tokens.length) return 0;

  const fields = [
    { text: entry.title, weight: 4 },
    { text: entry.category, weight: 2 },
    { text: entry.symptoms.join(" "), weight: 3 },
    { text: entry.steps.join(" "), weight: 1 },
    { text: entry.tip || "", weight: 1 }
  ];

  let score = 0;
  const matchedTokens = new Set();

  fields.forEach(({ text, weight }) => {
    const fieldTokens = new Set(aiTokenize(text));
    tokens.forEach((t) => {
      if (fieldTokens.has(t)) {
        score += weight;
        matchedTokens.add(t);
      }
    });
  });

  // Reward covering more of the user's distinct words, not just raw hits
  const coverage = matchedTokens.size / tokens.length;
  return score * (0.5 + 0.5 * coverage);
}

function aiRankMatches(query) {
  const tokens = aiTokenize(query);
  if (!tokens.length) return [];

  const scored = troubleshooting
    .map((entry) => ({ entry, raw: aiScoreEntry(tokens, entry) }))
    .filter((s) => s.raw > 0);

  if (!scored.length) return [];

  const topRaw = Math.max(...scored.map((s) => s.raw));
  if (topRaw < 2.5) return []; // too weak to be a useful suggestion

  return scored
    .map((s) => ({ entry: s.entry, raw: s.raw, score: Math.min(97, Math.round((s.raw / topRaw) * 97)) }))
    .sort((a, b) => b.score - a.score)
    // Always keep the top hit. Runners-up need both a decent relative
    // score AND a real absolute signal (raw >= 4 ~ one full-weight hit)
    // so a strong top match doesn't drag along a barely-related guide.
    .filter((s, i) => i === 0 || (s.score >= 30 && s.raw >= 4))
    .slice(0, 4)
    .map(({ entry, score }) => ({ entry, score }));
}

function renderAiResults(query) {
  const box = document.getElementById("aiResults");
  if (!box) return;

  const trimmed = query.trim();
  if (!trimmed) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  const matches = aiRankMatches(trimmed);
  box.classList.remove("hidden");

  if (!matches.length) {
    box.innerHTML = `
      <div class="ai-no-match">
        <p>No close match found for "<strong>${escapeHTML(trimmed)}</strong>".</p>
        <p>Try different words, browse the guides below, or <a href="#" class="ai-goto-contact">contact IT</a> / <a href="https://jira.bms.bz" target="_blank" rel="noopener noreferrer">submit a ticket</a>.</p>
      </div>`;
  } else {
    box.innerHTML = `
      <p class="ai-results-label">${matches.length} possible match${matches.length > 1 ? "es" : ""}</p>
      ${matches
        .map(
          ({ entry: t, score }, idx) => `
        <article class="item ai-match ${idx === 0 ? "open" : ""}" data-id="${t.id}" data-category="${escapeHTML(t.category)}">
          <div class="item-header">
            <span class="match-score" title="Relevance score">${score}%</span>
            <span class="item-title">${escapeHTML(t.title)}</span>
            <span class="item-meta">${escapeHTML(t.category)}</span>
            <span class="chevron">▶</span>
          </div>
          <div class="item-body">
            <h4>Symptoms</h4>
            <ul>${t.symptoms.map((s) => `<li>${highlight(s, "")}</li>`).join("")}</ul>
            <h4>Steps to try</h4>
            <ol>${t.steps.map((s) => `<li>${highlight(s, "")}</li>`).join("")}</ol>
            ${t.tip ? `<div class="tip"><strong>Tip:</strong> ${highlight(t.tip, "")}</div>` : ""}
          </div>
        </article>`
        )
        .join("")}
      <p class="ai-fallback-note">Didn't find it? <a href="https://jira.bms.bz" target="_blank" rel="noopener noreferrer">Submit a ticket</a> or check the full list below.</p>
    `;
  }

  box.querySelectorAll(".item-header").forEach((h) => {
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
  });

  box.querySelectorAll(".ai-goto-contact").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const contactTab = document.querySelector('.tab[data-tab="contact"]');
      if (contactTab) contactTab.click();
    });
  });
}

function setupAiAssistant() {
  const input = document.getElementById("aiInput");
  const submitBtn = document.getElementById("aiSubmit");
  if (!input || !submitBtn) return;

  let debounceTimer = null;
  const run = () => renderAiResults(input.value);

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(run, 300);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      clearTimeout(debounceTimer);
      run();
    }
  });

  submitBtn.addEventListener("click", () => {
    clearTimeout(debounceTimer);
    run();
  });

  document.querySelectorAll(".ai-example-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.example;
      run();
      input.focus();
    });
  });
}

// ---------- Theme toggle (dark mode) ----------
const THEME_KEY = "itHelpdeskTheme";

function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const icon = toggle.querySelector(".theme-icon");

  function apply(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      if (icon) icon.textContent = "☀️";
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (icon) icon.textContent = "🌙";
    }
  }

  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch {
    /* localStorage unavailable — default to light */
  }
  apply(saved === "dark" ? "dark" : "light");

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore persistence failure */
    }
  });
}

// ---------- Back to top ----------
function setupBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Init ----------
function init() {
  $("#year").textContent = new Date().getFullYear();
  setupTabs();
  setupSearch();
  renderCategories();
  renderTroubleshooting();
  renderPolicies();
  setupAssetForm();
  setupThemeToggle();
  setupBackToTop();
  setupAiAssistant();
}

document.addEventListener("DOMContentLoaded", init);
