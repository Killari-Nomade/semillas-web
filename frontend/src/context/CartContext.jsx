import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('sn_cart');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sn_cart', JSON.stringify(items));
  }, [items]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product_id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.images?.[0] || '',
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((productId) =>
    setItems((prev) => prev.filter((i) => i.product_id !== productId)), []);

  const updateQty = useCallback((productId, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity: Math.max(1, qty) } : i))
    ), []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const value = useMemo(
    () => ({ items, add, remove, updateQty, clear, subtotal, count, open, setOpen }),
    [items, add, remove, updateQty, clear, subtotal, count, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
