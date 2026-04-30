const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

console.log("[Nebula] Starting...");
console.log("[Nebula] Node:", process.version);
console.log("[Nebula] Port:", PORT);

// ── CORS HEADERS ──────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// ── WISP (optional) ───────────────────────────────────────
try {
  const { createServer } = require("wisp-server-node");
  const wisp = createServer({ logLevel: "NONE" });
  server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/wisp/")) wisp.handleUpgrade(req, socket, head);
    else socket.destroy();
  });
  console.log("[Nebula] ✓ Wisp loaded");
} catch (e) {
  console.warn("[Nebula] Wisp skipped:", e.message);
}

// ── SERVE NPM PACKAGE STATIC FILES ────────────────────────
function servePackage(packageName, route) {
  try {
    const pkgJsonPath = require.resolve(packageName + "/package.json");
    const pkgDir = path.dirname(pkgJsonPath);
    const distDir = path.join(pkgDir, "dist");
    const serveDir = fs.existsSync(distDir) ? distDir : pkgDir;
    app.use(route, express.static(serveDir));
    console.log("[Nebula] ✓", packageName, "→", route);
  } catch (e) {
    console.warn("[Nebula] ✗ Could not load", packageName, ":", e.message);
  }
}

servePackage("@titaniumnetwork-dev/ultraviolet", "/uv");
servePackage("@mercuryworkshop/epoxy-transport", "/epoxy");
servePackage("@mercuryworkshop/bare-mux", "/baremux");

// ── UV CONFIG ─────────────────────────────────────────────
app.get("/uv/uv.config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`self.__uv$config = {
  prefix: '/uv/service/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/uv/uv.handler.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
};`);
});

// ── PUBLIC FILES ──────────────────────────────────────────
const publicDir = path.join(__dirname, "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  console.log("[Nebula] ✓ Serving public/");
} else {
  console.error("[Nebula] ✗ public/ folder not found!");
}

// ── HEALTH CHECK ──────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", node: process.version, port: PORT });
});

// ── FALLBACK ──────────────────────────────────────────────
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found — check your public/ folder");
  }
});

// ── START ─────────────────────────────────────────────────
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🌌 Nebula live → http://0.0.0.0:${PORT}\n`);
});

// Catch unhandled errors so the process doesn't die silently
process.on("uncaughtException", (err) => {
  console.error("[Nebula] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[Nebula] Unhandled rejection:", reason);
});
