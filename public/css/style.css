*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg:#060810;
  --bg2:#0c0f1a;
  --surface:#0f1220;
  --surface2:#151929;
  --border:rgba(100,130,255,0.12);
  --border-hi:rgba(100,130,255,0.38);
  --accent:#6c7dff;
  --accent2:#a855f7;
  --accent3:#06b6d4;
  --text:#e8ecff;
  --text-dim:#6b7aa1;
  --text-muted:#3a4460;
  --glow:rgba(108,125,255,0.22);
  --red:#ff4d6d;
  --green:#34d399;
  --font-hud:'Orbitron',monospace;
  --font-ui:'Rajdhani',sans-serif;
  --font-body:'Inter',sans-serif;
}

html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-ui);overflow-x:hidden}

/* BG */
#stars{position:fixed;inset:0;z-index:0;pointer-events:none}
.bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(rgba(108,125,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(108,125,255,0.035) 1px,transparent 1px);
  background-size:56px 56px}
.bg-glow{position:fixed;z-index:0;border-radius:50%;filter:blur(130px);pointer-events:none;animation:gdrift 14s ease-in-out infinite alternate}
.glow-1{width:640px;height:640px;background:radial-gradient(circle,rgba(108,125,255,0.13) 0%,transparent 70%);top:-220px;left:-120px}
.glow-2{width:520px;height:520px;background:radial-gradient(circle,rgba(168,85,247,0.11) 0%,transparent 70%);bottom:-160px;right:-100px;animation-delay:-7s}
@keyframes gdrift{from{transform:translate(0,0) scale(1)}to{transform:translate(50px,35px) scale(1.12)}}

/* NAVBAR */
.navbar{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;gap:2rem;padding:0 2rem;height:60px;background:rgba(6,8,16,0.9);backdrop-filter:blur(24px);border-bottom:1px solid var(--border)}
.nav-logo{display:flex;align-items:center;gap:0.45rem;font-family:var(--font-hud);font-size:1rem;font-weight:900;letter-spacing:.18em;color:var(--text);flex-shrink:0}
.logo-icon{color:var(--accent);animation:spin 10s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.nav-links{display:flex;gap:.2rem;flex:1}
.nav-link{font-family:var(--font-ui);font-size:.83rem;font-weight:600;letter-spacing:.08em;color:var(--text-dim);text-decoration:none;padding:.38rem .9rem;border-radius:6px;transition:color .2s,background .2s}
.nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
.nav-link.active{color:var(--accent);background:rgba(108,125,255,0.12)}
.nav-badge{font-family:var(--font-hud);font-size:.6rem;color:var(--text-muted);border:1px solid var(--text-muted);padding:.18rem .45rem;border-radius:4px;letter-spacing:.12em}

/* TABS */
.tab-content{display:none;position:relative;z-index:1;min-height:100vh;padding:88px 2rem 4rem;max-width:1200px;margin:0 auto}
.tab-content.active{display:block}

/* HERO */
.hero{text-align:center;padding:2.5rem 0 3.5rem}
.hero-eyebrow{font-family:var(--font-hud);font-size:.65rem;letter-spacing:.42em;color:var(--accent);margin-bottom:1.4rem}
.hero-title{font-family:var(--font-hud);font-size:clamp(2.2rem,5.5vw,4.5rem);font-weight:900;line-height:1.06;letter-spacing:-.01em;margin-bottom:1.1rem}
.gradient-text{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-family:var(--font-body);font-size:.95rem;color:var(--text-dim);margin-bottom:2.8rem;font-weight:300}

/* SEARCH */
.search-wrapper{max-width:660px;margin:0 auto}
.search-bar{display:flex;align-items:center;background:var(--surface);border:1px solid var(--border-hi);border-radius:12px;padding:0 .5rem 0 1.1rem;gap:.7rem;box-shadow:0 0 40px var(--glow),inset 0 1px 0 rgba(255,255,255,0.04);transition:border-color .3s,box-shadow .3s}
.search-bar:focus-within{border-color:var(--accent);box-shadow:0 0 70px rgba(108,125,255,.32)}
.search-icon{color:var(--text-muted);font-size:1.25rem;flex-shrink:0}
.search-input{flex:1;background:none;border:none;outline:none;color:var(--text);font-family:var(--font-ui);font-size:.98rem;font-weight:500;padding:1rem 0;caret-color:var(--accent)}
.search-input::placeholder{color:var(--text-muted)}
.search-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;cursor:pointer;font-family:var(--font-hud);font-size:.68rem;font-weight:700;letter-spacing:.15em;padding:.65rem 1.3rem;border-radius:8px;transition:opacity .2s,transform .1s;flex-shrink:0;white-space:nowrap}
.search-btn:hover{opacity:.85;transform:scale(1.02)}
.search-btn:active{transform:scale(.97)}
.search-hints{display:flex;gap:.65rem;justify-content:center;margin-top:.75rem;flex-wrap:wrap}
.hint{font-size:.75rem;color:var(--text-muted);font-family:var(--font-body);cursor:pointer;transition:color .2s;padding:.2rem .4rem;border-radius:4px}
.hint:hover{color:var(--accent);background:rgba(108,125,255,0.08)}

