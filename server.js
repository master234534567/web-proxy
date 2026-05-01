const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

console.log("[Nebula] Starting... Node " + process.version);

// COOP/COEP headers — applied ONLY to UV service worker and config files
// so that SharedArrayBuffer is available in those contexts without breaking
// cross-origin resources on the rest of the site.
const UV_ISOLATED_PATHS = ["/uv/uv.sw.js", "/uv/uv.config.js"];

app.use((req, res, next) => {
  const url = req.url.split("?")[0]; // strip query string
  if (UV_ISOLATED_PATHS.includes(url)) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Wisp WebSocket server
try {
  const { createServer } = require("wisp-server-node");
  const wisp = createServer({ logLevel: "NONE" });
  server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/wisp/")) wisp.handleUpgrade(req, socket, head);
    else socket.destroy();
  });
  console.log("[Nebula] Wisp OK");
} catch (e) {
  console.warn("[Nebula] Wisp skipped:", e.message);
}

// Resolve a package's dist directory, trying a prioritised list of sub-paths.
// Returns the first directory that exists and is non-empty, or null.
function resolvePackageDir(pkgName, candidates) {
  try {
    const base = path.dirname(require.resolve(pkgName + "/package.json"));
    console.log("[Nebula] Resolving " + pkgName + " from base: " + base);
    for (const sub of candidates) {
      const dir = sub ? path.join(base, sub) : base;
      console.log("[Nebula]   checking: " + dir);
      if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
        return dir;
      }
    }
    console.warn("[Nebula] No suitable directory found for " + pkgName);
    return null;
  } catch (e) {
    console.warn("[Nebula] Cannot resolve " + pkgName + ":", e.message);
    return null;
  }
}

// Serve UV dist files from node_modules
function tryServe(pkgName, route, candidates) {
  const dir = resolvePackageDir(pkgName, candidates);
  if (dir) {
    app.use(route, express.static(dir));
    console.log("[Nebula] Serving " + pkgName + " at " + route + " from " + dir);
  }
}

// @titaniumnetwork-dev/ultraviolet: prefer dist/, fall back to dist/browser/
tryServe("@titaniumnetwork-dev/ultraviolet", "/uv", ["dist", "dist/browser", ""]);

// @mercuryworkshop/epoxy-transport: files live in dist/
tryServe("@mercuryworkshop/epoxy-transport", "/epoxy", ["dist", ""]);

// @mercuryworkshop/bare-mux: files live in dist/
tryServe("@mercuryworkshop/bare-mux", "/baremux", ["dist", ""]);

// UV config endpoint — must come AFTER the static middleware so it takes
// precedence over any uv.config.js that might be bundled in the package.
app.get("/uv/uv.config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.send(`self.__uv$config = {
  prefix: "/uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};`);
});

// Public folder (your frontend)
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => res.json({ ok: true, node: process.version }));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("[Nebula] Live on port " + PORT);
});

process.on("uncaughtException", (e) => console.error("[Nebula] Error:", e));
process.on("unhandledRejection", (e) => console.error("[Nebula] Rejection:", e));
