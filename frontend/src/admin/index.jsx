import { useState, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import { setForceLogout } from "./api";
import styles from "./styles";
import { NAV, NAV_GROUPS } from "./constants";
import useSession from "./hooks/useSession";
import LoginPage from "./LoginPage";
import Dashboard from "./panels/Dashboard";
import ProductsPanel from "./panels/ProductsPanel";
import CategoriesPanel from "./panels/CategoriesPanel";
import VehiclesPanel from "./panels/VehiclesPanel";

const PANELS = {
  dashboard:  Dashboard,
  products:   ProductsPanel,
  categories: CategoriesPanel,
  vehicles:   VehiclesPanel,
};

export default function AdminPanel() {
  const { session, login, logout } = useSession();
  setForceLogout(logout);

  const [page, setPage]               = useState("dashboard");
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth <= 768;
      setIsMobile(m);
      setSidebarOpen(!m);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const Panel     = PANELS[page];
  const pageTitle = NAV.find(n => n.id === page)?.label || "Admin";

  // AppToaster siempre es la misma instancia — login y panel comparten el mismo,
  // así los toasts de "Sesión cerrada" y "Bienvenido" no se pierden al cambiar de vista.
  return (
    <>
      <style>{styles}</style>

      {!session
        ? <LoginPage onLogin={login} />
        : (
          <div className="layout">

            {sidebarOpen && isMobile && (
              <div
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 99 }}
                onClick={() => setSidebarOpen(false)}
              />
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
                      <div
                        key={id}
                        className={`nav-item ${page === id ? "active" : ""}`}
                        onClick={() => { setPage(id); if (isMobile) setSidebarOpen(false); }}
                      >
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
                    <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.user.nombre}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>Administrador</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "var(--text3)", cursor: "pointer", display: "flex" }} onClick={() => logout()}>
                    <LogOut size={16} />
                  </div>
                </div>
              </div>
            </nav>

            <div className="main">
              <header className="topbar">
                <button className="btn btn-ghost btn-icon menu-btn" onClick={() => setSidebarOpen(v => !v)}>
                  <Menu size={19} />
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
                <Panel token={session.token} />
              </main>
            </div>

          </div>
        )
      }
    </>
  );
}