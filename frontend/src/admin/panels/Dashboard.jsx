import { AlertTriangle, Box, Check, Percent, Tag } from "lucide-react";
import useFetch from "../hooks/useFetch";
import CardHeader from "../ui/CardHeader";

const Dashboard = ({ token }) => {
  const { data: stats } = useFetch("/api/admin/stats/", token);

  const cards = stats ? [
    { label: "Total Productos",  value: stats.total_productos,  icon: <Box size={20} />,          color: "var(--info)",    bg: "var(--info-dim)"    },
    { label: "En Oferta",        value: stats.en_oferta,        icon: <Percent size={20} />,       color: "var(--accent)",  bg: "var(--accent-dim)"  },
    { label: "Sin Stock",        value: stats.sin_stock,        icon: <AlertTriangle size={20} />, color: "var(--accent)",  bg: "var(--danger-dim)"  },
    { label: "Categorías",       value: stats.total_categorias, icon: <Tag size={20} />,           color: "var(--success)", bg: "var(--success-dim)" },
    { label: "Usuarios Activos", value: stats.total_usuarios,   icon: <Check size={20} />,         color: "#a855f7",        bg: "rgba(168,85,247,.1)"},
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
                <div>
                  <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: 100, height: 14 }} />
                </div>
              </div>
            ))
          : cards.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text2)", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))
        }
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <CardHeader icon={<AlertTriangle size={18} color="var(--warning)" />} title="Estado del Catálogo" />
        <div style={{ padding: 24, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            stats?.sin_stock > 0  && { bg: "var(--danger-dim)",  icon: <AlertTriangle size={16} color="var(--danger)" />,  text: `${stats.sin_stock} producto(s) sin stock`,        c: "var(--danger)"  },
            stats?.en_oferta > 0  && { bg: "var(--success-dim)", icon: <Check size={16} color="var(--success)" />,          text: `${stats.en_oferta} producto(s) en oferta activa`, c: "var(--success)" },
            stats && !stats.sin_stock && !stats.en_oferta && { bg: "var(--success-dim)", icon: <Check size={16} color="var(--success)" />, text: "Todo en orden", c: "var(--success)" },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ padding: "10px 16px", background: item.bg, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon}
              <span style={{ fontSize: 13, color: item.c, fontWeight: 600 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;