import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const number = '525555555555';
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent('Hola Semillas Nómadas, tengo interés en sus piezas')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-30 bg-forest hover:bg-forest-dark text-sand w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
      data-testid="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppFloat;
