import React, { useEffect } from "react";
import { CheckCheck, Info, AlertTriangle } from 'lucide-react';

/**
 * Función inyectora de CSS para modificar dinámicamente el comportamiento 
 * de la posición del contenedor de notificaciones de React-Toastify.
 * Maneja el desplazamiento del toast si el panel lateral del carrito se abre.
 */
const injectToastStyles = () => {
  // Evita duplicaciones del estilo inspeccionando el DOM
  if (document.getElementById("cart-toast-styles")) return;

  const style = document.createElement("style");
  style.id = "cart-toast-styles";

  // Inyecta el CSS en línea
  style.textContent = `
    .Toastify__toast-container--bottom-right {
      right: 20px !important;
      transition: right 0.3s ease;
    }

    /* Clase activa que desplaza el toast cuando el Drawer del carrito se despliega */
    .cart-open .Toastify__toast-container--bottom-right {
      right: 420px !important;
    }
  `;

  document.head.appendChild(style);
};

// Mapeo dinámico de íconos según el tipo de notificación
const icons = {
  success: <CheckCheck size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />
};

// Diccionario de colores según el tipo (éxito, información o advertencia)
const styles = {
  success: {
    color: "#16a34a",
    background: "#f0fdf4",
    border: "#bbf7d0"
  },
  info: {
    color: "#2563eb",
    background: "#eff6ff",
    border: "#bfdbfe"
  },
  warning: {
    color: "#d97706",
    background: "#fffbeb",
    border: "#fde68a"
  }
};

/**
 * Componente visual que representa la burbuja de la notificación en sí.
 * Renderiza el ícono, diseño y mensaje adaptado.
 */
export const CartToast = ({ type = "info", message }) => {
  useEffect(() => {
    // Inyecta los estilos la primera vez que se renderiza el toast
    injectToastStyles();
  }, []);

  // Selecciona el estilo correspondiente al tipo pasado por Props, o info por defecto
  const s = styles[type] || styles.info;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "10px",
        background: s.background,
        border: `1px solid ${s.border}`,
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "13.5px",
        color: "#1f2937",
        width: "100%",
        boxSizing: "border-box",
        maxWidth: "320px"
      }}
    >
      {/* Contenedor del ícono */}
      <div
        style={{
          color: s.color,
          display: "flex",
          alignItems: "center"
        }}
      >
        {icons[type]}
      </div>

      {/* Mensaje de la notificación */}
      <span style={{ fontWeight: 500 }}>
        {message}
      </span>
    </div>
  );
};