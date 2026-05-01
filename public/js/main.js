// Nebula — main.js
// Handles tab switching, proxy overlay, search, quick links, and settings
(function () {
  "use strict";

  // ─── Utility ────────────────────────────────────────────────────────────────

  /**
   * Resolve a raw user input (URL or search query) into a full https:// URL.
   * If the input looks like a hostname (contains a dot, no spaces) it is
   * treated as a URL; otherwise it becomes a Google search.
   */
  function resolveUrl(input) {
    input = input.trim();
    if (!input) return null;

    // Already has a scheme
    if (/^https?:\/\//i.test(input)) return input;

    // Looks like a bare hostname — e.g. "youtube.com", "localhost:3000"
    if (/^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(:\d+)?(\/.*)?$/.test(input) && !input.includes(" ")) {
      return "https://" + input;
    }

    // Fall back to a Google search
    return "https://www.google.com/search?q=" + encodeURIComponent(input);
  }

  /**
   * Build a UV proxy URL for the given target URL.
   * Requires __uv$config to be present (loaded by /uv/uv.config.js).
   */
  function buildProxyUrl(targetUrl) {
    if (typeof __uv$config === "undefined") {
      console.error("[Nebula] __uv$config not found — is /uv/uv.config.js loaded?");
      return null;
    }
    return __uv$config.prefix + __uv$config.encodeUrl(targetUrl);
  }

  // ─── Tab switching ───────────────────────────────────────────────────────────

  function initTabs() {
    const navLinks = document.querySelectorAll(".nav-link[data-tab]");
    const tabPanels = document.querySelectorAll(".tab-content");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = link.dataset.tab;

        navLinks.forEach(function (l) { l.classList.remove("active"); });
        tabPanels.forEach(function (p) { p.classList.remove("active"); });

        link.classList.add("active");
        const panel = document.getElementById("tab-" + target);
        if (panel) panel.classList.add("active");
      });
    });
  }

  // ─── Proxy overlay ───────────────────────────────────────────────────────────

  const overlay  = document.getElementById("proxy-overlay");
  const frame    = document.getElementById("proxy-frame");
  const urlDisplay = document.getElementById("proxy-url-display");

  function openProxy(targetUrl) {
    const proxyUrl = buildProxyUrl(targetUrl);
    if (!proxyUrl) {
      alert("Proxy not ready yet — please wait a moment and try again.");
      return;
    }

    frame.src = proxyUrl;
    if (urlDisplay) urlDisplay.textContent = targetUrl;
    overlay.classList.remove("hidden");
    console.log("[Nebula] Opening proxy →", targetUrl);
  }

  function closeProxy() {
    overlay.classList.add("hidden");
    // Clear the iframe to stop any ongoing network activity
    frame.src = "about:blank";
    if (urlDisplay) urlDisplay.textContent = "about:blank";
  }

  function initProxyControls() {
    const btnClose   = document.getElementById("proxy-close");
    const btnBack    = document.getElementById("proxy-back");
    const btnForward = document.getElementById("proxy-forward");
    const btnReload  = document.getElementById("proxy-reload");
    const btnNewTab  = document.getElementById("proxy-newtab");

    if (btnClose)   btnClose.addEventListener("click", closeProxy);

    if (btnBack)    btnBack.addEventListener("click", function () {
      try { frame.contentWindow.history.back(); } catch (e) { /* cross-origin */ }
    });

    if (btnForward) btnForward.addEventListener("click", function () {
      try { frame.contentWindow.history.forward(); } catch (e) { /* cross-origin */ }
    });

    if (btnReload)  btnReload.addEventListener("click", function () {
      try { frame.contentWindow.location.reload(); } catch (e) {
        // If cross-origin reload is blocked, re-set src
        frame.src = frame.src;
      }
    });

    if (btnNewTab)  btnNewTab.addEventListener("click", function () {
      // Open the proxied page in a new blank tab
      const win = window.open("about:blank", "_blank");
      if (win) {
        win.location.href = frame.src;
      }
    });
  }

  // ─── Search bar ──────────────────────────────────────────────────────────────

  function initSearch() {
    const input = document.getElementById("proxy-input");
    const goBtn = document.getElementById("go-btn");

    function launch() {
      if (!input) return;
      const url = resolveUrl(input.value);
      if (url) openProxy(url);
    }

    if (goBtn)  goBtn.addEventListener("click", launch);
    if (input)  input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") launch();
    });

    // Search hint chips
    document.querySelectorAll(".hint[data-q]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const url = resolveUrl(chip.dataset.q);
        if (url) openProxy(url);
      });
    });
  }

  // ─── Quick links ─────────────────────────────────────────────────────────────

  function initQuickLinks() {
    // Home tab quick-access buttons
    document.querySelectorAll(".quick-btn[data-url]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openProxy(btn.dataset.url);
      });
    });

    // Games grid cards
    document.querySelectorAll(".game-card[data-url]").forEach(function (card) {
      card.addEventListener("click", function () {
        openProxy(card.dataset.url);
      });
    });

    // Apps grid cards
    document.querySelectorAll(".app-card[data-url]").forEach(function (card) {
      card.addEventListener("click", function () {
        openProxy(card.dataset.url);
      });
    });
  }

  // ─── Settings ────────────────────────────────────────────────────────────────

  function initSettings() {
    // --- Tab cloak ---
    const cloakPreset  = document.getElementById("cloak-preset");
    const applyCloak   = document.getElementById("apply-cloak-preset");

    // Restore saved cloak on load
    const savedCloak = localStorage.getItem("nebula-cloak");
    if (savedCloak) applyTabCloak(savedCloak);

    if (applyCloak) {
      applyCloak.addEventListener("click", function () {
        const val = cloakPreset ? cloakPreset.value : "";
        if (!val) return;
        localStorage.setItem("nebula-cloak", val);
        applyTabCloak(val);
      });
    }

    // --- Panic key ---
    const panicKeySelect = document.getElementById("panic-key");
    const panicUrlInput  = document.getElementById("panic-url");
    const savePanic      = document.getElementById("save-panic");

    // Restore saved panic settings
    const savedPanicKey = localStorage.getItem("nebula-panic-key") || "Escape";
    const savedPanicUrl = localStorage.getItem("nebula-panic-url") || "https://classroom.google.com";

    if (panicKeySelect) panicKeySelect.value = savedPanicKey;
    if (panicUrlInput)  panicUrlInput.value  = savedPanicUrl;

    if (savePanic) {
      savePanic.addEventListener("click", function () {
        const key = panicKeySelect ? panicKeySelect.value : "Escape";
        const url = panicUrlInput  ? panicUrlInput.value.trim() : "";
        localStorage.setItem("nebula-panic-key", key);
        if (url) localStorage.setItem("nebula-panic-url", url);
        savePanic.textContent = "Saved ✓";
        setTimeout(function () { savePanic.textContent = "Save"; }, 1500);
      });
    }

    // Listen for the panic key globally
    document.addEventListener("keydown", function (e) {
      const key = localStorage.getItem("nebula-panic-key") || "Escape";
      const url = localStorage.getItem("nebula-panic-url") || "https://classroom.google.com";
      if (e.key === key) {
        window.location.replace(url);
      }
    });

    // --- Proxy status ---
    const statusDisplay = document.getElementById("status-display");
    if (statusDisplay) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration("/uv/service/").then(function (reg) {
          if (reg && reg.active) {
            statusDisplay.textContent = "✓ Service Worker active — proxy ready";
            statusDisplay.style.color = "#4ade80";
          } else {
            statusDisplay.textContent = "⚠ Service Worker not yet active — reload if proxy fails";
            statusDisplay.style.color = "#facc15";
          }
        }).catch(function () {
          statusDisplay.textContent = "✗ Could not check service worker status";
          statusDisplay.style.color = "#f87171";
        });
      } else {
        statusDisplay.textContent = "✗ Service workers not supported";
        statusDisplay.style.color = "#f87171";
      }
    }
  }

  /**
   * Apply a tab cloak preset string of the form "Title|faviconUrl".
   */
  function applyTabCloak(preset) {
    if (!preset) return;
    const parts = preset.split("|");
    const title   = parts[0] || "";
    const favicon = parts[1] || "";

    if (title)   document.title = title;

    if (favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon;
    }
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────────

  function init() {
    initTabs();
    initProxyControls();
    initSearch();
    initQuickLinks();
    initSettings();
    console.log("[Nebula] ✓ main.js initialised");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
