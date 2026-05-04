import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

const STORY_IMG = 'https://images.unsplash.com/photo-1742559008386-16198f98e2b6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600';
const ART_IMG = 'https://images.unsplash.com/photo-1759523131742-af817477bcd9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';

const Story = () => {
  const { t } = useI18n();
  return (
    <main className="py-16 md:py-24" data-testid="story-page">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 mb-16">
        <p className="overline text-clay mb-4">{t('story.overline')}</p>
        <h1 className="font-serif text-5xl md:text-7xl text-forest tracking-tight leading-[1.02] mb-6">
          {t('story.h1a')}<br/>
          <em className="not-italic text-clay">{t('story.h1b')}</em>.
        </h1>
        <p className="text-lg text-muted2 leading-relaxed">{t('story.intro')}</p>
      </div>

      <section className="grain">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <img src={STORY_IMG} alt="" className="w-full h-[500px] object-cover" />
          </div>
          <div className="md:col-span-5 md:pl-6 flex flex-col justify-center">
            <p className="overline text-clay mb-3">{t('story.section1.overline')}</p>
            <h2 className="font-serif text-4xl text-forest mb-4 leading-tight">{t('story.section1.h2')}</h2>
            <p className="text-muted2 leading-relaxed mb-4">{t('story.section1.p1')}</p>
            <p className="text-muted2 leading-relaxed">{t('story.section1.p2')}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <p className="overline text-clay mb-3">{t('story.section2.overline')}</p>
            <h2 className="font-serif text-4xl text-forest mb-4 leading-tight">{t('story.section2.h2')}</h2>
            <p className="text-muted2 leading-relaxed mb-4">{t('story.section2.p1')}</p>
            <p className="text-muted2 leading-relaxed mb-4">{t('story.section2.p2')}</p>
            <ul className="space-y-2 text-sm text-muted2 list-disc pl-5">
              <li>{t('story.section2.b1')}</li>
              <li>{t('story.section2.b2')}</li>
              <li>{t('story.section2.b3')}</li>
            </ul>
          </div>
          <div className="md:col-span-7">
            <img src={ART_IMG} alt="" className="w-full h-[500px] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-forest text-sand py-20 grain">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">{t('story.cta.h2')}</h2>
          <p className="text-sand/80 mb-8 leading-relaxed">{t('story.cta.text')}</p>
          <Link to="/creaciones" className="btn-primary bg-amber text-ink hover:bg-sand hover:text-forest" data-testid="story-cta-catalog">
            {t('story.cta.button')}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Story;
