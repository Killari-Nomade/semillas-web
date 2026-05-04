import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { LANGUAGES } from '../i18n/translations';

const LABELS = { es: 'ES', en: 'EN', de: 'DE' };

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useI18n();
  return (
    <div className={`flex items-center gap-1 ${className}`} data-testid="language-switcher">
      {LANGUAGES.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-line text-xs">·</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            className={`text-xs tracking-[0.15em] uppercase px-1.5 py-1 transition-colors ${
              lang === l ? 'text-forest font-medium' : 'text-muted2 hover:text-forest'
            }`}
            aria-current={lang === l ? 'true' : undefined}
            data-testid={`lang-${l}`}
          >
            {LABELS[l]}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
