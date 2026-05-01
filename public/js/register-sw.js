// Register UV service worker + configure bare-mux transport
(async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("[Nebula] Service workers not supported");
    return;
  }

  try {
    // Register the UV service worker
    const reg = await navigator.serviceWorker.register("/uv/uv.sw.js", {
      scope: "/uv/service/",
      updateViaCache: "none",
    });

    // Wait for SW to be active
    if (reg.installing) {
      await new Promise((resolve) => {
        reg.installing.addEventListener("statechange", (e) => {
          if (e.target.state === "activated") resolve();
        });
      });
    }

    console.log("[Nebula] ✓ Service Worker active");

    // Configure bare-mux to use Wisp transport
    if (typeof BareMux !== "undefined") {
      const conn = new BareMux.BareMuxConnection("/baremux/worker.js");
      const wispUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        location.host +
        "/wisp/";
      await conn.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
      console.log("[Nebula] ✓ Wisp transport configured →", wispUrl);
    }

  } catch (err) {
    console.warn("[Nebula] SW setup error:", err);
  }
})();
