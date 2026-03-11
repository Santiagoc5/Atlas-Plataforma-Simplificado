import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard, Package, Tag, Truck, LogOut, Plus, Pencil, Trash2,
  Search, Upload, X, Check, AlertTriangle, Star, Menu, Image,
  ChevronLeft, ChevronRight, Box, Percent
} from "lucide-react";

// ─── API ──────────────────────────────────────────────────────────────────────
const BASE = () => `http://${window.location.hostname}:8000`;
let _forceLogout = null;

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");
  const res = await fetch(`${BASE()}/api/token/refresh/`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
};

const api = async (path, options = {}, token = null) => {
  const doRequest = async (tkn) => {
    const headers = { ...options.headers };
    if (tkn) headers.Authorization = `Bearer ${tkn}`;
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    return fetch(`${BASE()}${path}`, { ...options, headers });
  };
  let res = await doRequest(token);
  if (res.status === 401 && token) {
    try { res = await doRequest(await refreshAccessToken()); }
    catch { toast.error("Sesión expirada."); _forceLogout?.(); throw new Error("expired"); }
  }
  if (!res.ok) { throw await res.json().catch(() => ({})); }
  if (res.status === 204) return null;
  return res.json();
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useSession = () => {
  const [session, setSession] = useState(() => {
    try {
      const u = localStorage.getItem("atlas_session");
      const t = localStorage.getItem("token");
      return u && t ? { user: JSON.parse(u), token: t } : null;
    } catch { return null; }
  });
  const login = (data) => {
    localStorage.setItem("atlas_session", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh);
    setSession({ user: data.user, token: data.token });
  };
  const logout = () => { localStorage.clear(); setSession(null); toast.success("Sesión cerrada"); };
  return { session, login, logout };
};

const useFetch = (path, token) => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api(path, {}, token)); } catch {}
    finally { setLoading(false); }
  }, [path, token]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, reload: load, setData };
};



