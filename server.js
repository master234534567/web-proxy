const express = require('express');
const path = require('path');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve your UI
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve the Ultraviolet Engine files automatically
app.use('/uv/', express.static(uvPath));

// 3. 404 handler to keep things clean
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`PRXY live on port ${PORT}`));
