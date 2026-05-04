import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useI18n } from '../i18n/I18nContext';

const CAT_KEYS = ['all', 'collares', 'dijes', 'aretes', 'anillos', 'pulseras', 'llaveros', 'colgantes-celular', 'motivos'];

const Catalog = () => {
  const { t } = useI18n();
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = cat !== 'all' ? { category: cat } : {};
    api.get('/products', { params })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <main className="py-16 md:py-20" data-testid="catalog-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="overline text-clay mb-3">{t('catalog.overline')}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-forest tracking-tight mb-4">
            {t('catalog.h1a')} <em className="not-italic text-clay">{t('catalog.h1b')}</em>
          </h1>
          <p className="text-muted2 leading-relaxed">{t('catalog.subtitle')}</p>
        </div>

        <div className="border-b border-line mb-12 overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {CAT_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => setCat(k)}
                data-testid={`filter-${k}`}
                className={`px-5 py-3 text-sm tracking-wide transition-colors border-b-2 ${
                  cat === k ? 'border-forest text-forest font-medium' : 'border-transparent text-muted2 hover:text-forest'
                }`}
              >
                {t(`category.${k}`)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-muted2">{t('catalog.loading')}</p>
        ) : products.length === 0 ? (
          <p className="text-center py-20 text-muted2">{t('catalog.empty')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
};

export default Catalog;
