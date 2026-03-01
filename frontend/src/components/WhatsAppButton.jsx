import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phone = "573005307606";
  const message = "Hola Atlas Accesorios! Quisiera más información.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="tooltip-text">¿Necesitas ayuda?</span>
    </a>
  );
};

export default WhatsAppButton;