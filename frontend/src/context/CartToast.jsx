import React, { useEffect } from "react";
import { CheckCheck, Info, AlertTriangle } from 'lucide-react';

const injectToastStyles = () => {
  if (document.getElementById("cart-toast-styles")) return;

  const style = document.createElement("style");
  style.id = "cart-toast-styles";

  style.textContent = `
    .Toastify__toast-container--bottom-right {
      right: 20px !important;
      transition: right 0.3s ease;
    }

    .cart-open .Toastify__toast-container--bottom-right {
      right: 420px !important;
    }
  `;

  document.head.appendChild(style);
};

const icons = {
  success: <CheckCheck size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />
};

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

export const CartToast = ({ type = "info", message }) => {
  useEffect(() => {
    injectToastStyles();
  }, []);


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
        maxWidth: "320px"
      }}
    >
      <div
        style={{
          color: s.color,
          display: "flex",
          alignItems: "center"
        }}
      >
        {icons[type]}
      </div>

      <span style={{ fontWeight: 500 }}>
        {message}
      </span>
    </div>
  );
};