/* QUICK LINKS */
.quick-links{padding-top:.5rem}
.section-label{font-family:var(--font-hud);font-size:.6rem;letter-spacing:.36em;color:var(--text-muted);margin-bottom:1rem}
.links-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:.6rem}
.quick-btn{display:flex;flex-direction:column;align-items:center;gap:.45rem;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1.1rem .7rem;color:var(--text-dim);font-family:var(--font-ui);font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s}
.quick-btn:hover{border-color:var(--border-hi);color:var(--text);background:var(--surface2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.qb-icon{font-size:1.3rem;color:var(--accent)}

/* PAGE HEADER */
.page-header{margin-bottom:1.8rem}
.page-title{font-family:var(--font-hud);font-size:2rem;font-weight:900;letter-spacing:.05em;margin-bottom:.35rem}
.page-sub{color:var(--text-dim);font-family:var(--font-body);font-size:.88rem}

/* GAMES */
.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:.9rem}
.game-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .25s}
.game-card:hover{border-color:var(--border-hi);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.5)}
.game-thumb{height:110px;display:flex;align-items:center;justify-content:center;font-size:2.8rem}
.game-info{padding:.8rem .95rem}
.game-name{font-size:.88rem;font-weight:600;margin-bottom:.3rem}
.game-tag{font-family:var(--font-hud);font-size:.55rem;letter-spacing:.14em;color:var(--accent);background:rgba(108,125,255,0.1);padding:.18rem .45rem;border-radius:4px;display:inline-block}

/* APPS */
.apps-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.7rem}
.app-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.4rem .9rem;text-align:center;cursor:pointer;transition:all .2s}
.app-card:hover{border-color:var(--border-hi);transform:translateY(-3px);background:var(--surface2)}
.app-icon{font-size:2rem;margin-bottom:.55rem}
.app-name{font-size:.78rem;color:var(--text-dim);font-weight:500}

/* SETTINGS */
.settings-panel{display:flex;flex-direction:column;gap:1.1rem;max-width:680px}
.setting-group{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.4rem}
.setting-label{font-family:var(--font-hud);font-size:.65rem;letter-spacing:.26em;color:var(--accent);margin-bottom:.35rem}
.setting-desc{font-family:var(--font-body);font-size:.82rem;color:var(--text-dim);margin-bottom:.9rem}
.setting-row{display:flex;gap:.45rem;flex-wrap:wrap}
.setting-input{flex:1;min-width:150px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:.55rem .85rem;color:var(--text);font-family:var(--font-ui);font-size:.86rem;outline:none;transition:border-color .2s}
.setting-input:focus{border-color:var(--accent)}
.setting-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;cursor:pointer;font-family:var(--font-hud);font-size:.65rem;font-weight:700;letter-spacing:.12em;padding:.55rem 1.1rem;border-radius:8px;transition:opacity .2s;white-space:nowrap}
.setting-btn:hover{opacity:.85}

/* PROXY OVERLAY */
.proxy-overlay{position:fixed;inset:0;z-index:999;display:flex;flex-direction:column;background:#000}
.proxy-overlay.hidden{display:none}
.proxy-bar{display:flex;align-items:center;gap:.45rem;padding:.55rem .85rem;background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0}
.proxy-nav-btn{background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:.3rem .65rem;cursor:pointer;font-size:.95rem;transition:background .15s;flex-shrink:0}
.proxy-nav-btn:hover{background:var(--surface2)}
.proxy-url-box{flex:1;font-family:var(--font-body);font-size:.75rem;color:var(--text-dim);background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:.38rem .75rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proxy-newtab-btn{background:var(--surface);border:1px solid var(--border);color:var(--text-dim);border-radius:6px;padding:.3rem .65rem;cursor:pointer;font-size:.9rem;transition:background .15s;flex-shrink:0}
.proxy-newtab-btn:hover{color:var(--accent);background:var(--surface2)}
.proxy-close-btn{background:rgba(255,77,109,.14);border:1px solid rgba(255,77,109,.32);color:var(--red);border-radius:6px;padding:.3rem .85rem;cursor:pointer;font-family:var(--font-hud);font-size:.65rem;font-weight:700;letter-spacing:.1em;transition:background .2s;flex-shrink:0}
.proxy-close-btn:hover{background:rgba(255,77,109,.26)}
.proxy-frame{flex:1;border:none;width:100%}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--surface2);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--text-muted)}

/* FADE IN */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.tab-content.active > *{animation:fadeUp .35s ease both}
.tab-content.active > *:nth-child(2){animation-delay:.07s}
.tab-content.active > *:nth-child(3){animation-delay:.13s}
