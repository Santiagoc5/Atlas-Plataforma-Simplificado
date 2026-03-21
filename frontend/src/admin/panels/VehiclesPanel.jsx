import { useState } from "react";
import { toast } from "react-toastify";
import { Check, Pencil, Plus, Search, Trash2, Truck } from "lucide-react";
import { api } from "../api";
import useFetch from "../hooks/useFetch";
import Modal from "../ui/Modal";
import CardHeader from "../ui/CardHeader";
import { InputField } from "../ui/Field";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";

const VehiclesPanel = ({ token }) => {
  const { data: vehicles, loading, reload } = useFetch("/api/admin/vehiculos/", token);

  const [search, setSearch]     = useState("");
  const [name, setName]         = useState("");
  const [saving, setSaving]     = useState(false);
  const [editing, setEditing]   = useState(null);
  const [editName, setEditName] = useState("");
  const [confirm, setConfirm]   = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    try {
      await api("/api/admin/vehiculos/crear/", { method: "POST", body: JSON.stringify({ nombre_completo: name.trim() }) }, token);
      toast.success("Vehículo creado");
      setName("");
      reload();
    } catch (e) { toast.error(e?.error || "Error al crear"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await api(`/api/admin/vehiculos/${editing.id_vehiculo}/editar/`, { method: "PATCH", body: JSON.stringify({ nombre_completo: editName }) }, token);
      toast.success("Vehículo actualizado");
      setEditing(null);
      reload();
    } catch (e) { toast.error(e?.error || "Error"); }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/api/admin/vehiculos/${id}/eliminar/`, { method: "DELETE" }, token);
      toast.success("Vehículo eliminado");
      reload();
    } catch { toast.error("Error al eliminar"); }
    setConfirm(null);
  };

  const filtered = (vehicles || []).filter(v =>
    !search || v.nombre_completo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Vehículos Compatibles</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Gestiona los modelos de vehículos del catálogo</p>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>
        {/* ── Agregar ── */}
        <div className="card">
          <CardHeader icon={<Truck size={16} color="var(--accent)" />} title="Agregar Vehículo" />
          <div style={{ padding: "20px 24px" }}>
            <InputField
              label="Nombre completo"
              value={name}
              onChange={setName}
              placeholder="Toyota Hilux"
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>Formato: Marca, Modelo</p>
            <button className="btn btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={handleCreate} disabled={saving}>
              {saving ? <Spinner /> : <Plus size={16} />} Agregar
            </button>
          </div>
        </div>

        {/* ── Listado ── */}
        <div className="card">
          <CardHeader title="">
            <div className="search-wrap">
              <div className="search-icon"><Search size={15} /></div>
              <input className="input" placeholder="Filtrar vehículos..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{filtered.length} resultados</span>
          </CardHeader>
          <div className="table-wrap mc" style={{ maxHeight: 460, overflowY: "auto" }}>
            {loading
              ? <div className="loading-c"><Spinner /></div>
              : !filtered.length
                ? <EmptyState icon={<Truck size={40} />} text="Sin vehículos" />
                : (
                  <table>
                    <thead>
                      <tr><th>Nombre</th><th style={{ textAlign: "right" }}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(v => (
                        <tr key={v.id_vehiculo}>
                          <td style={{ fontWeight: 600 }}>{v.nombre_completo}</td>
                          <td className="act">
                            <div style={{ display: "flex", gap: 8 }}>
                              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }}
                                onClick={() => { setEditing(v); setEditName(v.nombre_completo); }}>
                                <Pencil size={14} /> Editar
                              </button>
                              <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: "center" }}
                                onClick={() => setConfirm(v)}>
                                <Trash2 size={14} /> Eliminar
                              </button>
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

      {editing && (
        <Modal
          title="Editar Vehículo"
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleEdit}>
                <Check size={16} /> Guardar
              </button>
            </>
          }
        >
          <InputField
            label="Nombre completo"
            value={editName}
            onChange={setEditName}
            onKeyDown={e => e.key === "Enter" && handleEdit()}
          />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message={`¿Eliminar "${confirm.nombre_completo}"? Se desasociará de todos los productos.`}
          onConfirm={() => handleDelete(confirm.id_vehiculo)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default VehiclesPanel;