import React, { useState } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { CheckCircle2, Sparkles, Leaf, Heart, MessageCircle } from 'lucide-react';
import { waLink } from '../config';

const HERO_IMG = 'https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800';

const JEWELRY_TYPES = [
  { v: 'collar', l: 'Collar' },
  { v: 'dije', l: 'Dije' },
  { v: 'anillo', l: 'Anillo' },
  { v: 'aretes', l: 'Aretes' },
  { v: 'pulsera', l: 'Pulsera' },
  { v: 'llavero', l: 'Llavero' },
  { v: 'colgante-celular', l: 'Colgante para celular' },
  { v: 'motivo', l: 'Motivo para pegar' },
  { v: 'otro', l: 'Otro' },
];

const BUDGETS = [
  { v: '50-80', l: '$50 — $80 USD' },
  { v: '80-120', l: '$80 — $120 USD' },
  { v: '120-200', l: '$120 — $200 USD' },
  { v: '200+', l: '$200+ USD' },
];

const CustomOrder = () => {
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    jewelry_type: 'collar', element_description: '',
    inspiration_url: '', budget: '80-120', deadline: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.element_description) {
      toast.error('Completa nombre, email y descripción del elemento');
      return;
    }
    setLoading(true);
    try {
      await api.post('/custom-orders', form);
      setSuccess(true);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al enviar la solicitud');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <main className="py-32" data-testid="custom-success">
        <div className="max-w-2xl mx-auto text-center px-6">
          <CheckCircle2 className="w-16 h-16 text-forest mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl text-forest mb-4 leading-tight">¡Tu semilla está plantada!</h1>
          <p className="text-muted2 leading-relaxed mb-8">
            Recibimos tu solicitud. Te contactaremos a <strong>{form.customer_email}</strong> en menos de 48 horas con bocetos, cotización personalizada e instrucciones para enviarnos el elemento natural (si aplica).
          </p>
          <a
            href={waLink(`Hola, acabo de enviar una solicitud personalizada a nombre de ${form.customer_name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-testid="custom-success-whatsapp"
          >
            <MessageCircle className="w-4 h-4" /> Adelantar contacto por WhatsApp
          </a>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="custom-order-page">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[480px] grain overflow-hidden">
        <img src={HERO_IMG} alt="Anillo con bosque preservado" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(44,64,43,0.85) 0%, rgba(44,64,43,0.55) 60%, rgba(44,64,43,0.20) 100%)' }} />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center">
          <div className="max-w-3xl text-sand">
            <p className="overline text-amber mb-5">Atelier privado · Pieza única</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
              Tu naturaleza,<br/>
              <em className="not-italic text-amber">eterna en resina</em>.
            </h1>
            <p className="text-base sm:text-lg text-sand/85 max-w-xl leading-relaxed">
              Envíanos la flor de tu jardín, una semilla de tu árbol favorito o una hoja de un viaje especial.
              La transformamos en una joya única, hecha exclusivamente para ti.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="overline text-clay mb-3 text-center">Cómo funciona</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest text-center tracking-tight mb-14">Tres pasos hacia tu pieza única</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Heart, n: '01', t: 'Cuéntanos tu historia', d: 'Comparte qué elemento natural quieres preservar y qué tipo de joya imaginas.' },
              { icon: Sparkles, n: '02', t: 'Diseñamos juntas', d: 'Recibe bocetos, cotización personalizada y la guía para enviarnos tu elemento.' },
              { icon: Leaf, n: '03', t: 'Llega a tu hogar', d: 'Tu pieza única, hecha a mano, llega cuidadosamente empacada con su historia.' },
            ].map((s) => (
              <div key={s.n} className="flex flex-col">
                <span className="font-serif text-5xl text-amber mb-3">{s.n}</span>
                <s.icon className="w-6 h-6 text-forest mb-3" />
                <h3 className="font-serif text-2xl text-ink mb-2">{s.t}</h3>
                <p className="text-sm text-muted2 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="overline text-clay mb-3">Solicita tu pieza</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest tracking-tight mb-3 leading-tight">Comencemos a crearla</h2>
          <p className="text-muted2 mb-10">Cada solicitud se revisa personalmente. Sin compromiso hasta confirmar la cotización.</p>

          <form onSubmit={submit} className="bg-white border border-line p-8 md:p-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nombre completo *" testid="custom-name" value={form.customer_name} onChange={change('customer_name')} />
              <Field label="Email *" testid="custom-email" type="email" value={form.customer_email} onChange={change('customer_email')} />
            </div>
            <Field label="WhatsApp / Teléfono" testid="custom-phone" value={form.customer_phone} onChange={change('customer_phone')} />

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="overline text-muted2 mb-2 block">Tipo de joya *</span>
                <select className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={form.jewelry_type} onChange={change('jewelry_type')} data-testid="custom-jewelry-type">
                  {JEWELRY_TYPES.map((j) => <option key={j.v} value={j.v}>{j.l}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="overline text-muted2 mb-2 block">Presupuesto *</span>
                <select className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={form.budget} onChange={change('budget')} data-testid="custom-budget">
                  {BUDGETS.map((b) => <option key={b.v} value={b.v}>{b.l}</option>)}
                </select>
              </label>
            </div>

            <Field
              label="¿Qué elemento natural quieres preservar? *"
              testid="custom-element"
              value={form.element_description}
              onChange={change('element_description')}
              textarea
              placeholder="Ej. una flor de lavanda de mi jardín, una hoja del árbol de mi infancia, madera de un olivo que ya cayó, semillas de mi viaje a Oaxaca…"
            />
            <Field label="URL de inspiración (opcional)" testid="custom-inspiration" value={form.inspiration_url} onChange={change('inspiration_url')} placeholder="https://… (link a una foto de Instagram, Pinterest, etc.)" />
            <Field label="Fecha deseada (opcional)" testid="custom-deadline" value={form.deadline} onChange={change('deadline')} placeholder="Ej. para mi aniversario en marzo" />
            <Field label="Notas adicionales" testid="custom-notes" value={form.notes} onChange={change('notes')} textarea />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center" data-testid="custom-submit">
              {loading ? 'Enviando…' : 'Enviar solicitud'}
            </button>
            <p className="text-xs text-muted2 text-center">Te respondemos en menos de 48 horas. Sin compromiso.</p>
          </form>
        </div>
      </section>
    </main>
  );
};

const Field = ({ label, testid, value, onChange, type = 'text', textarea, placeholder }) => (
  <label className="block">
    <span className="overline text-muted2 mb-2 block">{label}</span>
    {textarea ? (
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest"
        value={value}
        onChange={onChange}
        data-testid={testid}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest"
        value={value}
        onChange={onChange}
        data-testid={testid}
      />
    )}
  </label>
);

export default CustomOrder;
