// Nebula — main UI controller
(function () {
  "use strict";

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function log(...args) {
    console.log("[Nebula]", ...args);
  }

  function warn(...args) {
    console.warn("[Nebula]", ...args);
  }

  /** Resolve a raw query/URL string into a full https:// URL */
  function resolveUrl(raw) {
    raw = raw.trim();
    if (!raw) return null;
    // Already a full URL
    if (/^https?:\/\//i.test(raw)) return raw;
    // Looks like a domain (contains a dot, no spaces)
    if (/^[^\s]+\.[^\s]+$/.test(raw)) return "https://" + raw;
    // Treat as a Google search
    return "https://www.google.com/search?q=" + encodeURIComponent(raw);
  }

  /** Build a UV proxy URL for the given target URL */
  function buildProxyUrl(targetUrl) {
    if (
      typeof __uv$config === "undefined" ||
      typeof __uv$config.prefix === "undefined" ||
      typeof __uv$config.encodeUrl !== "function"
    ) {
      warn("__uv$config not ready");
      return null;
    }
    return __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
  }

  // ─── Proxy overlay ──────────────────────────────────────────────────────────

  const overlay = document.getElementById("proxy-overlay");
  const frame = document.getElementById("proxy-frame");
  const urlDisplay = document.getElementById("proxy-url-display");

  function openProxy(targetUrl) {
    const proxyUrl = buildProxyUrl(targetUrl);
    if (!proxyUrl) {
      warn("Could not build proxy URL for:", targetUrl);
      return;
    }
    log("Opening proxy →", targetUrl);
    frame.src = proxyUrl;
    if (urlDisplay) urlDisplay.textContent = targetUrl;
    overlay.classList.remove("hidden");
  }

  function closeProxy() {
    overlay.classList.add("hidden");
    frame.src = "about:blank";
    if (urlDisplay) urlDisplay.textContent = "about:blank";
  }

  // Proxy nav controls
  const btnBack = document.getElementById("proxy-back");
  const btnForward = document.getElementById("proxy-forward");
  const btnReload = document.getElementById("proxy-reload");
  const btnClose = document.getElementById("proxy-close");
  const btnNewTab = document.getElementById("proxy-newtab");

  if (btnBack) btnBack.addEventListener("click", () => frame.contentWindow && frame.contentWindow.history.back());
  if (btnForward) btnForward.addEventListener("click", () => frame.contentWindow && frame.contentWindow.history.forward());
  if (btnReload) btnReload.addEventListener("click", () => { frame.src = frame.src; });
  if (btnClose) btnClose.addEventListener("click", closeProxy);
  if (btnNewTab) {
    btnNewTab.addEventListener("click", () => {
      if (frame.src && frame.src !== "about:blank") {
        window.open(frame.src, "_blank", "noopener,noreferrer");
      }
    });
  }

  // ─── Tab switching ───────────────────────────────────────────────────────────

  const tabLinks = document.querySelectorAll("[data-tab]");
  const tabPanels = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.tab;

      tabLinks.forEach((l) => l.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      link.classList.add("active");
      const panel = document.getElementById("tab-" + target);
      if (panel) panel.classList.add("active");

      log("Tab →", target);
    });
  });

  // ─── Search / go ─────────────────────────────────────────────────────────────

  const proxyInput = document.getElementById("proxy-input");
  const goBtn = document.getElementById("go-btn");

  function handleSearch() {
    if (!proxyInput) return;
    const url = resolveUrl(proxyInput.value);
    if (url) openProxy(url);
  }

  if (goBtn) goBtn.addEventListener("click", handleSearch);
  if (proxyInput) {
    proxyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  // ─── Hints ───────────────────────────────────────────────────────────────────

  document.querySelectorAll(".hint").forEach((hint) => {
    hint.addEventListener("click", () => {
      if (proxyInput) {
        proxyInput.value = hint.dataset.q || "";
        proxyInput.focus();
      }
    });
  });

  // ─── Quick links ─────────────────────────────────────────────────────────────

  document.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.url;
      if (url) openProxy(url);
    });
  });

  // ─── Game cards ──────────────────────────────────────────────────────────────

  document.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("click", () => {
      const url = card.dataset.url;
      if (url) openProxy(url);
    });
  });

  // ─── App cards ───────────────────────────────────────────────────────────────

  document.querySelectorAll(".app-card").forEach((card) => {
    card.addEventListener("click", () => {
      const url = card.dataset.url;
      if (url) openProxy(url);
    });
  });

  // ─── Tab cloak ───────────────────────────────────────────────────────────────

  const applyCloakBtn = document.getElementById("apply-cloak-preset");
  if (applyCloakBtn) {
    applyCloakBtn.addEventListener("click", () => {
      const select = document.getElementById("cloak-preset");
      if (!select || !select.value) return;

      const [title, iconUrl] = select.value.split("|");

      // Set page title
      if (title) document.title = title;

      // Set favicon
      if (iconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = iconUrl;
      }

      log("Tab cloak applied:", title, iconUrl);
    });
  }

  // ─── Panic key ───────────────────────────────────────────────────────────────

  const savePanicBtn = document.getElementById("save-panic");
  if (savePanicBtn) {
    savePanicBtn.addEventListener("click", () => {
      const keySelect = document.getElementById("panic-key");
      const urlInput = document.getElementById("panic-url");
      const key = keySelect ? keySelect.value : "Escape";
      const url = urlInput ? urlInput.value.trim() : "";

      localStorage.setItem("nebula-panic-key", key);
      localStorage.setItem("nebula-panic-url", url || "https://classroom.google.com");
      log("Panic key saved:", key, "→", url);
    });
  }

  // Listen for the panic key globally
  document.addEventListener("keydown", (e) => {
    const panicKey = localStorage.getItem("nebula-panic-key");
    if (!panicKey || e.key !== panicKey) return;
    const panicUrl = localStorage.getItem("nebula-panic-url") || "https://classroom.google.com";
    log("Panic key triggered →", panicUrl);
    window.location.replace(panicUrl);
  });

  // Restore saved panic key/url into the settings UI
  (function restorePanicSettings() {
    const savedKey = localStorage.getItem("nebula-panic-key");
    const savedUrl = localStorage.getItem("nebula-panic-url");
    const keySelect = document.getElementById("panic-key");
    const urlInput = document.getElementById("panic-url");
    if (keySelect && savedKey) keySelect.value = savedKey;
    if (urlInput && savedUrl) urlInput.value = savedUrl;
  })();

  // ─── Proxy status ────────────────────────────────────────────────────────────

  const statusDisplay = document.getElementById("status-display");
  if (statusDisplay) {
    if (typeof __uv$config !== "undefined") {
      statusDisplay.textContent = "✓ Ultraviolet ready — prefix: " + __uv$config.prefix;
      statusDisplay.style.color = "var(--accent, #7c3aed)";
    } else {
      statusDisplay.textContent = "⚠ UV config not loaded — proxy may not work";
      statusDisplay.style.color = "#f59e0b";
    }
  }

  log("UI initialised");
})();
