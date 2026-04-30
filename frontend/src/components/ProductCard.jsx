import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link
    to={`/producto/${product.id}`}
    className="group block"
    data-testid={`product-card-${product.id}`}
  >
    <div className="product-img-wrap aspect-[4/5] bg-line mb-4">
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-img w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
    <p className="overline text-muted2 mb-1">{product.category}</p>
    <h3 className="font-serif text-xl text-ink leading-tight mb-1">{product.name}</h3>
    <p className="text-sm text-forest font-medium">${product.price.toFixed(2)} USD</p>
  </Link>
);

export default ProductCard;
