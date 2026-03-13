import { useState } from "react";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Image, Package, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import { PAGE_SIZE } from "../constants";
import SearchInput from "../ui/SearchInput";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";
import ProductForm from "../components/ProductForm";

const ProductsPanel = ({ token }) => {
  const { data: products, loading, reload } = useFetch("/api/admin/productos/", token);
  const { data: categorias }               = useFetch("/api/admin/categorias/", token);

  const [search, setSearch]           = useState("");
  const [filterCat, setFilterCat]     = useState("");
  const [filterOferta, setFilterOferta] = useState("");
  const [page, setPage]               = useState(1);
  const [formOpen, setFormOpen]       = useState(false);
  const [editing, setEditing]         = useState(null);
  const [confirm, setConfirm]         = useState(null);

  const filtered = (products || []).filter(p =>
    (!search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))
    && (!filterCat    || String(p.id_categoria) === filterCat)
    && (filterOferta === "" || (filterOferta === "1" ? p.en_oferta : !p.en_oferta))
  );

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/productos/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Producto eliminado");
      reload();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  return (
    <div>
      {/* ── Encabezado ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Productos</h2>
          <p style={{ color: "var(--text2)", marginTop: 4, fontSize: 13 }}>
            {(products || []).length} productos en catálogo
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="card">
        {/* ── Filtros ── */}
        <div className="filters-bar">
          <SearchInput
            value={search}
            onChange={v => { setSearch(v); setPage(1); }}
            placeholder="Buscar por nombre o SKU..."
          />
          <div className="filters-selects">
            <select className="input" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">Todas las categorías</option>
              {(categorias || []).map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </select>
            <select className="input" value={filterOferta} onChange={e => { setFilterOferta(e.target.value); setPage(1); }}>
              <option value="">Todo</option>
              <option value="1">En oferta</option>
              <option value="0">Sin oferta</option>
            </select>
          </div>
        </div>

        {/* ── Grid de productos ── */}
        <div style={{ padding: "14px 16px" }}>
          {loading
            ? <div className="loading-c"><Spinner /></div>
            : paged.length === 0
              ? <EmptyState icon={<Package size={48} />} text="No se encontraron productos" />
              : (
                <div className="prod-grid">
                  {paged.map((p, i) => (
                    <div key={p.id_producto} className="prod-card" style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="prod-card-img">
                        {p.imagen
                          ? <img src={p.imagen} alt={p.nombre} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Image size={28} color="var(--text3)" />
                            </div>
                        }
                        <div className="prod-card-badges">
                          {p.en_oferta && (
                            <span className="badge badge-accent" style={{ background: "rgba(230,0,0,.85)", color: "white", fontSize: 10 }}>
                              <Star size={9} /> Oferta
                            </span>
                          )}
                          {p.porcentaje_descuento && (
                            <span className="badge" style={{ background: "rgba(230,0,0,.85)", color: "white", fontSize: 10 }}>
                              {p.porcentaje_descuento}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="prod-card-body">
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25, marginBottom: 4 }}>{p.nombre}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <span className={`badge ${p.calidad === "Importado" ? "badge-info" : "badge-success"}`} style={{ fontSize: 10 }}>
                              {p.calidad}
                            </span>
                            {p.categoria_nombre && (
                              <span className="badge" style={{ background: "var(--bg4)", color: "var(--text2)", fontSize: 10 }}>
                                {p.categoria_nombre}
                              </span>
                            )}
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
                            {p.en_oferta && p.precio_oferta && (
                              <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>
                                ${parseFloat(p.precio_oferta).toLocaleString("es-CO")} oferta
                              </div>
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

                      <div className="prod-card-actions">
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }}
                          onClick={() => { setEditing(p); setFormOpen(true); }}>
                          <Pencil size={13} /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }}
                          onClick={() => setConfirm(p)}>
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </div>

        {/* ── Paginación ── */}
        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button className="page-btn" disabled={page === pages} onClick={() => setPage(page + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {formOpen && (
        <ProductForm
          token={token}
          product={editing}
          categorias={categorias || []}
          onClose={() => setFormOpen(false)}
          onSaved={() => { setFormOpen(false); reload(); }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={`¿Eliminar "${confirm.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(confirm.id_producto)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default ProductsPanel;