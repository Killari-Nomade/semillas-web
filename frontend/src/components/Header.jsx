import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useI18n } from '../i18n/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { count, setOpen } = useCart();
  const { t } = useI18n();
  const [mobile, setMobile] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/historia', label: t('nav.story') },
    { to: '/creaciones', label: t('nav.creations') },
    { to: '/personalizada', label: t('nav.custom') },
    { to: '/contacto', label: t('nav.contact') },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl border-b"
      style={{ backgroundColor: 'rgba(249, 246, 240, 0.82)', borderColor: 'rgba(44, 64, 43, 0.10)' }}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-link">
          <span className="font-serif text-2xl tracking-tight text-forest leading-none">{t('brand.name')}</span>
          <span className="overline text-clay">{t('brand.tagline')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.to.replace(/\//g, '') || 'home'}`}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${isActive ? 'text-forest font-medium' : 'text-muted2 hover:text-forest'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 hover:bg-line transition-colors"
            data-testid="cart-trigger-btn"
            aria-label={t('nav.cartAria')}
          >
            <ShoppingBag className="w-5 h-5 text-forest" />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-forest text-sand text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
                data-testid="cart-count-badge"
              >
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setMobile(!mobile)}
            data-testid="mobile-menu-btn"
            aria-label={t('nav.menuAria')}
          >
            {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="md:hidden border-t border-line bg-sand">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobile(false)}
                className="text-sm tracking-wide text-forest"
                data-testid={`mobile-nav-${l.to.replace(/\//g, '') || 'home'}`}
              >
                {l.label}
              </NavLink>
            ))}
            <LanguageSwitcher className="sm:hidden pt-2 border-t border-line" />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
