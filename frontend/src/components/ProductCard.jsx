import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

const JEWELRY_CATS = ['collares', 'dijes', 'aretes', 'anillos', 'pulseras'];

const ProductCard = ({ product }) => {
  const { t } = useI18n();
  const showLowStock =
    JEWELRY_CATS.includes(product.category) && product.stock > 0 && product.stock <= 3;
  const categoryLabel = t(`category.${product.category}`) || product.category;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group block"
      data-testid={`product-card-${product.id}`}
    >
      <div className="product-img-wrap aspect-[4/5] bg-line mb-4 relative">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-img w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {showLowStock && (
          <span
            className="absolute top-3 left-3 bg-clay text-sand text-[10px] tracking-[0.15em] uppercase px-2.5 py-1"
            data-testid={`low-stock-${product.id}`}
          >
            {t('product.lowStockCard', { n: product.stock })}
          </span>
        )}
      </div>
      <p className="overline text-muted2 mb-1">{categoryLabel}</p>
      <h3 className="font-serif text-xl text-ink leading-tight mb-1">{product.name}</h3>
      <p className="text-sm text-forest font-medium">${product.price.toFixed(2)} USD</p>
    </Link>
  );
};

export default ProductCard;
