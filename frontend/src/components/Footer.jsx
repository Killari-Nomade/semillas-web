import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../config';
import { useI18n } from '../i18n/I18nContext';

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="bg-forest text-sand py-20 mt-24 grain" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-serif text-3xl tracking-tight mb-4">Semillas Nómadas</h3>
          <p className="text-sand/70 max-w-md leading-relaxed">{t('footer.description')}</p>
        </div>
        <div>
          <p className="overline text-amber mb-4">{t('footer.explore')}</p>
          <ul className="space-y-2 text-sm text-sand/80">
            <li><Link to="/creaciones" className="hover:text-amber transition-colors">{t('footer.creations')}</Link></li>
            <li><Link to="/personalizada" className="hover:text-amber transition-colors">{t('footer.custom')}</Link></li>
            <li><Link to="/historia" className="hover:text-amber transition-colors">{t('footer.story')}</Link></li>
            <li><Link to="/contacto" className="hover:text-amber transition-colors">{t('footer.contact')}</Link></li>
            <li><Link to="/admin/login" className="hover:text-amber transition-colors">{t('footer.admin')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="overline text-amber mb-4">{t('footer.contactHeading')}</p>
          <ul className="space-y-3 text-sm text-sand/80">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {CONTACT_EMAIL}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +{WHATSAPP_NUMBER}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-8 border-t border-sand/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-sand/50">
        <span>© {new Date().getFullYear()} Semillas Nómadas — {t('footer.copyright')}</span>
        <span>{t('footer.tagline')}</span>
      </div>
    </footer>
  );
};

export default Footer;
