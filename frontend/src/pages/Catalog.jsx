import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'all', label: 'Todo' },
  { key: 'collares', label: 'Collares' },
  { key: 'dijes', label: 'Dijes' },
  { key: 'aretes', label: 'Aretes' },
  { key: 'anillos', label: 'Anillos' },
  { key: 'pulseras', label: 'Pulseras' },
];

const Catalog = () => {
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
          <p className="overline text-clay mb-3">Catálogo completo</p>
          <h1 className="font-serif text-5xl md:text-6xl text-forest tracking-tight mb-4">
            Joyas con <em className="not-italic text-clay">alma de bosque</em>
          </h1>
          <p className="text-muted2 leading-relaxed">
            Cada pieza es única e irrepetible. Elige la tuya.
          </p>
        </div>

        {/* Category filter */}
        <div className="border-b border-line mb-12 overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                data-testid={`filter-${c.key}`}
                className={`px-5 py-3 text-sm tracking-wide transition-colors border-b-2 ${
                  cat === c.key ? 'border-forest text-forest font-medium' : 'border-transparent text-muted2 hover:text-forest'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-muted2">Cargando piezas…</p>
        ) : products.length === 0 ? (
          <p className="text-center py-20 text-muted2">No hay piezas en esta categoría todavía.</p>
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
