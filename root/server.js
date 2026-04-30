const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// ── WISP ──────────────────────────────────────────────────
try {
  const { createServer } = require("wisp-server-node");
  const wisp = createServer({ logLevel: "NONE" });
  server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/wisp/")) wisp.handleUpgrade(req, socket, head);
    else socket.destroy();
  });
  console.log("[Nebula] Wisp OK");
} catch (e) {
  console.warn("[Nebula] Wisp skip:", e.message);
}

// ── HEADERS ───────────────────────────────────────────────
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// ── SERVE NPM PACKAGES ────────────────────────────────────
function servePackage(name, route) {
  try {
    const pkgJson = require.resolve(`${name}/package.json`);
    const base = path.dirname(pkgJson);
    const dist = fs.existsSync(path.join(base, "dist"))
      ? path.join(base, "dist")
      : base;
    app.use(route, express.static(dist));
    console.log(`[Nebula] ${name} → ${route}`);
  } catch (e) {
    console.warn(`[Nebula] Cannot serve ${name}:`, e.message);
  }
}

servePackage("@titaniumnetwork-dev/ultraviolet", "/uv");
servePackage("@mercuryworkshop/epoxy-transport", "/epoxy");
servePackage("@mercuryworkshop/bare-mux", "/baremux");

// ── UV CONFIG (override the static one) ───────────────────
app.get("/uv/uv.config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`
self.__uv$config = {
  prefix: '/uv/service/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/uv/uv.handler.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
};
`.trim());
});

// ── PUBLIC ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── HEALTH ────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ ok: true }));

// ── FALLBACK ──────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🌌 Nebula running → http://0.0.0.0:${PORT}\n`);
});
