import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../config';

const Footer = () => (
  <footer className="bg-forest text-sand py-20 mt-24 grain" data-testid="site-footer">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <h3 className="font-serif text-3xl tracking-tight mb-4">Semillas Nómadas</h3>
        <p className="text-sand/70 max-w-md leading-relaxed">
          Joyería artesanal hecha con elementos de la naturaleza reutilizados — hojas caídas, flores secas y maderas recuperadas de pino, olivo, ciprés — preservados eternamente en resina. Recogido con cuidado, trabajado con cariño.
        </p>
      </div>
      <div>
        <p className="overline text-amber mb-4">Explorar</p>
        <ul className="space-y-2 text-sm text-sand/80">
          <li><Link to="/catalogo" className="hover:text-amber transition-colors">Catálogo</Link></li>
          <li><Link to="/personalizada" className="hover:text-amber transition-colors">Pieza personalizada</Link></li>
          <li><Link to="/historia" className="hover:text-amber transition-colors">Nuestra historia</Link></li>
          <li><Link to="/contacto" className="hover:text-amber transition-colors">Contacto</Link></li>
          <li><Link to="/admin/login" className="hover:text-amber transition-colors">Admin</Link></li>
        </ul>
      </div>
      <div>
        <p className="overline text-amber mb-4">Contacto</p>
        <ul className="space-y-3 text-sm text-sand/80">
          <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {CONTACT_EMAIL}</li>
          <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +{WHATSAPP_NUMBER}</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-8 border-t border-sand/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-sand/50">
      <span>© {new Date().getFullYear()} Semillas Nómadas — Hecho a mano con amor.</span>
      <span>Resina · Naturaleza reutilizada · Una pieza, una historia.</span>
    </div>
  </footer>
);

export default Footer;
