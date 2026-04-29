const express = require('express');
const path = require('path');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve your "PRXY" frontend
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve the Ultraviolet engine files (Internal magic)
app.use('/uv/', express.static(uvPath));

// 3. Always serve index.html for any unknown routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
