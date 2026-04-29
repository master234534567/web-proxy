const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/proxy", async (req, res) => {
  let targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url= parameter");

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  try {
    const proxyRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    const contentType = proxyRes.headers.get("content-type") || "text/html";
    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // If HTML, rewrite links so relative paths and resources resolve through the proxy
    if (contentType.includes("text/html")) {
      let html = await proxyRes.text();
      const base = new URL(targetUrl);
      const origin = base.origin;
      const baseHref = `<base href="${origin}/">`;

      // Inject base tag and a small JS helper to rewrite form actions
      html = html.replace(/<head([^>]*)>/i, `<head$1>${baseHref}`);

      // Strip CSP meta tags so the page renders
      html = html.replace(
        /<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
        ""
      );

      res.send(html);
    } else {
      proxyRes.body.pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <html><body style="font-family:monospace;padding:2rem;background:#0a0a0a;color:#ff4444;">
        <h2>Proxy Error</h2>
        <p>${err.message}</p>
        <p>Some sites block proxy access or require cookies/JS. Try another URL.</p>
        <a href="/" style="color:#888">← Back</a>
      </body></html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
