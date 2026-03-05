// CartToast.jsx — Componente de notificación personalizada
import React from 'react';

const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="12" /><circle cx="12" cy="16.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="10" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const styles = {
  success: {
    background: 'linear-gradient(135deg, #0f2027, #1a3a2a)',
    accent: '#22c55e',
    iconBg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.25)',
  },
  info: {
    background: 'linear-gradient(135deg, #0f1a2e, #0f2040)',
    accent: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.15)',
    border: 'rgba(96,165,250,0.25)',
  },
  warning: {
    background: 'linear-gradient(135deg, #1f1300, #2a1f00)',
    accent: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.25)',
  },
};

export const CartToast = ({ type = 'info', message }) => {
  const s = styles[type] || styles.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      background: s.background,
      border: `1px solid ${s.border}`,
      boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${s.border} inset`,
      minWidth: '260px',
      maxWidth: '340px',
      backdropFilter: 'blur(12px)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Icono */}
      <div style={{
        flexShrink: 0,
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: s.iconBg,
        border: `1px solid ${s.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: s.accent,
      }}>
        {icons[type]}
      </div>

      {/* Mensaje */}
      <span style={{
        color: '#f0f0f0',
        fontSize: '13.5px',
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '0.01em',
      }}>
        {message}
      </span>

      {/* Barra lateral de acento */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '20%',
        height: '60%',
        width: '3px',
        borderRadius: '0 3px 3px 0',
        background: s.accent,
        boxShadow: `0 0 8px ${s.accent}`,
      }} />
    </div>
  );
};