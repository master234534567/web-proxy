// Register UV service worker + configure bare-mux transport
(async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("[Nebula] Service workers not supported");
    return;
  }

  try {
    // Register the UV service worker with scope /uv/service/
    const reg = await navigator.serviceWorker.register("/uv/uv.sw.js", {
      scope: "/uv/service/",
      updateViaCache: "none",
    });

    console.log("[Nebula] Service Worker registered");

    // Wait for SW to become active (installing → installed → activated)
    await new Promise((resolve) => {
      const sw = reg.installing || reg.waiting || reg.active;
      if (!sw || sw.state === "activated") {
        resolve();
        return;
      }
      sw.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") resolve();
      });
    });

    console.log("[Nebula] ✓ Service Worker active");

    // Configure bare-mux to use epoxy transport over Wisp
    if (typeof BareMux !== "undefined") {
      const conn = new BareMux.BareMuxConnection("/baremux/worker.js");
      const wispUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        location.host +
        "/wisp/";
      await conn.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
      console.log("[Nebula] ✓ Epoxy transport configured →", wispUrl);
    } else {
      console.warn("[Nebula] BareMux not available — transport not configured");
    }
  } catch (err) {
    console.error("[Nebula] SW setup error:", err);
  }
})();
