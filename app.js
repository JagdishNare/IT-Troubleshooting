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

// ---------- IT Asset Form ----------
const IT_EMAIL = "mumbaiit@bookmyshow.com";
const HISTORY_KEY = "itAssetSubmissions";
const HISTORY_MAX = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not save history:", err);
  }
}

function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

function buildEmailLink(data) {
  const lines = ["IT Asset Allocation Details", "============================", ""];
  Object.entries(data).forEach(([k, v]) => {
    if (k === "submittedAt") return;
    lines.push(`${k}: ${v}`);
  });
  lines.push("", "Submitted from the IT Helpdesk app.");
  const subject = `IT Asset Allocation - ${data["Employee Name"]} (${data["Employee Code"]})`;
  return `mailto:${IT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function renderHistory() {
  const list = loadHistory();
  const container = document.getElementById("historyList");
  const empty = document.getElementById("historyEmpty");
  const countEl = document.getElementById("historyCount");
  const clearBtn = document.getElementById("clearHistory");
  if (!container) return;

  countEl.textContent = list.length;
  clearBtn.style.display = list.length ? "" : "none";
  empty.classList.toggle("hidden", list.length > 0);

  container.innerHTML = list
    .map((entry, idx) => {
      const accLine = entry["Accessories"] && entry["Accessories"] !== "None"
        ? ` · ${escapeHTML(entry["Accessories"])}`
        : "";
      const subParts = [
        entry["Asset Tag Number"] ? `Tag ${escapeHTML(entry["Asset Tag Number"])}` : "",
        entry["Location"] ? escapeHTML(entry["Location"]) : ""
      ].filter(Boolean).join(" · ");

      return `
        <article class="history-item" data-idx="${idx}">
          <div class="history-item-head">
            <div class="history-main">
              <div class="history-name">${escapeHTML(entry["Employee Name"] || "Unnamed")} <span style="color: var(--muted); font-weight: 400;">· ${escapeHTML(entry["Employee Code"] || "")}</span></div>
              <div class="history-sub">${subParts}${accLine}</div>
            </div>
            <div class="history-time">${formatTimestamp(entry.submittedAt)}</div>
            <div class="history-actions">
              <button type="button" class="icon-btn" data-action="delete" data-idx="${idx}" title="Delete entry">✕</button>
            </div>
          </div>
          <div class="history-body">
            <dl>
              ${Object.entries(entry)
                .filter(([k]) => k !== "submittedAt")
                .map(([k, v]) => `<dt>${escapeHTML(k)}</dt><dd>${escapeHTML(String(v))}</dd>`)
                .join("")}
            </dl>
            <a class="resend" href="${buildEmailLink(entry)}">↗ Reopen email draft</a>
          </div>
        </article>`;
    })
    .join("");

  // Expand / collapse on header click
  container.querySelectorAll(".history-item-head").forEach((h) => {
    h.addEventListener("click", (e) => {
      if (e.target.closest(".icon-btn")) return;
      h.parentElement.classList.toggle("open");
    });
  });

  // Delete handlers
  container.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.idx);
      const current = loadHistory();
      const entry = current[idx];
      const label = entry ? `${entry["Employee Name"]} (${entry["Employee Code"]})` : "this entry";
      if (confirm(`Delete submission for ${label}?`)) {
        current.splice(idx, 1);
        saveHistory(current);
        renderHistory();
      }
    });
  });
}

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

    // Save to local history (most-recent first, capped)
    const history = loadHistory();
    history.unshift({ ...data, submittedAt: new Date().toISOString() });
    saveHistory(history.slice(0, HISTORY_MAX));
    renderHistory();

    // Open mail client with pre-filled draft
    window.location.href = buildEmailLink(data);

    // Show feedback
    status.classList.remove("hidden", "error");
    status.classList.add("success");
    status.innerHTML =
      `Saved locally and email draft opened to <strong>${IT_EMAIL}</strong>. ` +
      `Send it from your mail client to complete submission.`;
  });

  form.addEventListener("reset", () => {
    status.classList.add("hidden");
    status.classList.remove("success", "error");
  });

  // Clear-all button
  const clearBtn = document.getElementById("clearHistory");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all locally saved asset submissions? This cannot be undone.")) {
        saveHistory([]);
        renderHistory();
      }
    });
  }

  renderHistory();
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
}

document.addEventListener("DOMContentLoaded", init);
