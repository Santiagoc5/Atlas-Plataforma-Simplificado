import { AlertTriangle, Box, Percent, Tag, Clock, Car } from "lucide-react";
import useFetch from "../hooks/useFetch";
import CardHeader from "../ui/CardHeader";

/**
 * Panel de inicio (Dashboard) para administradores.
 * Muestra métricas clave y el estado general del catálogo con base en datos del backend.
 */
const Dashboard = ({ token }) => {
  const { data: stats } = useFetch("/api/admin/stats/", token);
  const { data: products } = useFetch("/api/admin/productos/", token);

  const cards = stats ? [
    { label: "Total Productos",  value: stats.total_productos,  icon: <Box size={20} />,          color: "var(--info)",    bg: "var(--info-dim)"    },
    { label: "En Oferta",        value: stats.en_oferta,        icon: <Percent size={20} />,       color: "var(--accent)",  bg: "var(--accent-dim)"  },
    { label: "Sin Stock",        value: stats.sin_stock,        icon: <AlertTriangle size={20} />, color: "var(--accent)",  bg: "var(--danger-dim)"  },
    { label: "Categorías",       value: stats.total_categorias, icon: <Tag size={20} />,           color: "var(--success)", bg: "var(--success-dim)" },
    { label: "Vehículos",        value: stats.total_vehiculos,  icon: <Car size={20} />,           color: "#a855f7",        bg: "rgba(168,85,247,.1)"},
  ] : [];

  const agotados = products ? products.filter(p => p.stock === 0) : [];
  const recientes = products ? products.slice(0, 5) : [];

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

      <div className="grid2" style={{ marginTop: 24 }}>
        {/* Productos Agotados */}
        <div className="card">
          <CardHeader icon={<AlertTriangle size={18} color="var(--danger)" />} title="Productos Agotados" />
          <div className="table-wrap mc">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock/ID</th>
                </tr>
              </thead>
              <tbody>
                {!products ? (
                  <tr><td colSpan="2" className="loading-c"><div className="spinner"/></td></tr>
                ) : agotados.length === 0 ? (
                  <tr><td colSpan="2"><div className="empty">Todo el catálogo tiene stock 🎉</div></td></tr>
                ) : (
                  agotados.map(p => (
                    <tr key={p.id_producto}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={p.imagen || "/placeholder.jpg"} alt="" style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover", background: "var(--bg3)" }} />
                          <div style={{ fontWeight: 600, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</div>
                        </div>
                      </td>
                      <td><span className="badge badge-danger">Agotado</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Últimos Productos */}
        <div className="card">
          <CardHeader icon={<Clock size={18} color="var(--info)" />} title="Últimos Añadidos" />
          <div className="table-wrap mc">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {!products ? (
                  <tr><td colSpan="2" className="loading-c"><div className="spinner"/></td></tr>
                ) : recientes.length === 0 ? (
                  <tr><td colSpan="2"><div className="empty">No hay productos aún</div></td></tr>
                ) : (
                  recientes.map(p => (
                    <tr key={p.id_producto}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={p.imagen || "/placeholder.jpg"} alt="" style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover", background: "var(--bg3)" }} />
                          <div style={{ fontWeight: 600, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.nombre}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ${parseFloat(p.precio).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;