import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartSheet = () => {
  const { items, open, setOpen, remove, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="bg-sand border-l border-line flex flex-col w-full sm:max-w-md p-0" data-testid="cart-sheet">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-line">
          <SheetTitle className="font-serif text-2xl text-forest">Tu canasta</SheetTitle>
          <p className="overline text-muted2">{items.length} {items.length === 1 ? 'pieza' : 'piezas'}</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-muted2 mb-2">Tu canasta está vacía</p>
              <p className="text-sm text-muted2 mb-6">Descubre nuestras piezas únicas</p>
              <Link to="/creaciones" onClick={() => setOpen(false)} className="btn-outline" data-testid="empty-cart-go-catalog">
                Ver creaciones
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((i) => (
                <li key={i.product_id} className="flex gap-4 pb-5 border-b border-line" data-testid={`cart-item-${i.product_id}`}>
                  <div className="w-20 h-20 bg-line overflow-hidden flex-shrink-0">
                    {i.image && <img src={i.image} alt={i.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg text-ink leading-tight">{i.name}</p>
                    <p className="text-sm text-muted2 mt-1">${i.price.toFixed(2)} USD</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-line">
                        <button onClick={() => updateQty(i.product_id, i.quantity - 1)} className="p-1.5 hover:bg-line" data-testid={`qty-minus-${i.product_id}`}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{i.quantity}</span>
                        <button onClick={() => updateQty(i.product_id, i.quantity + 1)} className="p-1.5 hover:bg-line" data-testid={`qty-plus-${i.product_id}`}>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => remove(i.product_id)} className="text-muted2 hover:text-forest" data-testid={`remove-${i.product_id}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5 bg-white">
            <div className="flex justify-between mb-4">
              <span className="overline text-muted2">Subtotal</span>
              <span className="font-serif text-2xl text-forest" data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <button onClick={goCheckout} className="btn-primary w-full justify-center" data-testid="checkout-btn">
              Ir a pagar
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
