import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../i18n/I18nContext';

const HERO_IMG = 'https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800';
const STORY_IMG = 'https://images.unsplash.com/photo-1759523131742-af817477bcd9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const CTA_BG = 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800';

const Home = () => {
  const { t } = useI18n();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products', { params: { featured: true } }).then((r) => setFeatured(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const values = [
    { icon: Leaf, title: t('home.values.v1Title'), text: t('home.values.v1Text') },
    { icon: Sparkles, title: t('home.values.v2Title'), text: t('home.values.v2Text') },
    { icon: Heart, title: t('home.values.v3Title'), text: t('home.values.v3Text') },
  ];

  return (
    <main data-testid="home-page">
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] grain overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(44,64,43,0.78) 0%, rgba(44,64,43,0.45) 50%, rgba(44,64,43,0.10) 100%)' }} />
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center">
          <div className="max-w-2xl text-sand animate-fade-up">
            <p className="overline text-amber mb-6">{t('home.overline')}</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              {t('home.h1a')}<br/>
              <em className="not-italic text-amber">{t('home.h1b')}</em><br/>
              {t('home.h1c')}
            </h1>
            <p className="text-base sm:text-lg text-sand/85 max-w-xl mb-10 leading-relaxed">{t('home.subtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/creaciones" className="btn-primary bg-amber text-ink hover:bg-sand" data-testid="hero-cta-catalog">
                {t('home.ctaCatalog')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/historia" className="btn-outline border-sand text-sand hover:bg-sand hover:text-forest" data-testid="hero-cta-story">
                {t('home.ctaStory')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="py-20 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          {values.map((v) => (
            <div key={v.title} className="flex gap-5">
              <v.icon className="w-7 h-7 text-forest flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-2xl text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-muted2 leading-relaxed">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIALS PHILOSOPHY */}
      <section className="py-20 bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <p className="overline text-clay mb-4">{t('home.materials.overline')}</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-forest tracking-tight leading-[1.05]">
              {t('home.materials.h2a')} <em className="not-italic text-clay">{t('home.materials.h2b')}</em>.
            </h2>
          </div>
          <div className="md:col-span-7">
            <p
              className="text-base text-muted2 leading-relaxed mb-5"
              dangerouslySetInnerHTML={{ __html: t('home.materials.text') }}
            />
            <div className="flex flex-wrap gap-2">
              {['Pino', 'Olivo', 'Ciprés', 'Nogal'].map((w) => (
                <span key={w} className="text-xs px-4 py-2 border border-forest/30 text-forest tracking-wider uppercase">{w}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="overline text-clay mb-3">{t('home.featured.overline')}</p>
              <h2 className="font-serif text-4xl sm:text-5xl text-forest tracking-tight">{t('home.featured.h2')}</h2>
            </div>
            <Link to="/creaciones" className="text-sm text-forest underline underline-offset-4 hover:text-clay" data-testid="see-all-featured">
              {t('home.featured.seeAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CUSTOM CTA */}
      <section className="relative py-24 grain overflow-hidden bg-forest">
        <div className="absolute inset-0 opacity-25">
          <img src={CTA_BG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center text-sand">
          <p className="overline text-amber mb-5">{t('home.customCta.overline')}</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-6">
            {t('home.customCta.h2a')}<br/>
            <em className="not-italic text-amber">{t('home.customCta.h2b')}</em>.
          </h2>
          <p className="text-base sm:text-lg text-sand/80 max-w-2xl mx-auto leading-relaxed mb-8">{t('home.customCta.text')}</p>
          <Link to="/personalizada" className="btn-primary bg-amber text-ink hover:bg-sand hover:text-forest" data-testid="home-custom-cta">
            {t('home.customCta.cta')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 lg:col-span-7">
            <div className="aspect-[5/4] overflow-hidden">
              <img src={STORY_IMG} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-5 md:pl-6">
            <p className="overline text-clay mb-4">{t('home.storyTeaser.overline')}</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-forest tracking-tight mb-6 leading-[1.05]">
              {t('home.storyTeaser.h2a')}<br/>
              <em className="not-italic text-clay">{t('home.storyTeaser.h2b')}</em>.
            </h2>
            <p className="text-base text-muted2 leading-relaxed mb-8">{t('home.storyTeaser.text')}</p>
            <Link to="/historia" className="btn-outline" data-testid="story-cta">{t('home.storyTeaser.cta')}</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
