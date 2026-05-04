import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { waLink, CONTACT_EMAIL } from '../config';
import { useI18n } from '../i18n/I18nContext';

const Contact = () => {
  const { t } = useI18n();
  return (
    <main className="py-16 md:py-24" data-testid="contact-page">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <p className="overline text-clay mb-4">{t('contact.overline')}</p>
        <h1 className="font-serif text-5xl md:text-6xl text-forest tracking-tight mb-6 leading-[1.05]">
          {t('contact.h1a')} <em className="not-italic text-clay">{t('contact.h1b')}</em>
        </h1>
        <p className="text-muted2 leading-relaxed max-w-2xl mb-16">{t('contact.subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <p className="overline text-clay mb-2">{t('contact.whatsapp')}</p>
              <a
                href={waLink(t('contact.whatsappDefaultMsg'))}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-3xl text-forest hover:text-clay flex items-center gap-3"
                data-testid="contact-whatsapp"
              >
                <MessageCircle className="w-7 h-7" /> {t('contact.whatsappCta')}
              </a>
            </div>
            <div>
              <p className="overline text-clay mb-2">{t('contact.email')}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-serif text-2xl text-forest hover:text-clay flex items-center gap-3">
                <Mail className="w-5 h-5" /> {CONTACT_EMAIL}
              </a>
            </div>
            <div>
              <p className="overline text-clay mb-2">{t('contact.workshop')}</p>
              <p className="font-serif text-2xl text-forest flex items-center gap-3">
                <MapPin className="w-5 h-5" /> {t('contact.workshopLocation')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-line p-8 md:p-10">
            <p className="overline text-clay mb-3">{t('contact.custom.overline')}</p>
            <h2 className="font-serif text-3xl text-forest mb-4 leading-tight">{t('contact.custom.h2')}</h2>
            <p className="text-muted2 leading-relaxed mb-6">{t('contact.custom.text')}</p>
            <a
              href={waLink(t('contact.custom.ctaMsg'))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              data-testid="contact-custom-cta"
            >
              <MessageCircle className="w-4 h-4" /> {t('contact.custom.cta')}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
