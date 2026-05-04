import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, LANGUAGES, DEFAULT_LANGUAGE } from './translations';

const I18nContext = createContext(null);

const detectBrowserLang = () => {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('es')) return 'es';
  return DEFAULT_LANGUAGE;
};

const getNested = (obj, path) =>
  path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('sn_lang');
      if (saved && LANGUAGES.includes(saved)) return saved;
    } catch { /* ignore */ }
    return detectBrowserLang();
  });

  useEffect(() => {
    try { localStorage.setItem('sn_lang', lang); } catch { /* ignore */ }
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key, params) => {
    const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
    let val = getNested(dict, key);
    if (val == null) {
      val = getNested(translations[DEFAULT_LANGUAGE], key);
    }
    if (typeof val !== 'string') return val ?? key;
    if (params) {
      return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`));
    }
    return val;
  }, [lang]);

  const changeLang = useCallback((l) => {
    if (LANGUAGES.includes(l)) setLang(l);
  }, []);

  const value = useMemo(() => ({ lang, setLang: changeLang, t }), [lang, changeLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
