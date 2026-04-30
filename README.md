# 🌌 Nebula Proxy

A fast, unblocked web proxy powered by **Ultraviolet** and **Wisp**. Built for Railway deployment.

## Features
- 🚀 Ultraviolet proxy engine
- 🎮 Built-in games library
- 🛡️ Tab cloaking & panic key
- ⚡ Wisp WebSocket transport
- 🌌 Dark gaming UI

## Deploy to Railway

1. Push this repo to GitHub
2. In Railway, connect your GitHub repo
3. Railway auto-detects Node.js and runs `npm start`
4. Done — your proxy is live!

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Stack
- **Node.js** + Express
- **@titaniumnetwork-dev/ultraviolet** — proxy engine
- **wisp-server-node** — WebSocket transport
- **Railway** — hosting
