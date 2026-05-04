import React from 'react';
import { MessageCircle } from 'lucide-react';
import { waLink } from '../config';
import { useI18n } from '../i18n/I18nContext';

const WhatsAppFloat = () => {
  const { t } = useI18n();
  return (
    <a
      href={waLink(t('waDefault'))}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-30 bg-forest hover:bg-forest-dark text-sand w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
      data-testid="whatsapp-float"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppFloat;
