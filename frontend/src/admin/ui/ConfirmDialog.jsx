import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

/**
 * Modal prefabricado y reutilizable para confirmación de acciones destructivas (ej. eliminar).
 * Recibe un mensaje dinámico y callbacks para confirmar o cancelar.
 */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <Modal
    title=""
    onClose={onCancel}
    footer={
      <>
        <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
      </>
    }
  >
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 50, height: 50, borderRadius: "50%",
        background: "var(--danger-dim)", border: "1px solid rgba(230,0,0,.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
      }}>
        <AlertTriangle size={24} color="var(--danger)" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
        ¿Confirmar eliminación?
      </div>
      <p style={{ color: "var(--text2)", fontSize: 13 }}>{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;