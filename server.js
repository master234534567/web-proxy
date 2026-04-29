const express = require('express');
const { createServer } = require('node:http');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const BareServer = require('@tomphttp/bare-server-node');
const path = require('node:path');

const app = express();
const server = createServer();
const bare = BareServer.createBareServer('/bare/');

const PORT = process.env.PORT || 3000;

// 1. Serve the frontend UI
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve Ultraviolet engine files
app.use('/uv/', express.static(uvPath));

// 3. Setup the server to handle both Express and the Bare Proxy
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

// CRITICAL: Bind to 0.0.0.0 so Railway can see the app
server.listen(PORT, '0.0.0.0', () => {
    console.log(`PRXY is running on http://0.0.0.0:${PORT}`);
});
