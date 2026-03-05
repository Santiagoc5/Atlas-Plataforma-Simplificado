import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const getApiBase = () => `http://${window.location.hostname}:8000`;

let _forceLogout = null; // referencia global para forzar logout desde api()

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${getApiBase()}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
};

const api = async (path, options = {}, token = null) => {
  const doRequest = async (tkn) => {
    const headers = { ...(options.headers || {}) };
    if (tkn) headers["Authorization"] = `Bearer ${tkn}`;
    const isFormData = options.body instanceof FormData;
    if (!isFormData) headers["Content-Type"] = "application/json";
    return fetch(`${getApiBase()}${path}`, { ...options, headers });
  };

  let res = await doRequest(token);

  // Token vencido → intentar renovar
  if (res.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      res = await doRequest(newToken); // reintentar con nuevo token
    } catch {
      // Refresh también vencido → forzar logout
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      _forceLogout?.();
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  products: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  category: "M4 6h16M4 10h16M4 14h16M4 18h16",
  vehicle: "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5 M14 17H9m10.56-3a2.5 2.5 0 1 0-4.13 0 M7 17m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 6V4h4v2",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  image: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  offer: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  menu: "M3 12h18M3 6h18M3 18h18",
  arrow: "M19 12H5M12 5l-7 7 7 7",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  warning: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4M12 17h.01",
};

// ─── TOKENS / DESIGN SYSTEM ──────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #080808;
    --bg2:    #0d0d0d;
    --bg3:    #111111;
    --bg4:    #161616;
    --border:  #1c1c1c;
    --border2: #222222;
    --accent:  #e60000;
    --accent2: #ff1a1a;
    --accent-dim: rgba(230,0,0,0.08);
    --accent-glow: rgba(230,0,0,0.35);
    --text:  #ffffff;
    --text2: #888888;
    --text3: #3a3a3a;
    --success: #22c55e;
    --success-dim: rgba(34,197,94,0.1);
    --danger:  #e60000;
    --danger-dim: rgba(230,0,0,0.1);
    --warning: #f59e0b;
    --warning-dim: rgba(245,158,11,0.1);
    --info:    #3b82f6;
    --info-dim: rgba(59,130,246,0.1);
    --radius:    14px;
    --radius-sm: 11px;
    --font: 'Plus Jakarta Sans', sans-serif;
    --sidebar-w: 256px;
    --header-h:  60px;
    --transition: 180ms ease;
  }

  html, body, #root { background: var(--bg) !important; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; line-height: 1.5; }
  img { background: #0a0a0a; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* Noise overlay */
  .noise-layer {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }

  /* Animations */
  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.96);} to{opacity:1;transform:scale(1);} }
  @keyframes pulseRing { 0%{opacity:.6;transform:translateY(-50%) scale(1);} 100%{opacity:0;transform:translateY(-50%) scale(2.2);} }

  .animate-fade  { animation: fadeIn .3s ease both; }
  .animate-scale { animation: scaleIn .22s ease both; }

  /* ── Layout ── */
  .layout { display: flex; height: 100vh; overflow: hidden; position: relative; z-index: 1; }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w); min-width: var(--sidebar-w);
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    transition: transform var(--transition);
    z-index: 100;
  }
  .sidebar.collapsed { transform: translateX(calc(-1 * var(--sidebar-w))); }

  .sidebar-logo {
    padding: 22px 22px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 11px;
  }
  .logo-mark {
    width: 34px; height: 34px;
    background: var(--accent);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 15px; color: white;
    flex-shrink: 0;
    box-shadow: 0 4px 14px var(--accent-glow);
  }
  .logo-text { font-weight: 800; font-size: 15px; letter-spacing: -.01em; }
  .logo-sub  { font-size: 10px; color: var(--text3); font-weight: 500; margin-top: 1px; }

  .sidebar-nav { flex: 1; padding: 10px 0; overflow-y: auto; }
  .nav-group   { margin-bottom: 2px; }
  .nav-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--text3); padding: 14px 22px 5px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 22px; cursor: pointer;
    color: var(--text2); font-size: 13px; font-weight: 500;
    border-left: 2px solid transparent;
    transition: all var(--transition); user-select: none;
  }
  .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
  .nav-item.active {
    color: var(--accent);
    background: var(--accent-dim);
    border-left-color: var(--accent);
  }

  .sidebar-footer { padding: 14px; border-top: 1px solid var(--border); }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    background: var(--bg3); cursor: pointer;
    transition: background var(--transition);
  }
  .user-card:hover { background: var(--bg4); }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 12px; color: white; flex-shrink: 0;
    box-shadow: 0 2px 10px var(--accent-glow);
  }
  .user-name { font-size: 12.5px; font-weight: 700; }
  .user-role { font-size: 10px; color: var(--accent); font-weight: 600; letter-spacing: .03em; }
  .logout-btn {
    margin-left: auto; color: var(--text3); cursor: pointer;
    display: flex; align-items: center; transition: color var(--transition);
  }
  .logout-btn:hover { color: var(--accent); }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
  .topbar {
    height: var(--header-h); min-height: var(--header-h);
    background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 14px;
  }
  .topbar-title { font-size: 15px; font-weight: 700; flex: 1; letter-spacing: -.01em; }
  .menu-btn { display: none !important; }
  .content { flex: 1; overflow-y: auto; padding: 26px; background: var(--bg); }

  /* ── Stats ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
    display: flex; flex-direction: column; gap: 14px;
    transition: border-color var(--transition), transform var(--transition);
    animation: fadeIn .35s ease both;
  }
  .stat-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .stat-value { font-size: 30px; font-weight: 800; line-height: 1; letter-spacing: -.02em; }
  .stat-label { font-size: 11.5px; color: var(--text2); font-weight: 500; }

  /* ── Card ── */
  .card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; animation: fadeIn .28s ease both;
  }
  .card-header {
    padding: 16px 22px; display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .card-title { font-size: 14px; font-weight: 700; flex: 1; letter-spacing: -.01em; }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid var(--border); }
  th {
    padding: 11px 20px; text-align: left;
    font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: var(--text3);
  }
  tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background var(--transition);
    animation: fadeIn .22s ease both;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.02); }
  td { padding: 13px 20px; font-size: 13px; }

  /* ── Inputs ── */
  .input {
    width: 100%;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px 15px;
    color: var(--text); font-family: var(--font); font-size: 14px;
    transition: border-color var(--transition);
    outline: none;
  }
  .input:focus { border-color: rgba(230,0,0,0.5); background: #131313; }
  .input::placeholder { color: var(--text3); }
  select.input { cursor: pointer; background-color: var(--bg3); color-scheme: dark; }
  textarea.input { resize: vertical; min-height: 90px; }

  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: var(--accent);
    text-transform: uppercase; letter-spacing: .07em;
  }
  .form-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .col-span-2  { grid-column: span 2; }
  .col-span-3  { grid-column: span 3; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: var(--radius-sm);
    font-family: var(--font); font-size: 13px; font-weight: 700;
    cursor: pointer; border: none; outline: none;
    transition: all var(--transition); user-select: none; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); }
  .btn-danger { background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(230,0,0,.25); }
  .btn-danger:hover { background: var(--danger); color: white; }
  .btn-sm   { padding: 6px 12px; font-size: 12px; }
  .btn-icon { padding: 8px; }
  .btn:disabled { opacity: .45; cursor: not-allowed; pointer-events: none; }

  /* ── Badges ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700;
  }
  .badge-success { background: var(--success-dim); color: var(--success); }
  .badge-danger  { background: var(--danger-dim);  color: var(--accent); }
  .badge-warning { background: var(--warning-dim); color: var(--warning); }
  .badge-info    { background: var(--info-dim);    color: var(--info); }
  .badge-accent  { background: var(--accent-dim);  color: var(--accent); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px; backdrop-filter: blur(6px);
    animation: fadeIn .2s ease both;
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 18px; width: 100%; max-width: 680px;
    max-height: 90vh; overflow-y: auto;
    animation: scaleIn .2s ease both;
  }
  .modal-lg { max-width: 820px; }
  .modal-header {
    padding: 22px 26px 18px; display: flex; align-items: center;
    justify-content: space-between; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: var(--bg2); z-index: 1;
  }
  .modal-title { font-size: 16px; font-weight: 800; letter-spacing: -.01em; }
  .modal-body  { padding: 22px 26px; display: flex; flex-direction: column; gap: 18px; }
  .modal-footer { padding: 16px 26px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  /* ── Search ── */
  .search-wrap { position: relative; }
  .search-wrap .input { padding-left: 40px; }
  .search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--text3); pointer-events: none; z-index: 1;
    display: flex; align-items: center;
  }

  /* ── Image preview ── */
  .img-preview {
    width: 46px; height: 46px; border-radius: 9px;
    object-fit: cover; background: var(--bg3); border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .no-img {
    width: 46px; height: 46px; border-radius: 9px;
    background: var(--bg3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text3); flex-shrink: 0;
  }

  /* ── Upload zone ── */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius);
    padding: 26px; text-align: center; cursor: pointer;
    transition: all var(--transition); position: relative;
  }
  .upload-zone:hover { border-color: var(--accent); background: var(--accent-dim); }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-zone-text { color: var(--text2); font-size: 13px; }
  .upload-zone-sub  { color: var(--text3); font-size: 12px; margin-top: 4px; }

  /* ── Gallery ── */
  .gallery { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .gallery-thumb {
    position: relative; width: 68px; height: 68px;
    border-radius: 9px; overflow: hidden; border: 1px solid var(--border2);
  }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .gallery-remove {
    position: absolute; top: 3px; right: 3px;
    width: 17px; height: 17px; border-radius: 50%;
    background: rgba(0,0,0,.8); color: white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 10px; border: none; outline: none;
  }

  /* ── Loader ── */
  .spinner {
    width: 20px; height: 20px; border: 2.5px solid var(--border2);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin .55s linear infinite; display: inline-block;
  }
  .skeleton {
    background: linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%);
    background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px;
  }
  .loading-center { display: flex; justify-content: center; align-items: center; padding: 60px; }

  /* ── Toast ── */
  .toast-container { position: fixed; bottom: 22px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    padding: 11px 16px; border-radius: 11px; font-size: 13px; font-weight: 600;
    min-width: 250px; max-width: 360px; border-left: 3px solid;
    animation: slideIn .22s ease both;
    display: flex; align-items: center; gap: 9px;
    box-shadow: 0 10px 36px rgba(0,0,0,.55);
  }
  .toast-success { background: var(--bg2); border: 1px solid var(--border); border-left-color: var(--success); color: var(--success); }
  .toast-error   { background: var(--bg2); border: 1px solid var(--border); border-left-color: var(--accent); color: var(--accent); }
  .toast-info    { background: var(--bg2); border: 1px solid var(--border); border-left-color: var(--info); color: var(--info); }

  /* ── Confirm ── */
  .confirm-modal { max-width: 400px; }
  .confirm-icon {
    width: 50px; height: 50px; border-radius: 50%;
    background: var(--danger-dim); border: 1px solid rgba(230,0,0,.2);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
  }

  /* ── Tags ── */
  .tags-wrap {
    display: flex; flex-wrap: wrap; gap: 6px; padding: 9px 10px;
    background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm);
    transition: border-color var(--transition);
  }
  .tags-wrap:focus-within { border-color: rgba(230,0,0,0.5); }
  .tag-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: var(--accent-dim); color: var(--accent); border-radius: 99px; font-size: 11.5px; font-weight: 600; }
  .tag-chip button { background: none; border: none; cursor: pointer; color: var(--accent); display: flex; align-items: center; padding: 0; }
  .tags-input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; min-width: 120px; font-family: var(--font); }

  /* ── Pagination ── */
  .pagination { display: flex; align-items: center; gap: 4px; padding: 14px 20px; justify-content: flex-end; border-top: 1px solid var(--border); }
  .page-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    border-radius: var(--radius-sm); font-size: 12.5px; cursor: pointer;
    border: 1px solid var(--border); background: transparent; color: var(--text2);
    transition: all var(--transition);
  }
  .page-btn:hover { background: var(--bg3); color: var(--text); }
  .page-btn.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 2px 10px var(--accent-glow); }
  .page-btn:disabled { opacity: .35; cursor: default; }

  /* ── Section label (form sections) ── */
  .section-label {
    font-size: 9.5px; font-weight: 700; color: var(--text3);
    text-transform: uppercase; letter-spacing: .1em;
    padding-bottom: 10px; border-bottom: 1px solid var(--border);
    margin-bottom: 14px;
  }

  /* ── Login ── */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); position: relative; overflow: hidden;
  }
  .login-noise { position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }
  .login-glow {
    position: absolute; border-radius: 50%; filter: blur(130px); opacity: .12; pointer-events: none;
  }
  .login-card {
    position: relative; z-index: 1;
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 18px; padding: 40px 38px;
    width: 100%; max-width: 390px;
    animation: scaleIn .3s ease both;
  }
  .login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; justify-content: center; }
  .login-title { font-size: 24px; font-weight: 800; text-align: center; letter-spacing: -.02em; margin-bottom: 6px; }
  .login-sub { font-size: 13px; color: var(--text2); text-align: center; margin-bottom: 26px; }

  /* ── Empty state ── */
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 10px; color: var(--text3); }
  .empty svg { opacity: .2; }
  .empty p { font-size: 13px; font-weight: 500; }

  /* ── Filters bar ── */
  .filters-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .filters-bar .search-wrap {
    width: 100%;
    position: relative;
    display: block;
  }
  .filters-bar .search-wrap .input {
    width: 100%;
    padding-left: 40px;
  }
  .filters-bar .search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    color: var(--text3);
    pointer-events: none;
    z-index: 1;
  }
  .filters-selects {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  .filters-selects .input {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  @media (min-width: 769px) {
    .filters-bar {
      flex-direction: row;
      align-items: center;
    }
    .filters-bar .search-wrap { flex: 1; }
    .filters-selects { width: auto; flex-shrink: 0; }
    .filters-selects .input { width: 150px; flex: none; }
  }

  /* ── Btn label hide on tiny screens ── */
  .btn-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  @media (max-width: 340px) { .btn-label { display: none; } }

  /* ── Product Card Grid ── */
  .prod-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 14px;
  }

  .prod-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
    animation: fadeIn .3s ease both;
  }
  .prod-card:hover {
    border-color: var(--border2);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(0,0,0,.4);
  }

  .prod-card-img {
    position: relative;
    width: 100%; height: 155px;
    background: #0a0a0a;
    flex-shrink: 0; overflow: hidden;
  }
  .prod-card-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .35s ease;
    display: block;
    background: #0a0a0a;
  }
  .prod-card:hover .prod-card-img img { transform: scale(1.05); }
  .prod-card-no-img {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: #0a0a0a;
  }
  .prod-card-badges {
    position: absolute; top: 8px; left: 8px;
    display: flex; gap: 5px; flex-wrap: wrap;
    pointer-events: none;
  }

  .prod-card-body {
    padding: 13px 14px;
    flex: 1; display: flex; flex-direction: column;
    background: var(--bg3);
  }
  .prod-card-stats {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: auto; padding-top: 10px;
    border-top: 1px solid var(--border);
  }
  .prod-card-actions {
    display: flex; gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    background: var(--bg2);
  }

  @media (max-width: 768px) {
    .prod-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .prod-card-img { height: 110px; }
    .prod-card-body { padding: 9px 10px; }
    .prod-card-body > div:first-child > div:first-child { font-size: 12px; }
    .prod-card-actions { padding: 7px 8px; gap: 5px; }
    .prod-card-actions .btn { font-size: 11px; padding: 6px 4px; gap: 4px; }
  }
  @media (max-width: 400px) {
    .prod-grid { grid-template-columns: 1fr; }
    .prod-card-img { height: 160px; }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cats-grid { grid-template-columns: 1fr !important; }
    .vehs-grid { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 768px) {
    :root { --sidebar-w: 100vw; --header-h: 56px; }
    .sidebar { position: fixed; height: 100vh; width: var(--sidebar-w); max-width: 300px; }
    .sidebar:not(.collapsed) { box-shadow: 0 0 60px rgba(0,0,0,.8); }
    .menu-btn { display: flex !important; }
    .form-grid, .form-grid-3 { grid-template-columns: 1fr; }
    .col-span-2, .col-span-3 { grid-column: span 1; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .content { padding: 14px; }
    .topbar { padding: 0 14px; }
    .topbar-title { font-size: 14px; }
    /* Table → Cards on mobile */
    .mobile-cards table, .mobile-cards thead, .mobile-cards tbody,
    .mobile-cards th, .mobile-cards td, .mobile-cards tr { display: block; }
    .mobile-cards thead tr { display: none; }
    .mobile-cards tbody tr {
      border: 1px solid var(--border); border-radius: 13px;
      margin: 0 0 10px; padding: 14px 16px;
      background: var(--bg3); animation: fadeIn .2s ease both;
    }
    .mobile-cards tbody tr:hover { background: var(--bg3); }
    .mobile-cards td { padding: 4px 0; border: none; font-size: 13px; }
    .mobile-cards td:first-child { padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 8px; }
    .mobile-cards td[data-label]::before {
      content: attr(data-label);
      display: block; font-size: 9.5px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .08em;
      color: var(--text3); margin-bottom: 2px;
    }
    .mobile-cards td.actions-cell { padding-top: 10px; border-top: 1px solid var(--border); margin-top: 6px; }
    /* Filters stack */
    .filters-row { flex-direction: column !important; }
    .filters-row .input { width: 100% !important; }
    /* Modal full screen */
    .modal-overlay { padding: 0; align-items: flex-end; }
    .modal, .modal.modal-lg {
      max-width: 100%; width: 100%; border-radius: 20px 20px 0 0;
      max-height: 92vh;
    }
    /* Pagination compact */
    .pagination { padding: 10px 14px; gap: 3px; }
    .page-btn { width: 28px; height: 28px; font-size: 12px; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .stat-card { padding: 16px; }
    .stat-value { font-size: 26px; }
  }
`;

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
let _toastAdd = null;
const toast = {
  success: (msg) => _toastAdd?.({ type: "success", msg }),
  error: (msg) => _toastAdd?.({ type: "error", msg }),
  info: (msg) => _toastAdd?.({ type: "info", msg }),
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _toastAdd = (t) => {
    const id = Date.now();
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  };
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" && <Icon d={Icons.check} size={16} />}
          {t.type === "error" && <Icon d={Icons.x} size={16} />}
          {t.type === "info" && <Icon d={Icons.warning} size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: "center", gap: 16 }}>
          <div className="confirm-icon">
            <Icon d={Icons.warning} size={24} stroke="var(--danger)" />
          </div>
          <div>
            <div className="modal-title" style={{ marginBottom: 6 }}>¿Confirmar eliminación?</div>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>{message}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !pass) return toast.error("Completa todos los campos");
    setLoading(true);
    try {
      const data = await api("/api/login/", {
        method: "POST",
        body: JSON.stringify({ username, password: pass }),
      });
      onLogin(data);
      toast.success(`Bienvenido, ${data.user.nombre}`);
    } catch (e) {
      toast.error(e?.error || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-noise" />
      <div className="login-glow" style={{ width: 500, height: 500, background: "var(--accent)", top: -180, right: -180 }} />
      <div className="login-glow" style={{ width: 350, height: 350, background: "#3b82f6", bottom: -100, left: -80 }} />

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark" style={{ width: 46, height: 46, fontSize: 20, borderRadius: 12 }}>A</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em" }}>Atlas Admin</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>Panel de Administración</div>
          </div>
        </div>

        <h1 className="login-title">Iniciar <span style={{ color: "var(--accent)" }}>Sesión</span></h1>
        <p className="login-sub">Acceso exclusivo para administradores</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input className="input" type="text" placeholder="admin" value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="input" type="password" placeholder="••••••••" value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 8, justifyContent: "center", height: 46, fontSize: 14, letterSpacing: ".02em", borderRadius: 13 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : "Ingresar al panel"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api("/api/admin/stats/", {}, token).then(setStats).catch(() => {});
  }, [token]);

  const statCards = stats ? [
    { label: "Total Productos", value: stats.total_productos, icon: Icons.box,     color: "var(--info)",    bg: "var(--info-dim)" },
    { label: "En Oferta",       value: stats.en_oferta,       icon: Icons.offer,   color: "var(--accent)",  bg: "var(--accent-dim)" },
    { label: "Sin Stock",       value: stats.sin_stock,       icon: Icons.warning, color: "var(--accent)",  bg: "var(--danger-dim)" },
    { label: "Categorías",      value: stats.total_categorias,icon: Icons.category,color: "var(--success)", bg: "var(--success-dim)" },
    { label: "Usuarios Activos",value: stats.total_usuarios,  icon: Icons.check,   color: "#a855f7",        bg: "rgba(168,85,247,.1)" },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Panel Principal</h2>
        <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>Resumen general de tu catálogo</p>
      </div>
      <div className="stats-grid">
        {!stats ? Array(5).fill(0).map((_, i) => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div>
              <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: 100, height: 14 }} />
            </div>
          </div>
        )) : statCards.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <Icon d={s.icon} size={20} stroke={s.color} />
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <Icon d={Icons.warning} size={18} stroke="var(--warning)" />
          <span className="card-title">Estado del Catálogo</span>
        </div>
        <div style={{ padding: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {stats?.sin_stock > 0 && (
            <div style={{ padding: "10px 16px", background: "var(--danger-dim)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={Icons.warning} size={16} stroke="var(--danger)" />
              <span style={{ fontSize: 13, color: "var(--danger)", fontWeight: 600 }}>{stats.sin_stock} producto(s) sin stock</span>
            </div>
          )}
          {stats?.en_oferta > 0 && (
            <div style={{ padding: "10px 16px", background: "var(--success-dim)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={Icons.check} size={16} stroke="var(--success)" />
              <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>{stats.en_oferta} producto(s) en oferta activa</span>
            </div>
          )}
          {stats && stats.sin_stock === 0 && stats.en_oferta === 0 && (
            <div style={{ padding: "10px 16px", background: "var(--success-dim)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={Icons.check} size={16} stroke="var(--success)" />
              <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>Todo en orden</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TAGS INPUT ───────────────────────────────────────────────────────────────
function TagsInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const addTag = () => {
    const t = input.trim();
    if (!t) return;
    const next = [...tags, t];
    onChange(next.join(", "));
    setInput("");
  };

  const removeTag = (i) => {
    const next = tags.filter((_, idx) => idx !== i);
    onChange(next.join(", "));
  };

  return (
    <div className="tags-wrap" onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
      {tags.map((t, i) => (
        <span key={i} className="tag-chip">
          {t}
          <button onClick={() => removeTag(i)}><Icon d={Icons.x} size={10} /></button>
        </span>
      ))}
      <input className="tags-input" value={input} placeholder="Agregar característica..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} />
    </div>
  );
}

// ─── VEHICLE SELECTOR ─────────────────────────────────────────────────────────
function VehicleSelector({ token, selected, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await api(`/api/admin/vehiculos/?q=${encodeURIComponent(q)}`, {}, token);
      setResults(data.filter((v) => !selected.find((s) => s.id_vehiculo === v.id_vehiculo)));
    } finally { setLoading(false); }
  }, [token, selected]);

  useEffect(() => { const t = setTimeout(() => search(query), 300); return () => clearTimeout(t); }, [query, search]);

  return (
    <div>
      <div className="search-wrap" style={{ marginBottom: 8 }}>
        <div className="search-icon"><Icon d={Icons.search} size={16} /></div>
        <input className="input" placeholder="Buscar vehículos compatibles..." value={query}
          onChange={(e) => setQuery(e.target.value)} />
      </div>
      {loading && <div style={{ fontSize: 12, color: "var(--text3)", padding: "4px 0" }}>Buscando...</div>}
      {results.length > 0 && (
        <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
          {results.slice(0, 6).map((v) => (
            <div key={v.id_vehiculo} style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, transition: "background .15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => { onChange([...selected, v]); setQuery(""); setResults([]); }}>
              {v.nombre_completo}
            </div>
          ))}
        </div>
      )}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selected.map((v) => (
            <span key={v.id_vehiculo} className="badge badge-info" style={{ cursor: "pointer" }}
              onClick={() => onChange(selected.filter((s) => s.id_vehiculo !== v.id_vehiculo))}>
              {v.nombre_completo} <Icon d={Icons.x} size={10} />
            </span>
          ))}
        </div>
      )}
      {selected.length === 0 && <p style={{ fontSize: 12, color: "var(--text3)" }}>Sin vehículos asociados</p>}
    </div>
  );
}

// ─── PRODUCT FORM ─────────────────────────────────────────────────────────────
function ProductForm({ token, product, categorias, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    nombre: product?.nombre || "",
    sku: product?.sku || "",
    precio: product?.precio || "",
    precio_oferta: product?.precio_oferta || "",
    stock: product?.stock ?? "",
    id_categoria: product?.id_categoria || "",
    descripcion: product?.descripcion || "",
    calidad: product?.calidad || "Nacional",
    peso: product?.peso || "",
    dimensiones: product?.dimensiones || "",
    caracteristicas: product?.caracteristicas || "",
    en_oferta: product?.en_oferta || false,
  });
  const [vehiculos, setVehiculos] = useState(product?.vehiculos || []);
  const [mainImg, setMainImg] = useState(null);
  const [extraImgs, setExtraImgs] = useState([]);
  const [existingImgs, setExistingImgs] = useState(product?.imagenes_adicionales || []);
  const [deletingImgId, setDeletingImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDeleteExistingImg = async (imgId) => {
    setDeletingImgId(imgId);
    try {
      await api(`/api/admin/imagenes/${imgId}/eliminar/`, { method: 'DELETE' }, token);
      setExistingImgs((prev) => prev.filter((img) => img.id !== imgId));
      toast.success('Imagen eliminada');
    } catch {
      toast.error('No se pudo eliminar la imagen');
    } finally {
      setDeletingImgId(null);
    }
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.sku.trim()) e.sku = "Requerido";
    if (!form.precio || isNaN(form.precio)) e.precio = "Precio inválido";
    if (form.stock === "" || isNaN(form.stock)) e.stock = "Stock inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "" && v !== null) fd.append(k, v); });
      if (mainImg) fd.append("imagen", mainImg);
      extraImgs.forEach((f) => fd.append("imagenes_adicionales", f));

      let saved;
      if (isEdit) {
        saved = await api(`/api/admin/productos/${product.id_producto}/editar/`, { method: "PATCH", body: fd }, token);
      } else {
        saved = await api("/api/admin/productos/crear/", { method: "POST", body: fd }, token);
      }

      // Associate vehicles
      await api(`/api/admin/productos/${saved.id_producto}/vehiculos/`, {
        method: "POST",
        body: JSON.stringify({ vehiculos: vehiculos.map((v) => v.id_vehiculo) }),
      }, token);

      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (e) {
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, props = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className={`input${errors[key] ? " input-error" : ""}`} value={form[key]}
        onChange={(e) => set(key, e.target.value)} {...props} />
      {errors[key] && <span style={{ fontSize: 11, color: "var(--danger)" }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon d={Icons.x} size={18} /></button>
        </div>
        <div className="modal-body">

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div className="section-label">Información básica</div>
            <div className="form-grid">
              {field("nombre", "Nombre del producto", { placeholder: "Pastillas de freno XC200" })}
              {field("sku", "SKU", { placeholder: "PF-XC-200" })}
            </div>
            <div className="form-grid-3" style={{ marginTop: 4 }}>
              {field("precio", "Precio regular", { type: "number", placeholder: "59.99" })}
              {field("precio_oferta", "Precio de oferta", { type: "number", placeholder: "49.99" })}
              {field("stock", "Stock", { type: "number", placeholder: "100" })}
            </div>
          </div>

          <div>
            <div className="section-label">Detalles</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="input" value={form.id_categoria} onChange={(e) => set("id_categoria", e.target.value)}>
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Calidad</label>
                <select className="input" value={form.calidad} onChange={(e) => set("calidad", e.target.value)}>
                  <option value="Nacional">Nacional</option>
                  <option value="Importado">Importado</option>
                </select>
              </div>
              {field("peso", "Peso (kg)", { type: "number", placeholder: "0.5" })}
              {field("dimensiones", "Dimensiones", { placeholder: "10x5x3 cm" })}
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Descripción</label>
              <textarea className="input" rows={3} value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)} placeholder="Descripción detallada del producto..." />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Características (separadas por coma)</label>
              <TagsInput value={form.caracteristicas} onChange={(v) => set("caracteristicas", v)} />
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: form.en_oferta ? "rgba(230,0,0,0.04)" : "var(--bg3)",
            border: `1px solid ${form.en_oferta ? "rgba(230,0,0,0.2)" : "var(--border)"}`,
            padding: "14px 16px", borderRadius: 13, transition: "all .2s"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>¿En oferta?</div>
              <div style={{ fontSize: 11.5, color: "var(--text2)", marginTop: 2 }}>Aparecerá en la sección de ofertas del catálogo</div>
            </div>
            <div style={{ position: "relative", width: 44, height: 24, cursor: "pointer", flexShrink: 0 }} onClick={() => set("en_oferta", !form.en_oferta)}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: form.en_oferta ? "var(--accent)" : "var(--border2)", transition: "background .2s", boxShadow: form.en_oferta ? "0 0 12px var(--accent-glow)" : "none" }} />
              <div style={{ position: "absolute", top: 3, left: form.en_oferta ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.4)" }} />
            </div>
          </div>

          <div>
            <div className="section-label">Imágenes</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Imagen principal</label>
                <div className="upload-zone">
                  <input type="file" accept="image/*" onChange={(e) => setMainImg(e.target.files[0])} />
                  {mainImg ? (
                    <div>
                      <img src={URL.createObjectURL(mainImg)} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, margin: "0 auto 8px" }} alt="" />
                      <p className="upload-zone-text">{mainImg.name}</p>
                    </div>
                  ) : product?.imagen ? (
                    <div>
                      <img src={product.imagen} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, margin: "0 auto 8px" }} alt="" />
                      <p className="upload-zone-sub">Clic para cambiar</p>
                    </div>
                  ) : (
                    <div>
                      <Icon d={Icons.upload} size={28} stroke="var(--text3)" />
                      <p className="upload-zone-text" style={{ marginTop: 8 }}>Subir imagen principal</p>
                      <p className="upload-zone-sub">PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Imágenes adicionales</label>

                {/* Imágenes ya guardadas */}
                {existingImgs.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      Guardadas ({existingImgs.length})
                    </p>
                    <div className="gallery">
                      {existingImgs.map((img) => (
                        <div key={img.id} className="gallery-thumb" style={{ opacity: deletingImgId === img.id ? 0.4 : 1, transition: "opacity .2s" }}>
                          <img src={img.imagen} alt="" />
                          <button
                            className="gallery-remove"
                            style={{ background: "var(--accent)", width: 20, height: 20 }}
                            onClick={() => handleDeleteExistingImg(img.id)}
                            disabled={deletingImgId === img.id}
                            title="Eliminar imagen"
                          >
                            {deletingImgId === img.id ? "…" : "×"}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
                  </div>
                )}

                {/* Nuevas imágenes a subir */}
                <div className="upload-zone">
                  <input type="file" accept="image/*" multiple onChange={(e) => setExtraImgs([...e.target.files])} />
                  <Icon d={Icons.upload} size={24} stroke="var(--text3)" />
                  <p className="upload-zone-text" style={{ marginTop: 8 }}>
                    {existingImgs.length > 0 ? "Agregar más imágenes" : "Subir galería"}
                  </p>
                  <p className="upload-zone-sub">Selecciona múltiples archivos</p>
                </div>
                {extraImgs.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: "var(--accent)", marginTop: 8, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      Por subir ({extraImgs.length})
                    </p>
                    <div className="gallery">
                      {extraImgs.map((f, i) => (
                        <div key={i} className="gallery-thumb" style={{ border: "1px solid rgba(230,0,0,0.3)" }}>
                          <img src={URL.createObjectURL(f)} alt="" />
                          <button className="gallery-remove" onClick={() => setExtraImgs(extraImgs.filter((_, j) => j !== i))}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="section-label">Vehículos compatibles</div>
            <VehicleSelector token={token} selected={vehiculos} onChange={setVehiculos} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <span className="spinner" /> : <Icon d={Icons.check} size={16} />}
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS PANEL ───────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

function ProductsPanel({ token }) {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterOferta, setFilterOferta] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api("/api/admin/productos/", {}, token),
        api("/api/admin/categorias/", {}, token),
      ]);
      setProducts(p); setCategorias(c);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    const matchC = !filterCat || String(p.id_categoria) === filterCat;
    const matchO = filterOferta === "" ? true : filterOferta === "1" ? p.en_oferta : !p.en_oferta;
    return matchQ && matchC && matchO;
  });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/productos/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Producto eliminado");
      load();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Productos</h2>
          <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>{products.length} productos en catálogo</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Icon d={Icons.plus} size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="filters-bar">
          <div className="search-wrap">
            <div className="search-icon"><Icon d={Icons.search} size={15} /></div>
            <input className="input" placeholder="Buscar por nombre o SKU..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="filters-selects">
            <select className="input" value={filterCat}
              onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">Todas las categorías</option>
              {categorias.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </select>
            <select className="input" value={filterOferta}
              onChange={(e) => { setFilterOferta(e.target.value); setPage(1); }}>
              <option value="">Todo</option>
              <option value="1">En oferta</option>
              <option value="0">Sin oferta</option>
            </select>
          </div>
        </div>

        <div style={{ padding: "14px 16px" }}>
          {loading ? (
            <div className="loading-center"><span className="spinner" /></div>
          ) : paged.length === 0 ? (
            <div className="empty">
              <Icon d={Icons.box} size={48} stroke="var(--text3)" />
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <div className="prod-grid">
              {paged.map((p, i) => (
                <div key={p.id_producto} className="prod-card" style={{ animationDelay: `${i * 40}ms` }}>
                  {/* Image */}
                  <div className="prod-card-img">
                    {p.imagen
                      ? <img src={p.imagen} alt={p.nombre} />
                      : <div className="prod-card-no-img"><Icon d={Icons.image} size={28} stroke="var(--text3)" /></div>}
                    {/* Badges overlay */}
                    <div className="prod-card-badges">
                      {p.en_oferta && <span className="badge badge-accent" style={{ fontSize: 10 }}><Icon d={Icons.offer} size={9} /> Oferta</span>}
                      {p.porcentaje_descuento && <span className="badge" style={{ background: "rgba(230,0,0,.85)", color: "white", fontSize: 10 }}>{p.porcentaje_descuento}</span>}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="prod-card-body">
                    {/* Name + calidad */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25, marginBottom: 4 }}>{p.nombre}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <span className={`badge ${p.calidad === "Importado" ? "badge-info" : "badge-success"}`} style={{ fontSize: 10 }}>{p.calidad}</span>
                        {p.categoria_nombre && <span className="badge" style={{ background: "var(--bg4)", color: "var(--text2)", fontSize: 10 }}>{p.categoria_nombre}</span>}
                      </div>
                    </div>

                    {/* SKU */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>SKU</div>
                      <code style={{ fontSize: 11.5, color: "var(--text2)", background: "var(--bg4)", padding: "2px 7px", borderRadius: 5 }}>{p.sku}</code>
                    </div>

                    {/* Price + Stock row */}
                    <div className="prod-card-stats">
                      <div>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Precio</div>
                        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-.01em" }}>${parseFloat(p.precio).toLocaleString("es-CO")}</div>
                        {p.en_oferta && p.precio_oferta && (
                          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>${parseFloat(p.precio_oferta).toLocaleString("es-CO")} oferta</div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Stock</div>
                        <span className={`badge ${p.stock === 0 ? "badge-danger" : p.stock < 5 ? "badge-warning" : "badge-success"}`} style={{ fontSize: 12, fontWeight: 800 }}>
                          {p.stock === 0 ? "Sin stock" : `${p.stock} uds.`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="prod-card-actions">
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => { setEditing(p); setFormOpen(true); }}
                      style={{ flex: 1, justifyContent: "center", minWidth: 0 }}>
                      <Icon d={Icons.edit} size={13} />
                      <span className="btn-label">Editar</span>
                    </button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => setConfirm(p)}
                      style={{ flex: 1, justifyContent: "center", minWidth: 0 }}>
                      <Icon d={Icons.trash} size={13} />
                      <span className="btn-label">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" disabled={page === pages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        )}
      </div>

      {formOpen && (
        <ProductForm token={token} product={editing} categorias={categorias}
          onClose={() => setFormOpen(false)}
          onSaved={() => { setFormOpen(false); load(); }} />
      )}
      {confirm && (
        <ConfirmDialog
          message={`¿Seguro que quieres eliminar "${confirm.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(confirm.id_producto)}
          onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}

// ─── CATEGORIES PANEL ─────────────────────────────────────────────────────────
function CategoriesPanel({ token }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCats(await api("/api/admin/categorias/", {}, token)); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try {
      await api("/api/admin/categorias/crear/", { method: "POST", body: JSON.stringify({ nombre: name.trim() }) }, token);
      toast.success("Categoría creada");
      setName(""); load();
    } catch (e) { toast.error(e?.nombre?.[0] || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/categorias/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Categoría eliminada"); load();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Categorías</h2>
        <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>Organiza tu catálogo de productos</p>
      </div>
      <div className="cats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        <div className="card animate-fade">
          <div className="card-header">
            <Icon d={Icons.plus} size={16} stroke="var(--accent)" />
            <span className="card-title">Nueva Categoría</span>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="input" placeholder="Ej: Frenos" value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()} />
            </div>
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={handleCreate} disabled={saving}>
              {saving ? <span className="spinner" /> : <Icon d={Icons.plus} size={16} />}
              Crear categoría
            </button>
          </div>
        </div>

        <div className="card animate-fade">
          <div className="card-header">
            <Icon d={Icons.category} size={16} stroke="var(--accent)" />
            <span className="card-title">{cats.length} Categorías</span>
          </div>
          <div className="table-wrap mobile-cards">
            {loading ? <div className="loading-center"><span className="spinner" /></div> :
              cats.length === 0 ? <div className="empty"><Icon d={Icons.tag} size={40} /><p>Sin categorías aún</p></div> : (
                <table>
                  <thead><tr><th>Nombre</th><th style={{ textAlign: "right" }}>Acción</th></tr></thead>
                  <tbody>
                    {cats.map((c) => (
                      <tr key={c.id_categoria}>
                        <td><span style={{ fontWeight: 700, fontSize: 14 }}>{c.nombre}</span></td>
                        <td className="actions-cell"><div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)} style={{ gap: 6 }}>
                            <Icon d={Icons.trash} size={14} /> Eliminar
                          </button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
      {confirm && <ConfirmDialog message={`¿Eliminar la categoría "${confirm.nombre}"?`}
        onConfirm={() => handleDelete(confirm.id_categoria)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── VEHICLES PANEL ───────────────────────────────────────────────────────────
function VehiclesPanel({ token }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setVehicles(await api("/api/admin/vehiculos/", {}, token)); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try {
      await api("/api/admin/vehiculos/crear/", { method: "POST", body: JSON.stringify({ nombre_completo: name.trim() }) }, token);
      toast.success("Vehículo creado"); setName(""); load();
    } catch (e) { toast.error(e?.error || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await api(`/api/admin/vehiculos/${editing.id_vehiculo}/editar/`, { method: "PATCH", body: JSON.stringify({ nombre_completo: editName }) }, token);
      toast.success("Vehículo actualizado"); setEditing(null); load();
    } catch (e) { toast.error(e?.error || "Error"); }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/vehiculos/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Vehículo eliminado"); load();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  const filtered = vehicles.filter((v) => !search || v.nombre_completo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>Vehículos Compatibles</h2>
        <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>Gestiona los modelos de vehículos del catálogo</p>
      </div>
      <div className="vehs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        <div className="card animate-fade">
          <div className="card-header">
            <Icon d={Icons.vehicle} size={16} stroke="var(--accent)" />
            <span className="card-title">Agregar Vehículo</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="input" placeholder="Toyota Hilux 2020" value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()} />
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Formato: Marca, Modelo, Año</span>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
              onClick={handleCreate} disabled={saving}>
              {saving ? <span className="spinner" /> : <Icon d={Icons.plus} size={16} />}
              Agregar
            </button>
          </div>
        </div>

        <div className="card animate-fade">
          <div className="card-header" style={{ gap: 12 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <div className="search-icon"><Icon d={Icons.search} size={15} /></div>
              <input className="input" placeholder="Filtrar vehículos..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{filtered.length} resultados</span>
          </div>
          <div className="table-wrap mobile-cards" style={{ maxHeight: 460, overflowY: "auto" }}>
            {loading ? <div className="loading-center"><span className="spinner" /></div> :
              filtered.length === 0 ? <div className="empty"><Icon d={Icons.vehicle} size={40} /><p>Sin vehículos</p></div> : (
                <table>
                  <thead><tr><th>#</th><th>Nombre</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
                  <tbody>
                    {filtered.map((v) => (
                      <tr key={v.id_vehiculo}>
                        <td style={{ color: "var(--text3)", fontSize: 12 }}>{v.id_vehiculo}</td>
                        <td style={{ fontWeight: 600 }}>{v.nombre_completo}</td>
                        <td className="actions-cell"><div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setEditing(v); setEditName(v.nombre_completo); }}>
                            <Icon d={Icons.edit} size={14} /> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirm(v)}>
                            <Icon d={Icons.trash} size={14} /> Eliminar
                          </button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal animate-scale" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Vehículo</h2>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(null)}><Icon d={Icons.x} size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleEdit}><Icon d={Icons.check} size={16} /> Guardar</button>
            </div>
          </div>
        </div>
      )}

      {confirm && <ConfirmDialog message={`¿Eliminar "${confirm.nombre_completo}"? Se desasociará de todos los productos.`}
        onConfirm={() => handleDelete(confirm.id_vehiculo)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard, group: "Inicio" },
  { id: "products", label: "Productos", icon: Icons.products, group: "Catálogo" },
  { id: "categories", label: "Categorías", icon: Icons.category, group: "Catálogo" },
  { id: "vehicles", label: "Vehículos", icon: Icons.vehicle, group: "Catálogo" },
];

export default function AdminPanel() {
  const [session, setSession] = useState(() => {
    try {
      const u = localStorage.getItem("atlas_session");
      const t = localStorage.getItem("token");
      return u && t ? { user: JSON.parse(u), token: t } : null;
    } catch { return null; }
  });
  const logout = () => {
    localStorage.clear();
    setSession(null);
    toast.info("Sesión cerrada");
  };
  _forceLogout = logout;
  const [page, setPage] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const login = (data) => {
    localStorage.setItem("atlas_session", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh);
    setSession({ user: data.user, token: data.token });
  };

  const groups = NAV.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const pageTitle = NAV.find((n) => n.id === page)?.label || "Admin";

  if (!session) return (
    <>
      <style>{styles}</style>
      <LoginPage onLogin={login} />
      <ToastContainer />
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <div className="noise-layer" />

        {sidebarOpen && isMobile && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 99 }}
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-logo">
            <div className="logo-mark">A</div>
            <div>
              <div className="logo-text">Atlas Admin</div>
              <div className="logo-sub">Panel de Control</div>
            </div>
          </div>
          <div className="sidebar-nav">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="nav-group">
                <div className="nav-label">{group}</div>
                {items.map((item) => (
                  <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`}
                    onClick={() => { setPage(item.id); if (isMobile) setSidebarOpen(false); }}>
                    <Icon d={item.icon} size={17} />
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{session.user.nombre?.[0]?.toUpperCase() || "A"}</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div className="user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.nombre}</div>
                <div className="user-role">Administrador</div>
              </div>
              <div className="logout-btn" onClick={logout} title="Cerrar sesión">
                <Icon d={Icons.logout} size={16} />
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="main">
          <header className="topbar">
            <button className="btn btn-ghost btn-icon menu-btn" onClick={() => setSidebarOpen(v => !v)}>
              <Icon d={Icons.menu} size={19} />
            </button>
            <h1 className="topbar-title">{pageTitle}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{session.user.nombre}</div>
                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, letterSpacing: ".03em" }}>ADMIN</div>
              </div>
              <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                {session.user.nombre?.[0]?.toUpperCase()}
              </div>
            </div>
          </header>

          <main className="content">
            {page === "dashboard" && <Dashboard token={session.token} />}
            {page === "products" && <ProductsPanel token={session.token} />}
            {page === "categories" && <CategoriesPanel token={session.token} />}
            {page === "vehicles" && <VehiclesPanel token={session.token} />}
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}