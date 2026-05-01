const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

console.log("[Nebula] Starting... Node " + process.version);

// Required headers for SharedArrayBuffer + service workers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
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

// Serve UV files from node_modules
function tryServe(pkgName, route) {
  try {
    const base = path.dirname(require.resolve(pkgName + "/package.json"));
    const tryDirs = ["dist", "dist/browser", ""];
    for (const sub of tryDirs) {
      const dir = sub ? path.join(base, sub) : base;
      if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
        app.use(route, express.static(dir));
        console.log("[Nebula] Serving " + pkgName + " from " + dir);
        return;
      }
    }
  } catch (e) {
    console.warn("[Nebula] Cannot serve " + pkgName + ":", e.message);
  }
}

tryServe("@titaniumnetwork-dev/ultraviolet", "/uv");
tryServe("@mercuryworkshop/epoxy-transport", "/epoxy");
tryServe("@mercuryworkshop/bare-mux", "/baremux");

// Dynamic UV config
app.get("/uv/uv.config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
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
