// ─── STARS ───────────────────────────────────────────────
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
function initStars() {
  stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.006 + 0.002,
  }));
}
function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((s) => {
    const a = 0.25 + 0.5 * Math.sin(t * s.speed + s.phase);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,210,255,${a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
resize(); initStars(); requestAnimationFrame(drawStars);
addEventListener("resize", () => { resize(); initStars(); });

// ─── TABS ────────────────────────────────────────────────
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
    link.classList.add("active");
    document.getElementById("tab-" + link.dataset.tab)?.classList.add("active");
  });
});

// ─── PROXY ENGINE ────────────────────────────────────────
function buildProxyUrl(raw) {
  let url = raw.trim();
  const looksLikeUrl =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(url);

  if (!looksLikeUrl) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  } else if (!/^https?:\/\//.test(url)) {
    url = "https://" + url;
  }

  if (typeof __uv$config !== "undefined" && __uv$config.encodeUrl) {
    return __uv$config.prefix + __uv$config.encodeUrl(url);
  }
  // fallback direct (won't bypass blocks but at least shows something)
  return url;
}

// ─── OVERLAY ────────────────────────────────────────────
const overlay = document.getElementById("proxy-overlay");
const frame = document.getElementById("proxy-frame");
const urlBox = document.getElementById("proxy-url-display");
let currentRawUrl = "";

function openProxy(rawUrl) {
  currentRawUrl = rawUrl;
  urlBox.textContent = rawUrl;
  frame.src = buildProxyUrl(rawUrl);
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProxy() {
  overlay.classList.add("hidden");
  frame.src = "about:blank";
  document.body.style.overflow = "";
  currentRawUrl = "";
}

document.getElementById("proxy-close").addEventListener("click", closeProxy);
document.getElementById("proxy-back").addEventListener("click", () => {
  try { frame.contentWindow.history.back(); } catch (_) {}
});
document.getElementById("proxy-forward").addEventListener("click", () => {
  try { frame.contentWindow.history.forward(); } catch (_) {}
});
document.getElementById("proxy-reload").addEventListener("click", () => {
  frame.src = frame.src;
});
document.getElementById("proxy-newtab").addEventListener("click", () => {
  window.open(buildProxyUrl(currentRawUrl), "_blank");
});

// ─── SEARCH ──────────────────────────────────────────────
function doSearch() {
  const val = document.getElementById("proxy-input").value.trim();
  if (val) openProxy(val);
}
document.getElementById("go-btn").addEventListener("click", doSearch);
document.getElementById("proxy-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});

// Hints
document.querySelectorAll(".hint").forEach((h) => {
  h.addEventListener("click", () => {
    const q = h.dataset.q;
    document.getElementById("proxy-input").value = q;
    openProxy(q);
  });
});

// Quick buttons
document.querySelectorAll(".quick-btn").forEach((btn) => {
  btn.addEventListener("click", () => openProxy(btn.dataset.url));
});
// Games
document.querySelectorAll(".game-card").forEach((card) => {
  card.addEventListener("click", () => openProxy(card.dataset.url));
});
// Apps
document.querySelectorAll(".app-card").forEach((card) => {
  card.addEventListener("click", () => openProxy(card.dataset.url));
});

// ─── SETTINGS ────────────────────────────────────────────
// Cloak preset
document.getElementById("apply-cloak-preset").addEventListener("click", () => {
  const val = document.getElementById("cloak-preset").value;
  if (!val) return;
  const [title, icon] = val.split("|");
  applyCloak(title, icon);
});

// Custom cloak
document.getElementById("apply-cloak").addEventListener("click", () => {
  const title = document.getElementById("cloak-title").value;
  const icon = document.getElementById("cloak-icon").value;
  applyCloak(title, icon);
});

function applyCloak(title, icon) {
  if (title) {
    document.title = title;
    localStorage.setItem("cloak-title", title);
  }
  if (icon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = icon;
    localStorage.setItem("cloak-icon", icon);
  }
}

// Restore cloak on load
const savedTitle = localStorage.getItem("cloak-title");
const savedIcon = localStorage.getItem("cloak-icon");
if (savedTitle) document.title = savedTitle;
if (savedIcon) {
  const link = document.querySelector("link[rel~='icon']");
  if (link) link.href = savedIcon;
}

// Panic key
let panicKey = localStorage.getItem("panic-key") || "Escape";
let panicUrl = localStorage.getItem("panic-url") || "https://classroom.google.com";

const panicKeyEl = document.getElementById("panic-key");
const panicUrlEl = document.getElementById("panic-url");
panicKeyEl.value = panicKey;
panicUrlEl.value = panicUrl;

document.getElementById("save-panic").addEventListener("click", () => {
  panicKey = panicKeyEl.value;
  panicUrl = panicUrlEl.value || "https://classroom.google.com";
  localStorage.setItem("panic-key", panicKey);
  localStorage.setItem("panic-url", panicUrl);
});

document.addEventListener("keydown", (e) => {
  if (e.key === panicKey && !e.ctrlKey && !e.metaKey) {
    window.location.replace(panicUrl);
  }
});

// ─── STATUS CHECK ────────────────────────────────────────
window.addEventListener("load", () => {
  const statusEl = document.getElementById("status-display");
  if (typeof __uv$config !== "undefined") {
    statusEl.innerHTML = `<span style="color:var(--green)">✓ Ultraviolet loaded</span> — Proxy prefix: <code style="color:var(--accent)">${__uv$config.prefix}</code>`;
  } else {
    statusEl.innerHTML = `<span style="color:var(--red)">✗ Ultraviolet not loaded</span> — Check server logs.`;
  }
});
