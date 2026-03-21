/**
 * Estilos globales centralizados para el Panel de Administración.
 * Define el sistema de diseño (variables CSS), la estructura principal (Layout),
 * los estilos de componentes genéricos (tarjetas, botones, inputs, modales)
 * y los estilos personalizados para las notificaciones (Toasts).
 */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#080808; --bg2:#0d0d0d; --bg3:#111111; --bg4:#161616;
    --border:#1c1c1c; --border2:#222222;
    --accent:#e60000; --accent2:#ff1a1a; --accent-dim:rgba(230,0,0,0.08); --accent-glow:rgba(230,0,0,0.35);
    --text:#ffffff; --text2:#888888; --text3:#3a3a3a;
    --success:#22c55e; --success-dim:rgba(34,197,94,0.1);
    --danger:#e60000; --danger-dim:rgba(230,0,0,0.1);
    --warning:#f59e0b; --warning-dim:rgba(245,158,11,0.1);
    --info:#3b82f6; --info-dim:rgba(59,130,246,0.1);
    --radius:14px; --radius-sm:11px; --font:'Plus Jakarta Sans',sans-serif;
    --sidebar-w:256px; --header-h:60px; --transition:180ms ease;
  }
  html,body,#root { background:var(--bg) !important; }
  body { background:var(--bg); color:var(--text); font-family:var(--font); font-size:14px; line-height:1.5; }
  img { max-width: 100%; display: block; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .layout { display:flex; height:100vh; overflow:hidden; }
  .sidebar { width:var(--sidebar-w); min-width:var(--sidebar-w); background:var(--bg2); border-right:1px solid var(--border); display:flex; flex-direction:column; z-index:100; transition:transform var(--transition); }
  .sidebar.collapsed { transform:translateX(calc(-1 * var(--sidebar-w))); }
  .sidebar-logo { padding:22px 22px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:11px; }
  .logo-mark { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:15px; color:white; box-shadow:0 4px 14px var(--accent-glow); flex-shrink:0; }
  .sidebar-nav { flex:1; padding:10px 0; overflow-y:auto; }
  .nav-label { font-size:9.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--text3); padding:14px 22px 5px; }
  .nav-item { display:flex; align-items:center; gap:11px; padding:10px 22px; cursor:pointer; color:var(--text2); font-size:13px; font-weight:500; border-left:2px solid transparent; transition:all var(--transition); }
  .nav-item:hover { color:var(--text); background:rgba(255,255,255,0.03); }
  .nav-item.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .sidebar-footer { padding:14px; border-top:1px solid var(--border); }
  .user-card { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--radius-sm); background:var(--bg3); }
  .user-avatar { width:32px; height:32px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; color:white; flex-shrink:0; box-shadow:0 2px 10px var(--accent-glow); }
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .topbar { height:var(--header-h); min-height:var(--header-h); background:var(--bg2); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 24px; gap:14px; }
  .topbar-title { font-size:15px; font-weight:700; flex:1; }
  .content { flex:1; overflow-y:auto; padding:26px; background:var(--bg); }
  .menu-btn { display:none !important; }

  .card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; animation:fadeIn .28s ease both; }
  .card-header { padding:16px 22px; display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border); }
  .card-title { font-size:14px; font-weight:700; flex:1; }
  .card-header .card-title:empty { display:none; }
  .card-header .search-wrap { flex:1; min-width:0; }
  .card-header .search-wrap + span { flex-shrink:0; }
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead tr { border-bottom:1px solid var(--border); }
  th { padding:11px 20px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text3); }
  tbody tr { border-bottom:1px solid var(--border); transition:background var(--transition); animation:fadeIn .22s ease both; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:rgba(255,255,255,0.02); }
  td { padding:13px 20px; font-size:13px; }

  .input { width:100%; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 15px; color:var(--text); font-family:var(--font); font-size:14px; transition:border-color var(--transition); outline:none; }
  .input:focus { border-color:rgba(230,0,0,0.5); background:#131313; }
  .input::placeholder { color:var(--text3); }
  select.input { cursor:pointer; background-color:var(--bg3); color-scheme:dark; }
  textarea.input { resize:vertical; min-height:90px; }
  .fg { display:flex; flex-direction:column; gap:7px; }
  .flabel { font-size:10px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:.07em; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  .btn { display:inline-flex; align-items:center; gap:7px; padding:10px 18px; border-radius:var(--radius-sm); font-family:var(--font); font-size:13px; font-weight:700; cursor:pointer; border:none; outline:none; transition:all var(--transition); user-select:none; white-space:nowrap; }
  .btn-primary { background:var(--accent); color:white; }
  .btn-primary:hover { background:var(--accent2); transform:translateY(-1px); box-shadow:0 6px 20px var(--accent-glow); }
  .btn-ghost { background:transparent; color:var(--text2); border:1px solid var(--border2); }
  .btn-ghost:hover { background:var(--bg3); color:var(--text); }
  .btn-danger { background:var(--danger-dim); color:var(--danger); border:1px solid rgba(230,0,0,.25); }
  .btn-danger:hover { background:var(--danger); color:white; }
  .btn-sm { padding:6px 12px; font-size:12px; }
  .btn-icon { padding:8px; }
  .btn:disabled { opacity:.45; cursor:not-allowed; pointer-events:none; }

  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; font-size:11px; font-weight:700; }
  .badge-success { background:var(--success-dim); color:var(--success); }
  .badge-danger  { background:var(--danger-dim);  color:var(--accent); }
  .badge-warning { background:var(--warning-dim); color:var(--warning); }
  .badge-info    { background:var(--info-dim);    color:var(--info); }
  .badge-accent  { background:var(--accent-dim);  color:var(--accent); }

  .overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(6px); animation:fadeIn .2s ease both; }
  .modal { background:var(--bg2); border:1px solid var(--border2); border-radius:18px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; animation:scaleIn .2s ease both; }
  .modal-lg { max-width:820px; }
  .modal-hdr { padding:22px 26px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg2); z-index:1; }
  .modal-body { padding:22px 26px; display:flex; flex-direction:column; gap:18px; }
  .modal-ftr { padding:16px 26px; border-top:1px solid var(--border); display:flex; gap:10px; justify-content:flex-end; }

  .search-wrap { position:relative; }
  .search-wrap .input { padding-left:40px; }
  .search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--text3); pointer-events:none; display:flex; align-items:center; }
  .upload-zone { border:2px dashed var(--border2); border-radius:var(--radius); padding:26px; text-align:center; cursor:pointer; transition:all var(--transition); position:relative; }
  .upload-zone:hover { border-color:var(--accent); background:var(--accent-dim); }
  .upload-zone input { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .gallery { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .gallery-thumb { position:relative; width:68px; height:68px; border-radius:9px; overflow:hidden; border:1px solid var(--border2); }
  .gallery-thumb img { width:100%; height:100%; object-fit:cover; }
  .gallery-remove { position:absolute; top:3px; right:3px; width:17px; height:17px; border-radius:50%; background:rgba(0,0,0,.8); color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; }
  .spinner { width:20px; height:20px; border:2.5px solid var(--border2); border-top-color:var(--accent); border-radius:50%; animation:spin .55s linear infinite; display:inline-block; }
  .skeleton { background:linear-gradient(90deg,var(--bg3) 25%,var(--bg2) 50%,var(--bg3) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
  .loading-c { display:flex; justify-content:center; align-items:center; padding:60px; }
  .empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px; gap:10px; color:var(--text3); font-size:13px; font-weight:500; }
  .section-lbl { font-size:9.5px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.1em; padding-bottom:10px; border-bottom:1px solid var(--border); margin-bottom:14px; }
  .tags-wrap { display:flex; flex-wrap:wrap; gap:6px; padding:9px 10px; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-sm); transition:border-color var(--transition); }
  .tags-wrap:focus-within { border-color:rgba(230,0,0,0.5); }
  .tag-chip { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:var(--accent-dim); color:var(--accent); border-radius:99px; font-size:11.5px; font-weight:600; }
  .tag-chip button { background:none; border:none; cursor:pointer; color:var(--accent); display:flex; align-items:center; padding:0; }
  .tags-input { background:none; border:none; outline:none; color:var(--text); font-size:13px; min-width:120px; font-family:var(--font); }
  .pagination { display:flex; align-items:center; gap:4px; padding:14px 20px; justify-content:flex-end; border-top:1px solid var(--border); }
  .page-btn { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-sm); font-size:12.5px; cursor:pointer; border:1px solid var(--border); background:transparent; color:var(--text2); transition:all var(--transition); }
  .page-btn:hover { background:var(--bg3); color:var(--text); }
  .page-btn.active { background:var(--accent); color:white; border-color:var(--accent); box-shadow:0 2px 10px var(--accent-glow); }
  .page-btn:disabled { opacity:.35; cursor:default; }
  .filters-bar { display:flex; flex-direction:column; gap:10px; padding:14px 16px; border-bottom:1px solid var(--border); }
  .filters-selects { display:flex; gap:10px; width:100%; }
  .filters-selects .input { min-width:0; }
  .filters-selects .input:first-child { flex:2; }
  .filters-selects .input:last-child  { flex:1; }
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:14px; margin-bottom:24px; }
  .stat-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:20px 22px; display:flex; flex-direction:column; gap:14px; transition:border-color var(--transition),transform var(--transition); animation:fadeIn .35s ease both; }
  .stat-card:hover { border-color:var(--border2); transform:translateY(-1px); }
  .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); position:relative; overflow:hidden; }
  .login-glow { position:absolute; border-radius:50%; filter:blur(130px); opacity:.12; pointer-events:none; }
  .login-card { position:relative; z-index:1; background:var(--bg2); border:1px solid var(--border2); border-radius:18px; padding:40px 38px; width:100%; max-width:390px; animation:scaleIn .3s ease both; }
  .prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:14px; }
  .prod-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; display:flex; flex-direction:column; transition:border-color var(--transition),transform var(--transition),box-shadow var(--transition); animation:fadeIn .3s ease both; }
  .prod-card:hover { border-color:var(--border2); transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,0,0,.4); }
  .prod-card-img { position:relative; width:100%; height:155px; background:#0a0a0a; flex-shrink:0; overflow:hidden; }
  .prod-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .35s ease; display:block; }
  .prod-card:hover .prod-card-img img { transform:scale(1.05); }
  .prod-card-badges { position:absolute; top:8px; left:8px; display:flex; gap:5px; flex-wrap:wrap; pointer-events:none; }
  .prod-card-body { padding:13px 14px; flex:1; display:flex; flex-direction:column; }
  .prod-card-stats { display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto; padding-top:10px; border-top:1px solid var(--border); }
  .prod-card-actions { display:flex; gap:8px; padding:10px 12px; border-top:1px solid var(--border); background:var(--bg2); }

  @media (min-width:769px) {
    .filters-bar { flex-direction:row; align-items:center; }
    .filters-bar .search-wrap { flex:1; }
    .filters-selects { width:auto; }
    .filters-selects .input { width:190px; flex:none; }
  }
  @media (max-width:900px) { .two-col { grid-template-columns:1fr !important; } }
  @media (max-width:1024px) {
    :root { --sidebar-w:100vw; --header-h:56px; }
    .sidebar { position:fixed; height:100vh; max-width:300px; }
    .sidebar:not(.collapsed) { box-shadow:0 0 60px rgba(0,0,0,.8); }
    .menu-btn { display:flex !important; }
    .grid2,.grid3 { grid-template-columns:1fr; }
    .stats-grid { grid-template-columns:1fr 1fr; }
    .content { padding:14px; }
    .topbar { padding:0 14px; }
    .prod-grid { grid-template-columns:1fr 1fr; gap:8px; }
    .prod-card-img { height:110px; }
    .overlay { padding:0; align-items:flex-end; }
    .modal,.modal.modal-lg { max-width:100%; border-radius:20px 20px 0 0; max-height:92vh; }
    .mc table,.mc thead,.mc tbody,.mc th,.mc td,.mc tr { display:block; }
    .mc thead tr { display:none; }
    .mc tbody tr { border:1px solid var(--border); border-radius:13px; margin:0 0 10px; padding:14px 16px; background:var(--bg3); }
    .mc td { padding:4px 0; border:none; }
    .mc td:first-child { padding-bottom:10px; border-bottom:1px solid var(--border); margin-bottom:8px; }
    .mc td[data-label]::before { content:attr(data-label); display:block; font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text3); margin-bottom:2px; }
    .mc td.act { padding-top:10px; border-top:1px solid var(--border); margin-top:6px; }
  }
  @media (max-width:576px) { 
    .prod-grid { grid-template-columns:1fr; } 
    .prod-card-img { height:200px; }
  }
  /* ── Toasts glassmorphism (solo afectan al panel admin) ── */
  @keyframes toastSlideIn  { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastSlideOut { from{opacity:1;transform:translateX(0)}    to{opacity:0;transform:translateX(18px)} }

  .Toastify__toast {
    background: rgba(18, 18, 18, 0.55) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06) !important;
    padding: 13px 16px !important;
    min-height: unset !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
  }
  .Toastify__toast[data-in="true"]  { animation: toastSlideIn  .28s cubic-bezier(.22,.68,0,1.2) both !important; }
  .Toastify__toast[data-in="false"] { animation: toastSlideOut .22s ease forwards !important; }

  .Toastify__toast-body {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    padding: 0 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
  }

  /* Íconos por tipo */
  .Toastify__toast--success .Toastify__toast-icon svg { fill: #22c55e !important; }
  .Toastify__toast--error   .Toastify__toast-icon svg { fill: #e60000 !important; }
  .Toastify__toast--warning .Toastify__toast-icon svg { fill: #f59e0b !important; }
  .Toastify__toast--info    .Toastify__toast-icon svg { fill: #3b82f6 !important; }

  /* Borde izquierdo de color según tipo */
  .Toastify__toast--success { border-left: 3px solid #22c55e !important; }
  .Toastify__toast--error   { border-left: 3px solid #e60000 !important; }
  .Toastify__toast--warning { border-left: 3px solid #f59e0b !important; }
  .Toastify__toast--info    { border-left: 3px solid #3b82f6 !important; }

  /* Barra de progreso */
  .Toastify__progress-bar--success { background: #22c55e !important; opacity: 0.5 !important; }
  .Toastify__progress-bar--error   { background: #e60000 !important; opacity: 0.5 !important; }
  .Toastify__progress-bar--warning { background: #f59e0b !important; opacity: 0.5 !important; }
  .Toastify__progress-bar--info    { background: #3b82f6 !important; opacity: 0.5 !important; }
  .Toastify__progress-bar { height: 2px !important; border-radius: 0 0 14px 14px !important; }

  .logout-btn { color: var(--text3); cursor: pointer; display: flex; transition: color var(--transition); }
  .logout-btn:hover { color: var(--accent); }
`;

export default styles;