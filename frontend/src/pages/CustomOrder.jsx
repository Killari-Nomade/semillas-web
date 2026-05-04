import React, { useState } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { CheckCircle2, Sparkles, Leaf, Heart, MessageCircle } from 'lucide-react';
import { waLink } from '../config';
import { useI18n } from '../i18n/I18nContext';

const HERO_IMG = 'https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800';

const JEWELRY_TYPE_KEYS = ['collar', 'dije', 'anillo', 'aretes', 'pulsera', 'llavero', 'colgante-celular', 'motivo', 'otro'];
const BUDGETS = [
  { v: '50-80', l: '$50 — $80 USD' },
  { v: '80-120', l: '$80 — $120 USD' },
  { v: '120-200', l: '$120 — $200 USD' },
  { v: '200+', l: '$200+ USD' },
];

const CustomOrder = () => {
  const { t } = useI18n();
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
      toast.error(t('customOrder.toastMissing'));
      return;
    }
    setLoading(true);
    try {
      await api.post('/custom-orders', form);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || t('customOrder.toastError'));
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <main className="py-32" data-testid="custom-success">
        <div className="max-w-2xl mx-auto text-center px-6">
          <CheckCircle2 className="w-16 h-16 text-forest mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl text-forest mb-4 leading-tight">{t('customOrder.successH1')}</h1>
          <p
            className="text-muted2 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: t('customOrder.successText', { email: `<strong>${form.customer_email}</strong>` }) }}
          />
          <a
            href={waLink(t('customOrder.successCtaMsg', { name: form.customer_name }))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-testid="custom-success-whatsapp"
          >
            <MessageCircle className="w-4 h-4" /> {t('customOrder.successCta')}
          </a>
        </div>
      </main>
    );
  }

  const steps = [
    { icon: Heart, n: '01', t: t('customOrder.step1Title'), d: t('customOrder.step1Text') },
    { icon: Sparkles, n: '02', t: t('customOrder.step2Title'), d: t('customOrder.step2Text') },
    { icon: Leaf, n: '03', t: t('customOrder.step3Title'), d: t('customOrder.step3Text') },
  ];

  return (
    <main data-testid="custom-order-page">
      <section className="relative h-[60vh] min-h-[480px] grain overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(44,64,43,0.85) 0%, rgba(44,64,43,0.55) 60%, rgba(44,64,43,0.20) 100%)' }} />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center">
          <div className="max-w-3xl text-sand">
            <p className="overline text-amber mb-5">{t('customOrder.heroOverline')}</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
              {t('customOrder.h1a')}<br/>
              <em className="not-italic text-amber">{t('customOrder.h1b')}</em>.
            </h1>
            <p className="text-base sm:text-lg text-sand/85 max-w-xl leading-relaxed">{t('customOrder.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="overline text-clay mb-3 text-center">{t('customOrder.howItWorks')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest text-center tracking-tight mb-14">{t('customOrder.threeSteps')}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
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

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="overline text-clay mb-3">{t('customOrder.formOverline')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest tracking-tight mb-3 leading-tight">{t('customOrder.formH2')}</h2>
          <p className="text-muted2 mb-10">{t('customOrder.formSubtitle')}</p>

          <form onSubmit={submit} className="bg-white border border-line p-8 md:p-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t('customOrder.fieldName')} testid="custom-name" value={form.customer_name} onChange={change('customer_name')} />
              <Field label={t('customOrder.fieldEmail')} testid="custom-email" type="email" value={form.customer_email} onChange={change('customer_email')} />
            </div>
            <Field label={t('customOrder.fieldPhone')} testid="custom-phone" value={form.customer_phone} onChange={change('customer_phone')} />

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="overline text-muted2 mb-2 block">{t('customOrder.fieldJewelryType')}</span>
                <select className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={form.jewelry_type} onChange={change('jewelry_type')} data-testid="custom-jewelry-type">
                  {JEWELRY_TYPE_KEYS.map((k) => <option key={k} value={k}>{t(`customOrder.jewelryTypes.${k}`)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="overline text-muted2 mb-2 block">{t('customOrder.fieldBudget')}</span>
                <select className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={form.budget} onChange={change('budget')} data-testid="custom-budget">
                  {BUDGETS.map((b) => <option key={b.v} value={b.v}>{b.l}</option>)}
                </select>
              </label>
            </div>

            <Field
              label={t('customOrder.fieldElement')}
              testid="custom-element"
              value={form.element_description}
              onChange={change('element_description')}
              textarea
              placeholder={t('customOrder.elementPlaceholder')}
            />
            <Field label={t('customOrder.fieldInspiration')} testid="custom-inspiration" value={form.inspiration_url} onChange={change('inspiration_url')} placeholder={t('customOrder.inspirationPlaceholder')} />
            <Field label={t('customOrder.fieldDeadline')} testid="custom-deadline" value={form.deadline} onChange={change('deadline')} placeholder={t('customOrder.deadlinePlaceholder')} />
            <Field label={t('customOrder.fieldNotes')} testid="custom-notes" value={form.notes} onChange={change('notes')} textarea />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center" data-testid="custom-submit">
              {loading ? t('customOrder.submitting') : t('customOrder.submit')}
            </button>
            <p className="text-xs text-muted2 text-center">{t('customOrder.submitNote')}</p>
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
      <textarea rows={4} placeholder={placeholder} className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={value} onChange={onChange} data-testid={testid} />
    ) : (
      <input type={type} placeholder={placeholder} className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" value={value} onChange={onChange} data-testid={testid} />
    )}
  </label>
);

export default CustomOrder;
