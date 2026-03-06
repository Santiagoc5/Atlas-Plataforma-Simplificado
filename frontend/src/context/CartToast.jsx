import React, { useEffect } from "react";

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
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
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