// ─── STYLES ───────────────────────────────────────────────────────────────────
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
  img { background:#0a0a0a; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  /* Layout */
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

  /* Cards & Tables */
  .card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; animation:fadeIn .28s ease both; }
  .card-header { padding:16px 22px; display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border); }
  .card-title { font-size:14px; font-weight:700; flex:1; }
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead tr { border-bottom:1px solid var(--border); }
  th { padding:11px 20px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--text3); }
  tbody tr { border-bottom:1px solid var(--border); transition:background var(--transition); animation:fadeIn .22s ease both; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:rgba(255,255,255,0.02); }
  td { padding:13px 20px; font-size:13px; }

  /* Forms */
  .input { width:100%; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 15px; color:var(--text); font-family:var(--font); font-size:14px; transition:border-color var(--transition); outline:none; }
  .input:focus { border-color:rgba(230,0,0,0.5); background:#131313; }
  .input::placeholder { color:var(--text3); }
  select.input { cursor:pointer; background-color:var(--bg3); color-scheme:dark; }
  textarea.input { resize:vertical; min-height:90px; }
  .fg { display:flex; flex-direction:column; gap:7px; }
  .flabel { font-size:10px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:.07em; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  /* Buttons */
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

  /* Badges */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; font-size:11px; font-weight:700; }
  .badge-success { background:var(--success-dim); color:var(--success); }
  .badge-danger  { background:var(--danger-dim);  color:var(--accent); }
  .badge-warning { background:var(--warning-dim); color:var(--warning); }
  .badge-info    { background:var(--info-dim);    color:var(--info); }
  .badge-accent  { background:var(--accent-dim);  color:var(--accent); }

  /* Modal */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(6px); animation:fadeIn .2s ease both; }
  .modal { background:var(--bg2); border:1px solid var(--border2); border-radius:18px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; animation:scaleIn .2s ease both; }
  .modal-lg { max-width:820px; }
  .modal-hdr { padding:22px 26px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg2); z-index:1; }
  .modal-body { padding:22px 26px; display:flex; flex-direction:column; gap:18px; }
  .modal-ftr { padding:16px 26px; border-top:1px solid var(--border); display:flex; gap:10px; justify-content:flex-end; }

  /* Misc */
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
  @media (max-width:768px) {
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
  @media (max-width:400px) { .prod-grid { grid-template-columns:1fr; } }
`;

// ─── REUSABLE UI COMPONENTS ───────────────────────────────────────────────────
const Spinner = () => <span className="spinner" />;

const CardHeader = ({ icon, title, children }) => (
  <div className="card-header">
    {icon} <span className="card-title">{title}</span> {children}
  </div>
);

const Modal = ({ title, onClose, children, footer, lg }) => (
  <div className="overlay" onClick={onClose}>
    <div className={`modal${lg ? " modal-lg" : ""}`} onClick={e => e.stopPropagation()}>
      <div className="modal-hdr">
        <h2 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h2>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-ftr">{footer}</div>}
    </div>
  </div>
);

const Field = ({ label, error, children }) => (
  <div className="fg">
    <label className="flabel">{label}</label>
    {children}
    {error && <span style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>}
  </div>
);

const InputField = ({ label, error, value, onChange, ...props }) => (
  <Field label={label} error={error}>
    <input className="input" value={value} onChange={e => onChange(e.target.value)} onWheel={e => e.target.blur()} {...props} />
  </Field>
);

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <Modal title="" onClose={onCancel} footer={
    <><button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
      <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button></>
  }>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--danger-dim)", border: "1px solid rgba(230,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <AlertTriangle size={24} color="var(--danger)" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>¿Confirmar eliminación?</div>
      <p style={{ color: "var(--text2)", fontSize: 13 }}>{message}</p>
    </div>
  </Modal>
);

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="search-wrap">
    <div className="search-icon"><Search size={15} /></div>
    <input className="input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className="empty">{icon}<p>{text}</p></div>
);

const AppToaster = () => (
  <Toaster position="bottom-right" toastOptions={{ style: { background: "#0d0d0d", color: "#fff", border: "1px solid #222", fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" } }} />
);

// ─── TAGS INPUT ───────────────────────────────────────────────────────────────
const TagsInput = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : [];
  const add = () => { const t = input.trim(); if (!t) return; onChange([...tags, t].join(", ")); setInput(""); };
  const remove = (i) => onChange(tags.filter((_, j) => j !== i).join(", "));
  return (
    <div className="tags-wrap" onClick={e => e.currentTarget.querySelector("input")?.focus()}>
      {tags.map((t, i) => (
        <span key={i} className="tag-chip">{t}
          <button onClick={() => remove(i)}><X size={10} /></button>
        </span>
      ))}
      <input className="tags-input" value={input} placeholder="Agregar característica..."
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} />
    </div>
  );
};

// ─── VEHICLE SELECTOR ─────────────────────────────────────────────────────────
const VehicleSelector = ({ token, selected, onChange }) => {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await api(`/api/admin/vehiculos/?q=${encodeURIComponent(q)}`, {}, token);
      setResults(data.filter(v => !selected.find(s => s.id_vehiculo === v.id_vehiculo)));
    } finally { setLoading(false); }
  }, [token, selected]);

  useEffect(() => { const t = setTimeout(() => search(query), 300); return () => clearTimeout(t); }, [query, search]);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar vehículos compatibles..." />
      {loading && <p style={{ fontSize: 12, color: "var(--text3)", padding: "4px 0" }}>Buscando...</p>}
      {results.length > 0 && (
        <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, margin: "8px 0", overflow: "hidden" }}>
          {results.slice(0, 6).map(v => (
            <div key={v.id_vehiculo} style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => { onChange([...selected, v]); setQuery(""); setResults([]); }}>
              {v.nombre_completo}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {selected.length === 0
          ? <p style={{ fontSize: 12, color: "var(--text3)" }}>Sin vehículos asociados</p>
          : selected.map(v => (
              <span key={v.id_vehiculo} className="badge badge-info" style={{ cursor: "pointer" }}
                onClick={() => onChange(selected.filter(s => s.id_vehiculo !== v.id_vehiculo))}>
                {v.nombre_completo} <X size={10} />
              </span>
            ))}
      </div>
    </div>
  );
};

// ─── PRODUCT FORM ─────────────────────────────────────────────────────────────
const ProductForm = ({ token, product, categorias, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState({
    nombre: product?.nombre || "", sku: product?.sku || "",
    precio: product?.precio || "", precio_oferta: product?.precio_oferta || "",
    stock: product?.stock ?? "", id_categoria: product?.id_categoria || "",
    descripcion: product?.descripcion || "", calidad: product?.calidad || "Nacional",
    peso: product?.peso || "", dimensiones: product?.dimensiones || "",
    caracteristicas: product?.caracteristicas || "", en_oferta: product?.en_oferta || false,
  });
  const [vehiculos, setVehiculos]         = useState(product?.vehiculos || []);
  const [mainImg, setMainImg]             = useState(null);
  const [extraImgs, setExtraImgs]         = useState([]);
  const [existingImgs, setExistingImgs]   = useState(product?.imagenes_adicionales || []);
  const [deletingId, setDeletingId]       = useState(null);
  const [loading, setLoading]             = useState(false);
  const [errors, setErrors]               = useState({});

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.sku.trim()) e.sku = "Requerido";
    if (!form.precio || isNaN(form.precio)) e.precio = "Inválido";
    if (form.stock === "" || isNaN(form.stock)) e.stock = "Inválido";

    // Validación: precio oferta debe ser menor al precio regular
    if (form.precio_oferta !== "" && form.precio_oferta !== null) {
      const precioRegular = parseFloat(form.precio);
      const precioOferta  = parseFloat(form.precio_oferta);
      if (!isNaN(precioRegular) && !isNaN(precioOferta)) {
        if (precioOferta >= precioRegular) {
          e.precio_oferta = "El precio de oferta debe ser menor al precio regular";
        }
      }
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const deleteImg = async (imgId) => {
    setDeletingId(imgId);
    try {
      await api(`/api/admin/imagenes/${imgId}/eliminar/`, { method: "DELETE" }, token);
      setExistingImgs(p => p.filter(i => i.id !== imgId));
      toast.success("Imagen eliminada");
    } catch { toast.error("No se pudo eliminar"); }
    finally { setDeletingId(null); }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "" && v !== null) fd.append(k, v); });
      if (mainImg) fd.append("imagen", mainImg);
      extraImgs.forEach(f => fd.append("imagenes_adicionales", f));
      const saved = isEdit
        ? await api(`/api/admin/productos/${product.id_producto}/editar/`, { method: "PATCH", body: fd }, token)
        : await api("/api/admin/productos/crear/", { method: "POST", body: fd }, token);
      await api(`/api/admin/productos/${saved.id_producto}/vehiculos/`, {
        method: "POST", body: JSON.stringify({ vehiculos: vehiculos.map(v => v.id_vehiculo) }),
      }, token);
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  const UploadPreview = ({ file, url, text }) => (
    <div>
      <img src={file ? URL.createObjectURL(file) : url} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, margin: "0 auto 8px", display: "block" }} alt="" />
      <p style={{ color: "var(--text2)", fontSize: 13 }}>{text}</p>
    </div>
  );

  return (
    <Modal title={isEdit ? "Editar Producto" : "Nuevo Producto"} onClose={onClose} lg
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner /> : <Check size={16} />} {isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </>}>

      <div className="section-lbl">Información básica</div>
      <div className="grid2">
        <InputField
          label="Nombre"
          error={errors.nombre}
          value={form.nombre}
          onChange={set("nombre")}
          placeholder="Pastillas de freno XC200"
        />
        <InputField
          label="SKU"
          error={errors.sku}
          value={form.sku}
          onChange={set("sku")}
          placeholder="PF-XC-200"
        />
      </div>
      <div className="grid3">
        <InputField
          label="Precio regular"
          error={errors.precio}
          value={form.precio}
          onChange={set("precio")}
          type="number"
          placeholder="59.99"
        />
        <InputField
          label="Precio oferta"
          error={errors.precio_oferta}
          value={form.precio_oferta}
          onChange={set("precio_oferta")}
          type="number"
          placeholder="49.99"
        />
        <InputField
          label="Stock"
          error={errors.stock}
          value={form.stock}
          onChange={set("stock")}
          type="number"
          placeholder="100"
        />
      </div>

      <div className="section-lbl">Detalles</div>
      <div className="grid2">
        <Field label="Categoría">
          <select className="input" value={form.id_categoria} onChange={e => set("id_categoria")(e.target.value)}>
            <option value="">Sin categoría</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>
        </Field>
        <Field label="Calidad">
          <select className="input" value={form.calidad} onChange={e => set("calidad")(e.target.value)}>
            <option>Nacional</option><option>Importado</option>
          </select>
        </Field>
        <InputField
          label="Peso (kg)"
          error={errors.peso}
          value={form.peso}
          onChange={set("peso")}
          type="number"
          placeholder="0.5"
        />
        <InputField
          label="Dimensiones"
          error={errors.dimensiones}
          value={form.dimensiones}
          onChange={set("dimensiones")}
          placeholder="10x5x3 cm"
        />
      </div>
      <Field label="Descripción">
        <textarea className="input" rows={3} value={form.descripcion} onChange={e => set("descripcion")(e.target.value)} placeholder="Descripción detallada..." />
      </Field>
      <Field label="Características (separadas por coma)">
        <TagsInput value={form.caracteristicas} onChange={set("caracteristicas")} />
      </Field>

      {/* Toggle oferta */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: form.en_oferta ? "rgba(230,0,0,0.04)" : "var(--bg3)", border: `1px solid ${form.en_oferta ? "rgba(230,0,0,0.2)" : "var(--border)"}`, padding: "14px 16px", borderRadius: 13, transition: "all .2s" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>¿En oferta?</div>
          <div style={{ fontSize: 11.5, color: "var(--text2)", marginTop: 2 }}>Aparecerá en la sección de ofertas del catálogo</div>
        </div>
        <div style={{ position: "relative", width: 44, height: 24, cursor: "pointer", flexShrink: 0 }} onClick={() => set("en_oferta")(!form.en_oferta)}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: form.en_oferta ? "var(--accent)" : "var(--border2)", transition: "background .2s" }} />
          <div style={{ position: "absolute", top: 3, left: form.en_oferta ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.4)" }} />
        </div>
      </div>

      <div className="section-lbl">Imágenes</div>
      <div className="grid2">
        <Field label="Imagen principal">
          <div className="upload-zone">
            <input type="file" accept="image/*" onChange={e => setMainImg(e.target.files[0])} />
            {mainImg ? <UploadPreview file={mainImg} text={mainImg.name} /> :
             product?.imagen ? <UploadPreview url={product.imagen} text="Clic para cambiar" /> :
             <div><Upload size={28} color="var(--text3)" /><p style={{ color: "var(--text2)", fontSize: 13, marginTop: 8 }}>Subir imagen principal</p><p style={{ color: "var(--text3)", fontSize: 12 }}>PNG, JPG, WEBP</p></div>}
          </div>
        </Field>
        <Field label="Imágenes adicionales">
          {existingImgs.length > 0 && <>
            <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Guardadas ({existingImgs.length})</p>
            <div className="gallery">
              {existingImgs.map(img => (
                <div key={img.id} className="gallery-thumb" style={{ opacity: deletingId === img.id ? 0.4 : 1 }}>
                  <img src={img.imagen} alt="" />
                  <button className="gallery-remove" style={{ background: "var(--accent)" }} onClick={() => deleteImg(img.id)} disabled={deletingId === img.id}>
                    {deletingId === img.id ? "…" : <X size={9} />}
                  </button>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
          </>}
          <div className="upload-zone">
            <input type="file" accept="image/*" multiple onChange={e => setExtraImgs([...e.target.files])} />
            <Upload size={24} color="var(--text3)" />
            <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 8 }}>Subir galería</p>
            <p style={{ color: "var(--text3)", fontSize: 12 }}>Selecciona múltiples archivos</p>
          </div>
          {extraImgs.length > 0 && (
            <div className="gallery" style={{ marginTop: 8 }}>
              {extraImgs.map((f, i) => (
                <div key={i} className="gallery-thumb" style={{ border: "1px solid rgba(230,0,0,0.3)" }}>
                  <img src={URL.createObjectURL(f)} alt="" />
                  <button className="gallery-remove" onClick={() => setExtraImgs(extraImgs.filter((_, j) => j !== i))}><X size={9} /></button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      <div className="section-lbl">Vehículos compatibles</div>
      <VehicleSelector token={token} selected={vehiculos} onChange={setVehiculos} />
    </Modal>
  );
};

// ─── PRODUCTS PANEL ───────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

const ProductsPanel = ({ token }) => {
  const { data: products, loading, reload } = useFetch("/api/admin/productos/", token);
  const { data: categorias }                = useFetch("/api/admin/categorias/", token);
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("");
  const [filterOferta, setFilterOferta] = useState("");
  const [page, setPage]             = useState(1);
  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [confirm, setConfirm]       = useState(null);

  const filtered = (products || []).filter(p =>
    (!search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))
    && (!filterCat || String(p.id_categoria) === filterCat)
    && (filterOferta === "" || (filterOferta === "1" ? p.en_oferta : !p.en_oferta))
  );
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    try { await api(`/api/admin/productos/${id}/eliminar/`, { method: "DELETE" }, token); toast.success("Producto eliminado"); reload(); }
    catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Productos</h2>
          <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>{(products || []).length} productos en catálogo</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={16} /> Nuevo Producto</button>
      </div>

      <div className="card">
        <div className="filters-bar">
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar por nombre o SKU..." />
          <div className="filters-selects">
            <select className="input" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">Todas las categorías</option>
              {(categorias || []).map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </select>
            <select className="input" value={filterOferta} onChange={e => { setFilterOferta(e.target.value); setPage(1); }}>
              <option value="">Todo</option><option value="1">En oferta</option><option value="0">Sin oferta</option>
            </select>
          </div>
        </div>

        <div style={{ padding: "14px 16px" }}>
          {loading ? <div className="loading-c"><Spinner /></div> :
           paged.length === 0 ? <EmptyState icon={<Package size={48} />} text="No se encontraron productos" /> : (
            <div className="prod-grid">
              {paged.map((p, i) => (
                <div key={p.id_producto} className="prod-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="prod-card-img">
                    {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={28} color="var(--text3)" /></div>}
                    <div className="prod-card-badges">
                      {p.en_oferta && <span className="badge badge-accent" style={{ background: "rgba(230,0,0,.85)", color: "white", fontSize: 10 }}><Star size={9} /> Oferta</span>}
                      {p.porcentaje_descuento && <span className="badge" style={{ background: "rgba(230,0,0,.85)", color: "white", fontSize: 10 }}>{p.porcentaje_descuento}</span>}
                    </div>
                  </div>
                  <div className="prod-card-body">
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25, marginBottom: 4 }}>{p.nombre}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <span className={`badge ${p.calidad === "Importado" ? "badge-info" : "badge-success"}`} style={{ fontSize: 10 }}>{p.calidad}</span>
                        {p.categoria_nombre && <span className="badge" style={{ background: "var(--bg4)", color: "var(--text2)", fontSize: 10 }}>{p.categoria_nombre}</span>}
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>SKU</div>
                      <code style={{ fontSize: 11.5, color: "var(--text2)", background: "var(--bg4)", padding: "2px 7px", borderRadius: 5 }}>{p.sku}</code>
                    </div>
                    <div className="prod-card-stats">
                      <div>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Precio</div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>${parseFloat(p.precio).toLocaleString("es-CO")}</div>
                        {p.en_oferta && p.precio_oferta && <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>${parseFloat(p.precio_oferta).toLocaleString("es-CO")} oferta</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Stock</div>
                        <span className={`badge ${p.stock === 0 ? "badge-danger" : p.stock < 5 ? "badge-warning" : "badge-success"}`} style={{ fontSize: 12, fontWeight: 800 }}>
                          {p.stock === 0 ? "Sin stock" : `${p.stock} uds.`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="prod-card-actions">
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil size={13} /> Editar</button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirm(p)}><Trash2 size={13} /> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>

      {formOpen && <ProductForm token={token} product={editing} categorias={categorias || []} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); reload(); }} />}
      {confirm && <ConfirmDialog message={`¿Eliminar "${confirm.nombre}"? Esta acción no se puede deshacer.`} onConfirm={() => handleDelete(confirm.id_producto)} onCancel={() => setConfirm(null)} />}
    </div>
  );
};

// ─── CATEGORIES PANEL ─────────────────────────────────────────────────────────
const CategoriesPanel = ({ token }) => {
  const { data: cats, loading, reload } = useFetch("/api/admin/categorias/", token);
  const [name, setName]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [confirm, setConfirm] = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try { await api("/api/admin/categorias/crear/", { method: "POST", body: JSON.stringify({ nombre: name.trim() }) }, token); toast.success("Categoría creada"); setName(""); reload(); }
    catch (e) { toast.error(e?.nombre?.[0] || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api(`/api/admin/categorias/${id}/eliminar/`, { method: "DELETE" }, token); toast.success("Categoría eliminada"); reload(); }
    catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Categorías</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Organiza tu catálogo de productos</p>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        <div className="card">
          <CardHeader icon={<Plus size={16} color="var(--accent)" />} title="Nueva Categoría" />
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField label="Nombre" value={name} onChange={setName} placeholder="Ej: Frenos" onKeyDown={e => e.key === "Enter" && handleCreate()} />
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={handleCreate} disabled={saving}>
              {saving ? <Spinner /> : <Plus size={16} />} Crear categoría
            </button>
          </div>
        </div>
        <div className="card">
          <CardHeader icon={<Tag size={16} color="var(--accent)" />} title={`${(cats || []).length} Categorías`} />
          <div className="table-wrap mc">
            {loading ? <div className="loading-c"><Spinner /></div> :
             !cats?.length ? <EmptyState icon={<Tag size={40} />} text="Sin categorías aún" /> : (
              <table>
                <thead><tr><th>Nombre</th><th style={{ textAlign: "right" }}>Acción</th></tr></thead>
                <tbody>
                  {cats.map(c => (
                    <tr key={c.id_categoria}>
                      <td><span style={{ fontWeight: 700 }}>{c.nombre}</span></td>
                      <td className="act"><div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)}><Trash2 size={14} /> Eliminar</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {confirm && <ConfirmDialog message={`¿Eliminar la categoría "${confirm.nombre}"?`} onConfirm={() => handleDelete(confirm.id_categoria)} onCancel={() => setConfirm(null)} />}
    </div>
  );
};

// ─── VEHICLES PANEL ───────────────────────────────────────────────────────────
const VehiclesPanel = ({ token }) => {
  const { data: vehicles, loading, reload } = useFetch("/api/admin/vehiculos/", token);
  const [search, setSearch]   = useState("");
  const [name, setName]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirm, setConfirm] = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try { await api("/api/admin/vehiculos/crear/", { method: "POST", body: JSON.stringify({ nombre_completo: name.trim() }) }, token); toast.success("Vehículo creado"); setName(""); reload(); }
    catch (e) { toast.error(e?.error || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try { await api(`/api/admin/vehiculos/${editing.id_vehiculo}/editar/`, { method: "PATCH", body: JSON.stringify({ nombre_completo: editName }) }, token); toast.success("Vehículo actualizado"); setEditing(null); reload(); }
    catch (e) { toast.error(e?.error || "Error"); }
  };

  const handleDelete = async (id) => {
    try { await api(`/api/admin/vehiculos/${id}/eliminar/`, { method: "DELETE" }, token); toast.success("Vehículo eliminado"); reload(); }
    catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  const filtered = (vehicles || []).filter(v => !search || v.nombre_completo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Vehículos Compatibles</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Gestiona los modelos de vehículos del catálogo</p>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        <div className="card">
          <CardHeader icon={<Truck size={16} color="var(--accent)" />} title="Agregar Vehículo" />
          <div style={{ padding: "20px 24px" }}>
            <InputField label="Nombre completo" value={name} onChange={setName} placeholder="Toyota Hilux 2020" onKeyDown={e => e.key === "Enter" && handleCreate()} />
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>Formato: Marca, Modelo, Año</p>
            <button className="btn btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={handleCreate} disabled={saving}>
              {saving ? <Spinner /> : <Plus size={16} />} Agregar
            </button>
          </div>
        </div>
        <div className="card">
          <CardHeader icon={<Search size={15} color="var(--accent)" />} title="">
            <div className="search-wrap" style={{ flex: 1 }}>
              <div className="search-icon"><Search size={15} /></div>
              <input className="input" placeholder="Filtrar vehículos..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{filtered.length} resultados</span>
          </CardHeader>
          <div className="table-wrap mc" style={{ maxHeight: 460, overflowY: "auto" }}>
            {loading ? <div className="loading-c"><Spinner /></div> :
             !filtered.length ? <EmptyState icon={<Truck size={40} />} text="Sin vehículos" /> : (
              <table>
                <thead><tr><th>#</th><th>Nombre</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.id_vehiculo}>
                      <td style={{ color: "var(--text3)", fontSize: 12 }}>{v.id_vehiculo}</td>
                      <td style={{ fontWeight: 600 }}>{v.nombre_completo}</td>
                      <td className="act"><div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setEditing(v); setEditName(v.nombre_completo); }}><Pencil size={14} /> Editar</button>
                        <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirm(v)}><Trash2 size={14} /> Eliminar</button>
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
        <Modal title="Editar Vehículo" onClose={() => setEditing(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancelar</button><button className="btn btn-primary" onClick={handleEdit}><Check size={16} /> Guardar</button></>}>
          <InputField label="Nombre completo" value={editName} onChange={setEditName} onKeyDown={e => e.key === "Enter" && handleEdit()} />
        </Modal>
      )}
      {confirm && <ConfirmDialog message={`¿Eliminar "${confirm.nombre_completo}"? Se desasociará de todos los productos.`} onConfirm={() => handleDelete(confirm.id_vehiculo)} onCancel={() => setConfirm(null)} />}
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ token }) => {
  const { data: stats } = useFetch("/api/admin/stats/", token);

  const cards = stats ? [
    { label: "Total Productos",  value: stats.total_productos,  icon: <Box size={20} />,          color: "var(--info)",    bg: "var(--info-dim)" },
    { label: "En Oferta",        value: stats.en_oferta,        icon: <Percent size={20} />,       color: "var(--accent)",  bg: "var(--accent-dim)" },
    { label: "Sin Stock",        value: stats.sin_stock,        icon: <AlertTriangle size={20} />, color: "var(--accent)",  bg: "var(--danger-dim)" },
    { label: "Categorías",       value: stats.total_categorias, icon: <Tag size={20} />,           color: "var(--success)", bg: "var(--success-dim)" },
    { label: "Usuarios Activos", value: stats.total_usuarios,   icon: <Check size={20} />,         color: "#a855f7",        bg: "rgba(168,85,247,.1)" },
  ] : [];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Panel Principal</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Resumen general de tu catálogo</p>
      <div className="stats-grid">
        {!stats
          ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="stat-card">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
                <div><div className="skeleton" style={{ width: 60, height: 28, marginBottom: 6 }} /><div className="skeleton" style={{ width: 100, height: 14 }} /></div>
              </div>
            ))
          : cards.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: s.bg, color: s.color }}>{s.icon}</div>
                <div><div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: 11.5, color: "var(--text2)", fontWeight: 500 }}>{s.label}</div></div>
              </div>
            ))}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <CardHeader icon={<AlertTriangle size={18} color="var(--warning)" />} title="Estado del Catálogo" />
        <div style={{ padding: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            stats?.sin_stock > 0  && { bg: "var(--danger-dim)",  icon: <AlertTriangle size={16} color="var(--danger)" />,  text: `${stats.sin_stock} producto(s) sin stock`,       c: "var(--danger)" },
            stats?.en_oferta > 0  && { bg: "var(--success-dim)", icon: <Check size={16} color="var(--success)" />,          text: `${stats.en_oferta} producto(s) en oferta activa`, c: "var(--success)" },
            stats && !stats.sin_stock && !stats.en_oferta && { bg: "var(--success-dim)", icon: <Check size={16} color="var(--success)" />, text: "Todo en orden", c: "var(--success)" },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ padding: "10px 16px", background: item.bg, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon}<span style={{ fontSize: 13, color: item.c, fontWeight: 600 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [pass, setPass]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!username || !pass) return toast.error("Completa todos los campos");
    setLoading(true);
    try {
      const data = await api("/api/login/", { method: "POST", body: JSON.stringify({ username, password: pass }) });
      onLogin(data); toast.success(`Bienvenido, ${data.user.nombre}`);
    } catch (e) { toast.error(e?.error || "Credenciales incorrectas"); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-glow" style={{ width: 500, height: 500, background: "var(--accent)", top: -180, right: -180 }} />
      <div className="login-glow" style={{ width: 350, height: 350, background: "#3b82f6", bottom: -100, left: -80 }} />
      <div className="login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30, justifyContent: "center" }}>
          <div className="logo-mark" style={{ width: 46, height: 46, fontSize: 20, borderRadius: 12 }}>A</div>
          <div><div style={{ fontWeight: 800, fontSize: 18 }}>Atlas Admin</div><div style={{ fontSize: 11, color: "var(--text3)" }}>Panel de Administración</div></div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>Iniciar <span style={{ color: "var(--accent)" }}>Sesión</span></h1>
        <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 26 }}>Acceso exclusivo para administradores</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Nombre de usuario" value={username} onChange={setUsername} placeholder="admin" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <InputField label="Contraseña" type="password" value={pass} onChange={setPass} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <button className="btn btn-primary" style={{ marginTop: 8, justifyContent: "center", height: 46, fontSize: 14, borderRadius: 13 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner /> : "Ingresar al panel"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  label: "Dashboard",  Icon: LayoutDashboard, group: "Inicio" },
  { id: "products",   label: "Productos",  Icon: Package,         group: "Catálogo" },
  { id: "categories", label: "Categorías", Icon: Tag,             group: "Catálogo" },
  { id: "vehicles",   label: "Vehículos",  Icon: Truck,           group: "Catálogo" },
];
const NAV_GROUPS = NAV.reduce((acc, item) => { (acc[item.group] ??= []).push(item); return acc; }, {});
const PANELS = { dashboard: Dashboard, products: ProductsPanel, categories: CategoriesPanel, vehicles: VehiclesPanel };

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { session, login, logout } = useSession();
  _forceLogout = logout;

  const [page, setPage]               = useState("dashboard");
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const onResize = () => { const m = window.innerWidth <= 768; setIsMobile(m); setSidebarOpen(!m); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const Panel = PANELS[page];
  const pageTitle = NAV.find(n => n.id === page)?.label || "Admin";

  if (!session) return (
    <><style>{styles}</style><LoginPage onLogin={login} /><AppToaster /></>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        {sidebarOpen && isMobile && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
        )}
        <nav className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-logo">
            <div className="logo-mark">A</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Atlas Admin</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>Panel de Control</div>
            </div>
          </div>
          <div className="sidebar-nav">
            {Object.entries(NAV_GROUPS).map(([group, items]) => (
              <div key={group}>
                <div className="nav-label">{group}</div>
                {items.map(({ id, label, Icon }) => (
                  <div key={id} className={`nav-item ${page === id ? "active" : ""}`}
                    onClick={() => { setPage(id); if (isMobile) setSidebarOpen(false); }}>
                    <Icon size={17} /> {label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{session.user.nombre?.[0]?.toUpperCase() || "A"}</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.nombre}</div>
                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>Administrador</div>
              </div>
              <div style={{ marginLeft: "auto", color: "var(--text3)", cursor: "pointer", display: "flex" }} onClick={logout}><LogOut size={16} /></div>
            </div>
          </div>
        </nav>

        <div className="main">
          <header className="topbar">
            <button className="btn btn-ghost btn-icon menu-btn" onClick={() => setSidebarOpen(v => !v)}><Menu size={19} /></button>
            <h1 className="topbar-title">{pageTitle}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{session.user.nombre}</div>
                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, letterSpacing: ".03em" }}>ADMIN</div>
              </div>
              <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{session.user.nombre?.[0]?.toUpperCase()}</div>
            </div>
          </header>
          <main className="content">
            <Panel token={session.token} />
          </main>
        </div>
      </div>
      <AppToaster />
    </>
  );
}