// Register UV service worker + configure bare-mux transport
// Wrapped in an IIFE to avoid polluting the global scope
(async () => {
  "use strict";

  if (!("serviceWorker" in navigator)) {
    console.warn("[Nebula] Service workers not supported in this browser");
    return;
  }

  try {
    // Register the Ultraviolet service worker at the required scope
    const reg = await navigator.serviceWorker.register("/uv/uv.sw.js", {
      scope: "/uv/service/",
      updateViaCache: "none",
    });

    console.log("[Nebula] Service Worker registered, state:", reg.active ? "active" : "installing");

    // Wait for the service worker to become active before configuring transport
    await new Promise((resolve) => {
      // Already active — nothing to wait for
      if (reg.active && !reg.installing && !reg.waiting) {
        resolve();
        return;
      }

      // A new SW is installing — wait for it to activate
      const sw = reg.installing || reg.waiting;
      if (sw) {
        sw.addEventListener("statechange", function onStateChange(e) {
          if (e.target.state === "activated") {
            sw.removeEventListener("statechange", onStateChange);
            resolve();
          }
        });
      } else {
        // Fallback: listen on the registration itself
        navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true });
      }
    });

    console.log("[Nebula] ✓ Service Worker active at scope /uv/service/");

    // Configure bare-mux to route traffic through epoxy + wisp
    if (typeof BareMux !== "undefined") {
      const wispUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        location.host +
        "/wisp/";

      const conn = new BareMux.BareMuxConnection("/baremux/worker.js");
      await conn.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);

      console.log("[Nebula] ✓ Epoxy transport configured → wisp:", wispUrl);
    } else {
      console.warn("[Nebula] BareMux not found — transport not configured");
    }
  } catch (err) {
    console.error("[Nebula] Service Worker setup failed:", err);
  }
})();
