import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { waLink, CONTACT_EMAIL } from '../config';

const Contact = () => (
  <main className="py-16 md:py-24" data-testid="contact-page">
    <div className="max-w-5xl mx-auto px-6 lg:px-10">
      <p className="overline text-clay mb-4">Contacto</p>
      <h1 className="font-serif text-5xl md:text-6xl text-forest tracking-tight mb-6 leading-[1.05]">
        Hablemos. <em className="not-italic text-clay">En cualquier idioma del bosque.</em>
      </h1>
      <p className="text-muted2 leading-relaxed max-w-2xl mb-16">
        Escríbenos para piezas a la medida, colaboraciones, mayoreo o simplemente para platicar sobre nuestras técnicas. Respondemos en menos de 24 horas.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <p className="overline text-clay mb-2">WhatsApp</p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-3xl text-forest hover:text-clay flex items-center gap-3"
              data-testid="contact-whatsapp"
            >
              <MessageCircle className="w-7 h-7" /> Chatear ahora
            </a>
          </div>
          <div>
            <p className="overline text-clay mb-2">Email</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-serif text-2xl text-forest hover:text-clay flex items-center gap-3">
              <Mail className="w-5 h-5" /> {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <p className="overline text-clay mb-2">Taller</p>
            <p className="font-serif text-2xl text-forest flex items-center gap-3">
              <MapPin className="w-5 h-5" /> Alemania · bajo cita previa
            </p>
          </div>
        </div>

        <div className="bg-white border border-line p-8 md:p-10">
          <p className="overline text-clay mb-3">Envíos personalizados</p>
          <h2 className="font-serif text-3xl text-forest mb-4 leading-tight">¿Una pieza única para alguien especial?</h2>
          <p className="text-muted2 leading-relaxed mb-6">
            Hacemos piezas a la medida con elementos significativos para ti: la flor de tu jardín, una hoja de un viaje, semillas de tu árbol favorito o madera recuperada de un árbol especial.
          </p>
          <a
            href={waLink('Hola, me interesa una pieza personalizada')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-testid="contact-custom-cta"
          >
            <MessageCircle className="w-4 h-4" /> Solicitar personalizada
          </a>
        </div>
      </div>
    </div>
  </main>
);

export default Contact;
