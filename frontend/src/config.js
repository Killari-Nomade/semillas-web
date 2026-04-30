// Configuración de marca — punto único de cambio
// El número de WhatsApp debe ir en formato internacional SIN + ni espacios
// Alemania +49 · se quita el 0 inicial del número nacional
export const WHATSAPP_NUMBER = '491775120932';
export const WHATSAPP_DEFAULT_MSG = 'Hola Semillas Nómadas, tengo interés en sus piezas';
export const CONTACT_EMAIL = 'hola@semillasnomadas.com';
export const BRAND_NAME = 'Semillas Nómadas';

export const waLink = (msg = WHATSAPP_DEFAULT_MSG) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
