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

function highlight(text, term) {
  if (!term) return escapeHTML(text);
  const safe = escapeHTML(text);
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return safe.replace(re, "<mark>$1</mark>");
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
      <article class="item" data-id="${t.id}">
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

// ---------- Init ----------
function init() {
  $("#year").textContent = new Date().getFullYear();
  setupTabs();
  setupSearch();
  renderCategories();
  renderTroubleshooting();
  renderPolicies();
}

document.addEventListener("DOMContentLoaded", init);
