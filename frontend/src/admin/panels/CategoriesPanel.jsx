import { useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import CardHeader from "../ui/CardHeader";
import { InputField } from "../ui/Field";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";

const CategoriesPanel = ({ token }) => {
  const { data: cats, loading, reload } = useFetch("/api/admin/categorias/", token);

  const [name, setName]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try {
      await api("/api/admin/categorias/crear/", { method: "POST", body: JSON.stringify({ nombre: name.trim() }) }, token);
      toast.success("Categoría creada");
      setName("");
      reload();
    } catch (e) { toast.error(e?.nombre?.[0] || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/categorias/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Categoría eliminada");
      reload();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  const startEdit = (cat) => {
    setEditing(cat.id_categoria);
    setEditName(cat.nombre);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditName("");
  };

  const handleEdit = async (id) => {
    if (!editName.trim()) return toast.error("Nombre requerido");
    setSavingEdit(true);
    try {
      await api(
        `/api/admin/categorias/${id}/editar/`,
        { method: "PATCH", body: JSON.stringify({ nombre: editName.trim() }) },
        token
      );
      toast.success("Categoría actualizada");
      cancelEdit();
      reload();
    } catch (e) {
      toast.error(e?.nombre?.[0] || e?.error || "Error al editar");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Categorías</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Organiza tu catálogo de productos</p>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        {/* ── Crear ── */}
        <div className="card">
          <CardHeader icon={<Plus size={16} color="var(--accent)" />} title="Nueva Categoría" />
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField
              label="Nombre"
              value={name}
              onChange={setName}
              placeholder="Ej: Ampliaciones"
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={handleCreate} disabled={saving}>
              {saving ? <Spinner /> : <Plus size={16} />} Crear categoría
            </button>
          </div>
        </div>

        {/* ── Listado ── */}
        <div className="card">
          <CardHeader icon={<Tag size={16} color="var(--accent)" />} title={`${(cats || []).length} Categorías`} />
          <div className="table-wrap mc">
            {loading
              ? <div className="loading-c"><Spinner /></div>
              : !cats?.length
                ? <EmptyState icon={<Tag size={40} />} text="Sin categorías aún" />
                : (
                  <table>
                    <thead>
                      <tr><th>Nombre</th><th style={{ textAlign: "right" }}>Acción</th></tr>
                    </thead>
                    <tbody>
                      {cats.map(c => (
                        <tr key={c.id_categoria}>
                          <td>
                            {editing === c.id_categoria ? (
                              <input
                                className="input"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleEdit(c.id_categoria);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                              />
                            ) : (
                              <span style={{ fontWeight: 700 }}>{c.nombre}</span>
                            )}
                          </td>
                          <td className="act">
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                              {editing === c.id_categoria ? (
                                <>
                                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(c.id_categoria)} disabled={savingEdit}>
                                    {savingEdit ? <Spinner /> : "Guardar"}
                                  </button>
                                  <button className="btn btn-ghost btn-sm" onClick={cancelEdit} disabled={savingEdit}>
                                    <X size={14} /> Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>
                                    <Pencil size={14} /> Editar
                                  </button>
                                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)}>
                                    <Trash2 size={14} /> Eliminar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
            }
          </div>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          message={`¿Eliminar la categoría "${confirm.nombre}"?`}
          onConfirm={() => handleDelete(confirm.id_categoria)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default CategoriesPanel;