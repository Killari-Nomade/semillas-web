// Configuración de marca — punto único de cambio
// El número de WhatsApp debe ir en formato internacional SIN + ni espacios
// Ejemplos: México +52 → "5215512345678"  |  España +34 → "34612345678"  |  Italia +39 → "391775120932"
export const WHATSAPP_NUMBER = '1775120932';
export const WHATSAPP_DEFAULT_MSG = 'Hola Semillas Nómadas, tengo interés en sus piezas';
export const CONTACT_EMAIL = 'hola@semillasnomadas.com';
export const BRAND_NAME = 'Semillas Nómadas';

export const waLink = (msg = WHATSAPP_DEFAULT_MSG) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
