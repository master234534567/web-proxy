const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

console.log("[Nebula] Starting... Node " + process.version);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Wisp WebSocket
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

// Serve UV files - try multiple possible locations
function servePackage(name, route) {
  try {
    const pkgJson = require.resolve(name + "/package.json");
    const base = path.dirname(pkgJson);
    // Try dist first, then root
    const dirs = [
      path.join(base, "dist"),
      path.join(base, "dist", "browser"),
      base
    ];
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        app.use(route, express.static(dir));
        console.log("[Nebula] OK " + name + " -> " + route + " (" + dir + ")");
        return;
      }
    }
  } catch (e) {
    console.warn("[Nebula] SKIP " + name + ": " + e.message);
  }
}

servePackage("@titaniumnetwork-dev/ultraviolet", "/uv");
servePackage("@mercuryworkshop/epoxy-transport", "/epoxy");
servePackage("@mercuryworkshop/bare-mux", "/baremux");

// Log what UV files are actually available
try {
  const uvBase = path.dirname(require.resolve("@titaniumnetwork-dev/ultraviolet/package.json"));
  console.log("[Nebula] UV package dir:", uvBase);
  console.log("[Nebula] UV files:", fs.readdirSync(uvBase).join(", "));
  if (fs.existsSync(path.join(uvBase, "dist"))) {
    console.log("[Nebula] UV dist files:", fs.readdirSync(path.join(uvBase, "dist")).join(", "));
  }
} catch (e) {
  console.warn("[Nebula] Could not inspect UV:", e.message);
}

// UV config
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

// Public
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("[Nebula] Live on port " + PORT);
});

process.on("uncaughtException", (e) => console.error("[Nebula] Error:", e));
process.on("unhandledRejection", (e) => console.error("[Nebula] Rejection:", e));
