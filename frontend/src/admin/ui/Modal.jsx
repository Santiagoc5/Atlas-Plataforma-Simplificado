import { X } from "lucide-react";

/**
 * Contenedor genérico para Modales en el entorno administrativo.
 * Maneja el diseño estructural: overlay, encabezado, cuerpo y pie.
 */
const Modal = ({ title, onClose, children, footer, lg }) => (
  <div className="overlay" onClick={onClose}>
    <div className={`modal${lg ? " modal-lg" : ""}`} onClick={e => e.stopPropagation()}>
      <div className="modal-hdr">
        <h2 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h2>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-ftr">{footer}</div>}
    </div>
  </div>
);

export default Modal;