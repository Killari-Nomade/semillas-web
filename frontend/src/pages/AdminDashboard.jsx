import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

const empty = { name: '', slug: '', category: 'collares', description: '', price: 0, images: [''], materials: [''], stock: 10, featured: false };

const AdminDashboard = () => {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [p, o, s] = await Promise.all([
      api.get('/products'),
      api.get('/orders'),
      api.get('/admin/stats'),
    ]);
    setProducts(p.data);
    setOrders(o.data);
    setStats(s.data);
  };

  useEffect(() => { load(); }, []);

  const handleLogout = () => { logout(); nav('/admin/login'); };

  const startNew = () => { setForm(empty); setEditing('new'); };
  const startEdit = (p) => {
    setForm({
      ...p,
      images: p.images?.length ? p.images : [''],
      materials: p.materials?.length ? p.materials : [''],
    });
    setEditing(p.id);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      images: form.images.filter(Boolean),
      materials: form.materials.filter(Boolean),
    };
    try {
      if (editing === 'new') {
        await api.post('/products', payload);
        toast.success('Producto creado');
      } else {
        await api.put(`/products/${editing}`, payload);
        toast.success('Producto actualizado');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al guardar');
    }
  };

  const del = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Eliminado');
    load();
  };

  return (
    <main className="min-h-screen bg-white" data-testid="admin-dashboard">
      <header className="border-b border-line bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="overline text-clay">Panel admin</p>
            <h1 className="font-serif text-2xl text-forest">Semillas Nómadas</h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-muted2 hover:text-forest flex items-center gap-2" data-testid="admin-logout">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Stat icon={Package} label="Productos" value={stats.products} />
            <Stat icon={ShoppingCart} label="Órdenes" value={stats.orders} sub={`${stats.paid_orders} pagadas`} />
            <Stat icon={DollarSign} label="Ingresos" value={`$${stats.revenue.toFixed(2)}`} sub="USD" />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-line mb-6">
          <div className="flex gap-1">
            {['products', 'orders'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm border-b-2 ${tab === t ? 'border-forest text-forest font-medium' : 'border-transparent text-muted2'}`}
                data-testid={`admin-tab-${t}`}
              >
                {t === 'products' ? 'Productos' : 'Órdenes'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={startNew} className="btn-primary" data-testid="admin-new-product"><Plus className="w-4 h-4" /> Nuevo</button>
            </div>
            <div className="border border-line">
              <table className="w-full text-sm">
                <thead className="bg-sand">
                  <tr className="text-left">
                    <th className="px-4 py-3 overline text-muted2">Nombre</th>
                    <th className="px-4 py-3 overline text-muted2">Categoría</th>
                    <th className="px-4 py-3 overline text-muted2">Precio</th>
                    <th className="px-4 py-3 overline text-muted2">Stock</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-line" data-testid={`admin-product-${p.id}`}>
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3 text-muted2">{p.category}</td>
                      <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-sand" data-testid={`edit-${p.id}`}><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => del(p.id)} className="p-1.5 hover:bg-sand text-destructive" data-testid={`delete-${p.id}`}><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="border border-line">
            <table className="w-full text-sm">
              <thead className="bg-sand">
                <tr className="text-left">
                  <th className="px-4 py-3 overline text-muted2">ID</th>
                  <th className="px-4 py-3 overline text-muted2">Cliente</th>
                  <th className="px-4 py-3 overline text-muted2">Total</th>
                  <th className="px-4 py-3 overline text-muted2">Estado</th>
                  <th className="px-4 py-3 overline text-muted2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted2">Aún no hay órdenes.</td></tr>}
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-line" data-testid={`admin-order-${o.id}`}>
                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{o.customer_name}<br/><span className="text-muted2 text-xs">{o.customer_email}</span></td>
                    <td className="px-4 py-3">${o.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 ${o.status === 'paid' ? 'bg-forest text-sand' : 'bg-line text-ink'}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted2 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto" data-testid="admin-product-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-forest">{editing === 'new' ? 'Nuevo producto' : 'Editar producto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testid="form-name" />
            <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} testid="form-slug" />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="overline text-muted2 mb-1 block">Categoría</span>
                <select className="w-full border border-line px-3 py-2.5 text-sm bg-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="form-category">
                  {['collares', 'dijes', 'aretes', 'anillos', 'pulseras'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <Input label="Precio (USD)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} testid="form-price" />
            </div>
            <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} testid="form-stock" />
            <Input label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} testid="form-description" textarea />
            <Input label="Imagen URL" value={form.images[0] || ''} onChange={(v) => setForm({ ...form, images: [v] })} testid="form-image" />
            <Input label="Materiales (separados por coma)" value={form.materials.join(', ')} onChange={(v) => setForm({ ...form, materials: v.split(',').map(s => s.trim()) })} testid="form-materials" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} data-testid="form-featured" />
              Destacado
            </label>
            <div className="flex gap-3 pt-4">
              <button onClick={save} className="btn-primary" data-testid="form-save">Guardar</button>
              <button onClick={() => setEditing(null)} className="btn-outline">Cancelar</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

const Stat = ({ icon: Icon, label, value, sub }) => (
  <div className="border border-line p-5">
    <div className="flex items-center gap-3 mb-2"><Icon className="w-4 h-4 text-clay" /><span className="overline text-muted2">{label}</span></div>
    <p className="font-serif text-3xl text-forest">{value}</p>
    {sub && <p className="text-xs text-muted2 mt-1">{sub}</p>}
  </div>
);

const Input = ({ label, value, onChange, type = 'text', testid, textarea }) => (
  <label className="block">
    <span className="overline text-muted2 mb-1 block">{label}</span>
    {textarea ? (
      <textarea rows={3} className="w-full border border-line px-3 py-2.5 text-sm" value={value} onChange={(e) => onChange(e.target.value)} data-testid={testid} />
    ) : (
      <input type={type} className="w-full border border-line px-3 py-2.5 text-sm" value={value} onChange={(e) => onChange(e.target.value)} data-testid={testid} />
    )}
  </label>
);

export default AdminDashboard;
