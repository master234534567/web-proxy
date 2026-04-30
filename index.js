/* ─── RESET & BASE ──────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #060810;
  --bg2: #0c0f1a;
  --surface: #0f1220;
  --surface2: #151929;
  --border: rgba(100,130,255,0.12);
  --border-bright: rgba(100,130,255,0.35);
  --accent: #6c7dff;
  --accent2: #a855f7;
  --accent3: #06b6d4;
  --text: #e8ecff;
  --text-dim: #6b7aa1;
  --text-muted: #3a4460;
  --glow: rgba(108, 125, 255, 0.25);
  --red: #ff4d6d;
  --green: #34d399;
  --font-display: 'Orbitron', monospace;
  --font-ui: 'Rajdhani', sans-serif;
  --font-body: 'Inter', sans-serif;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
  overflow-x: hidden;
}

/* ─── ANIMATED BACKGROUND ───────────────────────────────── */
#stars {
  position: fixed; inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(108,125,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,125,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.bg-glow {
  position: fixed; z-index: 0;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  animation: glow-drift 12s ease-in-out infinite alternate;
}
.glow-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(108,125,255,0.12) 0%, transparent 70%);
  top: -200px; left: -100px;
}
.glow-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
  bottom: -150px; right: -100px;
  animation-delay: -6s;
}
@keyframes glow-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(40px, 30px) scale(1.1); }
}

/* ─── NAVBAR ────────────────────────────────────────────── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex; align-items: center; gap: 2rem;
  padding: 0 2.5rem;
  height: 64px;
  background: rgba(6, 8, 16, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-logo {
  display: flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--text);
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  color: var(--accent);
  font-size: 1rem;
  animation: spin-slow 8s linear infinite;
}
@keyframes spin-slow { to { transform: rotate(360deg); } }

.nav-links {
  display: flex; gap: 0.25rem;
  flex: 1;
}
.nav-link {
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  text-decoration: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}
.nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
.nav-link.active { color: var(--accent); background: rgba(108,125,255,0.1); }

.nav-badge {
  font-family: var(--font-display);
  font-size: 0.65rem;
  color: var(--text-muted);
  border: 1px solid var(--text-muted);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.1em;
}

/* ─── TAB CONTENT ───────────────────────────────────────── */
.tab-content {
  display: none;
  position: relative; z-index: 1;
  min-height: 100vh;
  padding: 100px 2.5rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}
.tab-content.active { display: block; }

/* ─── HERO ──────────────────────────────────────────────── */
.hero {
  text-align: center;
  padding: 3rem 0 4rem;
}
.hero-eyebrow {
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  color: var(--accent);
  margin-bottom: 1.5rem;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-bottom: 1.2rem;
}
.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-dim);
  margin-bottom: 3rem;
  font-weight: 300;
  letter-spacing: 0.02em;
}

/* ─── SEARCH BAR ────────────────────────────────────────── */
.search-wrapper {
  max-width: 680px;
  margin: 0 auto;
}
.search-bar {
  display: flex; align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-bright);
  border-radius: 12px;
  padding: 0 0.5rem 0 1.2rem;
  gap: 0.75rem;
  box-shadow: 0 0 40px var(--glow), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.search-bar:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 60px rgba(108,125,255,0.35);
}
.search-icon { color: var(--text-muted); font-size: 1.3rem; flex-shrink: 0; }
.search-input {
  flex: 1;
  background: none; border: none; outline: none;
  color: var(--text);
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 500;
  padding: 1.1rem 0;
  caret-color: var(--accent);
}
.search-input::placeholder { color: var(--text-muted); }
.search-btn {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none; cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  transition: opacity 0.2s, transform 0.1s;
  flex-shrink: 0;
}
.search-btn:hover { opacity: 0.85; transform: scale(1.02); }
.search-btn:active { transform: scale(0.98); }

.search-hints {
  display: flex; gap: 0.75rem; justify-content: center;
  margin-top: 0.85rem;
}
.hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-body);
  cursor: pointer;
  transition: color 0.2s;
}
.hint:hover { color: var(--accent); }

/* ─── QUICK LINKS ───────────────────────────────────────── */
.quick-links { padding-top: 1rem; }
.section-label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  color: var(--text-muted);
  margin-bottom: 1.2rem;
}
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}
.quick-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.2rem 0.75rem;
  color: var(--text-dim);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-btn:hover {
  border-color: var(--border-bright);
  color: var(--text);
  background: var(--surface2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.qb-icon { font-size: 1.4rem; color: var(--accent); }

/* ─── PAGE HEADERS ──────────────────────────────────────── */
.page-header { margin-bottom: 2rem; }
.page-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
}
.page-sub { color: var(--text-dim); font-family: var(--font-body); font-size: 0.9rem; }

/* ─── GAMES GRID ────────────────────────────────────────── */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.game-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s;
}
.game-card:hover {
  border-color: var(--border-bright);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}
.game-thumb {
  height: 120px;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem;
}
.game-info { padding: 0.85rem 1rem; }
.game-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.3rem; }
.game-tag {
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  background: rgba(108,125,255,0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* ─── APPS GRID ─────────────────────────────────────────── */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}
.app-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.app-card:hover {
  border-color: var(--border-bright);
  transform: translateY(-3px);
  background: var(--surface2);
}
.app-icon { font-size: 2.2rem; margin-bottom: 0.6rem; }
.app-name { font-size: 0.82rem; color: var(--text-dim); font-weight: 500; }

/* ─── SETTINGS ──────────────────────────────────────────── */
.settings-panel {
  display: flex; flex-direction: column; gap: 1.25rem;
  max-width: 700px;
}
.setting-group {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}
.setting-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-bottom: 0.4rem;
}
.setting-desc {
  font-family: var(--font-body);
  font-size: 0.83rem;
  color: var(--text-dim);
  margin-bottom: 1rem;
}
.setting-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.setting-input {
  flex: 1; min-width: 160px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  color: var(--text);
  font-family: var(--font-ui);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
.setting-input:focus { border-color: var(--accent); }
.setting-btn {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff; border: none; cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: opacity 0.2s;
  white-space: nowrap;
}
.setting-btn:hover { opacity: 0.85; }

/* ─── PROXY OVERLAY ─────────────────────────────────────── */
.proxy-overlay {
  position: fixed; inset: 0; z-index: 999;
  display: flex; flex-direction: column;
  background: #000;
}
.proxy-overlay.hidden { display: none; }

.proxy-bar {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.proxy-nav-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.15s;
  flex-shrink: 0;
}
.proxy-nav-btn:hover { background: var(--surface2); }
.proxy-url-display {
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-dim);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.proxy-close-btn {
  background: rgba(255, 77, 109, 0.15);
  border: 1px solid rgba(255, 77, 109, 0.35);
  color: var(--red);
  border-radius: 6px;
  padding: 0.35rem 0.9rem;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  transition: background 0.2s;
  flex-shrink: 0;
}
.proxy-close-btn:hover { background: rgba(255,77,109,0.28); }
.proxy-frame {
  flex: 1;
  border: none;
  width: 100%;
}

/* ─── SCROLLBAR ─────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* ─── ANIMATIONS ────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tab-content.active > * {
  animation: fadeUp 0.4s ease both;
}
.tab-content.active > *:nth-child(2) { animation-delay: 0.07s; }
.tab-content.active > *:nth-child(3) { animation-delay: 0.14s; }
