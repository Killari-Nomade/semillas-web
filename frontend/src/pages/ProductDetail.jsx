import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Leaf } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data)).catch(() => setProduct(false));
  }, [id]);

  if (product === false) {
    return <main className="py-32 text-center"><p className="text-muted2">Producto no encontrado</p><Link to="/catalogo" className="btn-outline mt-6 inline-block">Volver</Link></main>;
  }
  if (!product) return <main className="py-32 text-center text-muted2">Cargando…</main>;

  return (
    <main className="py-12" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-muted2 hover:text-forest mb-8" data-testid="back-to-catalog">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-line overflow-hidden">
              {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
            </div>
          </div>

          {/* Info */}
          <div className="md:sticky md:top-28 self-start">
            <p className="overline text-clay mb-3">{product.category}</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-forest tracking-tight mb-4 leading-[1.05]">{product.name}</h1>
            <p className="font-serif text-3xl text-ink mb-8" data-testid="product-price">${product.price.toFixed(2)} <span className="text-base text-muted2">USD</span></p>
            <p className="text-base text-muted2 leading-relaxed mb-8">{product.description}</p>

            {product.materials?.length > 0 && (
              <div className="mb-8 border-t border-b border-line py-5">
                <p className="overline text-muted2 mb-3 flex items-center gap-2"><Leaf className="w-3.5 h-3.5" /> Materiales</p>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((m, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 border border-line text-ink">{m}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="overline text-muted2 mb-3">Cantidad</p>
              <div className="flex items-center border border-line w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 hover:bg-line" data-testid="detail-qty-minus">−</button>
                <span className="px-6 text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2.5 hover:bg-line" data-testid="detail-qty-plus">+</button>
              </div>
            </div>

            <button
              onClick={() => add(product, qty)}
              className="btn-primary w-full justify-center"
              data-testid="add-to-cart-btn"
              disabled={product.stock <= 0}
            >
              <ShoppingBag className="w-4 h-4" /> {product.stock > 0 ? 'Agregar a la canasta' : 'Sin stock'}
            </button>

            <p className="text-xs text-muted2 mt-6 leading-relaxed">
              📦 Envío con cuidado a todo el mundo · Pago seguro con PayPal
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
