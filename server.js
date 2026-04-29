const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const path = require('path');

const app = express();
// Railway will provide the PORT; 3000 is for local testing.
const PORT = process.env.PORT || 3000;

// Serve your frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) return res.status(400).send('No URL provided.');
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const contentType = response.headers.get('content-type') || 'text/html';
        res.setHeader('Content-Type', contentType);

        // If it's a website (HTML), we need to fix the links
        if (contentType.includes('text/html')) {
            let body = await response.text();
            const origin = new URL(targetUrl).origin;
            
            // Inject a <base> tag so images and CSS load from the target site
            const modifiedBody = body.replace(
                '<head>',
                `<head><base href="${origin}/">`
            );
            res.send(modifiedBody);
        } else {
            // For images/scripts, just pipe the raw data
            response.body.pipe(res);
        }
    } catch (error) {
        res.status(500).send('Error fetching site: ' + error.message);
    }
});

// IMPORTANT: Bind to 0.0.0.0 for Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`PRXY is live on port ${PORT}`);
});
