import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [paypalCfg, setPaypalCfg] = useState(null);
  const [order, setOrder] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '', shipping_address: '', notes: '',
  });

  useEffect(() => {
    api.get('/paypal/config').then((r) => setPaypalCfg(r.data)).catch(() => setPaypalCfg({ enabled: false }));
  }, []);

  if (success) {
    return (
      <main className="py-32" data-testid="checkout-success">
        <div className="max-w-xl mx-auto text-center px-6">
          <CheckCircle2 className="w-16 h-16 text-forest mx-auto mb-6" />
          <h1 className="font-serif text-4xl text-forest mb-4">¡Pago confirmado!</h1>
          <p className="text-muted2 mb-8">
            Hemos recibido tu pedido. Te contactaremos pronto al correo {form.customer_email} con los detalles del envío.
          </p>
          <button onClick={() => navigate('/creaciones')} className="btn-outline" data-testid="success-back-catalog">Seguir explorando</button>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !order) {
    return (
      <main className="py-32 text-center" data-testid="checkout-empty">
        <p className="text-muted2 mb-6">Tu canasta está vacía.</p>
        <button onClick={() => navigate('/creaciones')} className="btn-outline">Ver creaciones</button>
      </main>
    );
  }

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const createOrder = async () => {
    if (!form.customer_name || !form.customer_email || !form.shipping_address) {
      toast.error('Completa nombre, email y dirección');
      return null;
    }
    try {
      const r = await api.post('/orders', { ...form, items });
      setOrder(r.data);
      return r.data;
    } catch (e) {
      toast.error('No se pudo crear la orden');
      return null;
    }
  };

  const handleDemoPay = async () => {
    const created = order || await createOrder();
    if (!created) return;
    try {
      const cr = await api.post(`/paypal/create-order/${created.id}`);
      await api.post(`/paypal/capture/${created.id}`, { paypal_order_id: cr.data.id });
      clear();
      setSuccess(true);
    } catch (e) {
      toast.error('Error al procesar el pago');
    }
  };

  return (
    <main className="py-12 md:py-20" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <p className="overline text-clay mb-3">Finalizar compra</p>
          <h1 className="font-serif text-4xl text-forest mb-8 tracking-tight">Detalles de envío</h1>

          <div className="space-y-5">
            <Field label="Nombre completo *" testid="checkout-name" value={form.customer_name} onChange={handleChange('customer_name')} />
            <Field label="Email *" testid="checkout-email" type="email" value={form.customer_email} onChange={handleChange('customer_email')} />
            <Field label="Teléfono" testid="checkout-phone" value={form.customer_phone} onChange={handleChange('customer_phone')} />
            <Field label="Dirección de envío *" testid="checkout-address" value={form.shipping_address} onChange={handleChange('shipping_address')} textarea />
            <Field label="Notas adicionales" testid="checkout-notes" value={form.notes} onChange={handleChange('notes')} textarea />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border border-line p-6 md:p-8 sticky top-28">
            <h2 className="font-serif text-2xl text-forest mb-5">Tu pedido</h2>
            <ul className="space-y-3 mb-5 max-h-72 overflow-auto">
              {items.map((i) => (
                <li key={i.product_id} className="flex justify-between text-sm gap-3">
                  <span className="text-ink">{i.name} <span className="text-muted2">× {i.quantity}</span></span>
                  <span className="text-ink whitespace-nowrap">${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line pt-4 mb-6">
              <span className="overline text-muted2">Total</span>
              <span className="font-serif text-3xl text-forest" data-testid="checkout-total">${subtotal.toFixed(2)} USD</span>
            </div>

            {paypalCfg?.enabled ? (
              <PayPalScriptProvider options={{ clientId: paypalCfg.client_id, currency: 'USD' }}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
                  createOrder={async () => {
                    const created = order || await createOrder();
                    if (!created) throw new Error('order_failed');
                    const r = await api.post(`/paypal/create-order/${created.id}`);
                    return r.data.id;
                  }}
                  onApprove={async (data) => {
                    if (!order) return;
                    await api.post(`/paypal/capture/${order.id}`, { paypal_order_id: data.orderID });
                    clear();
                    setSuccess(true);
                  }}
                  onError={() => toast.error('Pago cancelado o falló')}
                />
              </PayPalScriptProvider>
            ) : (
              <>
                <button onClick={handleDemoPay} className="btn-primary w-full justify-center" data-testid="demo-pay-btn">
                  Pagar (Modo Demo)
                </button>
                <p className="text-[11px] text-muted2 mt-3 leading-relaxed">
                  PayPal en modo demo. Configura PAYPAL_CLIENT_ID y PAYPAL_SECRET en el backend para activar pagos reales.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const Field = ({ label, testid, value, onChange, type = 'text', textarea }) => (
  <label className="block">
    <span className="overline text-muted2 mb-2 block">{label}</span>
    {textarea ? (
      <textarea
        rows={3}
        className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest"
        value={value}
        onChange={onChange}
        data-testid={testid}
      />
    ) : (
      <input
        type={type}
        className="w-full bg-white border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest"
        value={value}
        onChange={onChange}
        data-testid={testid}
      />
    )}
  </label>
);

export default Checkout;
