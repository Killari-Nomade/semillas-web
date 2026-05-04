import React, { useCallback, useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Package, ShoppingCart, DollarSign, Sparkles, Upload, HelpCircle, Sun, Square, Focus, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { BACKEND_URL } from '../lib/api';

const empty = { name: '', slug: '', category: 'collares', description: '', price: 0, images: [''], materials: [''], stock: 10, featured: false };

const AdminDashboard = () => {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    const [p, o, c, s] = await Promise.all([
      api.get('/products'),
      api.get('/orders'),
      api.get('/custom-orders'),
      api.get('/admin/stats'),
    ]);
    setProducts(p.data);
    setOrders(o.data);
    setCustomOrders(c.data);
    setStats(s.data);
  }, []);

  useEffect(() => { load(); }, [load]);

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Stat icon={Package} label="Productos" value={stats.products} />
            <Stat icon={ShoppingCart} label="Órdenes" value={stats.orders} sub={`${stats.paid_orders} pagadas`} />
            <Stat icon={DollarSign} label="Ingresos" value={`$${stats.revenue.toFixed(2)}`} sub="USD" />
            <Stat icon={Sparkles} label="Personalizadas" value={stats.custom_orders ?? 0} sub={`${stats.custom_new ?? 0} nuevas`} />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-line mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              ['products', 'Productos'],
              ['orders', 'Órdenes'],
              ['custom', 'Personalizadas'],
            ].map(([t, l]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm border-b-2 whitespace-nowrap ${tab === t ? 'border-forest text-forest font-medium' : 'border-transparent text-muted2'}`}
                data-testid={`admin-tab-${t}`}
              >
                {l}
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

        {tab === 'custom' && (
          <div className="space-y-4">
            {customOrders.length === 0 && <p className="px-4 py-12 text-center text-muted2 border border-line">Aún no hay solicitudes personalizadas.</p>}
            {customOrders.map((co) => (
              <CustomOrderCard key={co.id} co={co} onUpdated={load} />
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <ProductFormDialog
        editing={editing}
        setEditing={setEditing}
        form={form}
        setForm={setForm}
        save={save}
      />
    </main>
  );
};

const ProductFormDialog = ({ editing, setEditing, form, setForm, save }) => (
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
              {['collares', 'dijes', 'aretes', 'anillos', 'pulseras', 'llaveros', 'colgantes-celular', 'motivos'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <Input label="Precio (USD)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} testid="form-price" />
        </div>
        <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} testid="form-stock" />
        <Input label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} testid="form-description" textarea />
        <ImageField
          value={form.images[0] || ''}
          onChange={(url) => setForm({ ...form, images: [url] })}
        />
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
);

const Stat = ({ icon: Icon, label, value, sub }) => (
  <div className="border border-line p-5">
    <div className="flex items-center gap-3 mb-2"><Icon className="w-4 h-4 text-clay" /><span className="overline text-muted2">{label}</span></div>
    <p className="font-serif text-3xl text-forest">{value}</p>
    {sub && <p className="text-xs text-muted2 mt-1">{sub}</p>}
  </div>
);

const STATUSES = ['nuevo', 'contactado', 'cotizado', 'en_proceso', 'completado', 'cancelado'];

const CustomOrderCard = ({ co, onUpdated }) => {
  const updateStatus = async (status) => {
    await api.patch(`/custom-orders/${co.id}`, { status });
    toast.success('Estado actualizado');
    onUpdated();
  };
  return (
    <div className="border border-line p-5 bg-white" data-testid={`admin-custom-${co.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-serif text-xl text-forest leading-tight">{co.customer_name}</p>
          <p className="text-xs text-muted2">{co.customer_email} {co.customer_phone && `· ${co.customer_phone}`}</p>
        </div>
        <select value={co.status} onChange={(e) => updateStatus(e.target.value)} className="border border-line px-3 py-1.5 text-xs bg-white" data-testid={`custom-status-${co.id}`}>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 text-sm mb-3">
        <div><span className="overline text-muted2 block mb-1">Tipo</span>{co.jewelry_type}</div>
        <div><span className="overline text-muted2 block mb-1">Presupuesto</span>${co.budget} USD</div>
        <div><span className="overline text-muted2 block mb-1">Fecha deseada</span>{co.deadline || '—'}</div>
      </div>
      <div className="text-sm mb-2">
        <span className="overline text-muted2 block mb-1">Elemento natural</span>
        {co.element_description}
      </div>
      {co.inspiration_url && (
        <div className="text-sm mb-2">
          <span className="overline text-muted2 block mb-1">Inspiración</span>
          <a href={co.inspiration_url} target="_blank" rel="noopener noreferrer" className="text-forest underline break-all">{co.inspiration_url}</a>
        </div>
      )}
      {co.notes && <div className="text-sm mb-2"><span className="overline text-muted2 block mb-1">Notas</span>{co.notes}</div>}
      <p className="text-xs text-muted2 mt-3">Recibido: {new Date(co.created_at).toLocaleString()}</p>
    </div>
  );
};

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

const ImageField = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen supera 10 MB');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const r = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      const fullUrl = `${BACKEND_URL}${r.data.url}`;
      onChange(fullUrl);
      toast.success('Imagen subida');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al subir');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="overline text-muted2">Imagen del producto</span>
        <button
          type="button"
          onClick={() => setTipsOpen(true)}
          className="text-xs text-clay hover:text-forest flex items-center gap-1"
          data-testid="photo-tips-btn"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Tips de fotografía
        </button>
      </div>
      <div className="flex gap-3 items-start">
        <div className="w-24 h-24 bg-line flex-shrink-0 overflow-hidden border border-line">
          {value ? <img src={value} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted2 text-xs">sin foto</div>}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            data-testid="form-image-file"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-outline w-full justify-center text-xs py-2"
            data-testid="form-image-upload"
          >
            <Upload className="w-3.5 h-3.5 inline mr-2" />
            {uploading ? 'Subiendo…' : 'Subir desde tu equipo'}
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…o pega URL externa (Unsplash, etc.)"
            className="w-full border border-line px-3 py-2 text-xs"
            data-testid="form-image"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted2 mt-1">Formatos: JPG, PNG, WebP, GIF · Máx 10 MB</p>
      <PhotoTipsDialog open={tipsOpen} onClose={() => setTipsOpen(false)} />
    </div>
  );
};

const TIPS = [
  { icon: Sun, title: 'Luz natural', text: 'Fotografía junto a una ventana en un día nublado. La luz suave resalta el brillo de la resina sin reflejos duros.' },
  { icon: Square, title: 'Fondo neutro', text: 'Usa un fondo simple y texturado: madera clara, lino, piedra, papel kraft. Evita fondos con estampado que distraigan.' },
  { icon: Focus, title: 'Enfoque al detalle', text: 'Acércate lo suficiente para que se vean los elementos dentro de la resina. La joya debe llenar al menos el 60% del encuadre.' },
  { icon: Eye, title: 'Dos ángulos mínimo', text: 'Una foto general (toda la pieza) + una de detalle (zoom al elemento natural). Si puedes, añade una "de uso" (en la mano o cuello).' },
];

const INSPIRATION = [
  { url: 'https://images.unsplash.com/photo-1610918122969-b6cbbc2bdc08?crop=entropy&cs=srgb&fm=jpg&q=85&w=600', alt: 'Detalle botánico con fondo limpio' },
  { url: 'https://images.unsplash.com/photo-1630628123261-72dd7c75bc02?crop=entropy&cs=srgb&fm=jpg&q=85&w=600', alt: 'Resina con flor, luz lateral' },
  { url: 'https://images.unsplash.com/photo-1610819739861-bc4b791da150?crop=entropy&cs=srgb&fm=jpg&q=85&w=600', alt: 'Colgante con musgo, enfoque cercano' },
  { url: 'https://images.unsplash.com/photo-1773165896916-e13ff8e0f801?crop=entropy&cs=srgb&fm=jpg&q=85&w=600', alt: 'Resina dorada sobre madera' },
];

const PhotoTipsDialog = ({ open, onClose }) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto" data-testid="photo-tips-dialog">
      <DialogHeader>
        <p className="overline text-clay">Guía rápida</p>
        <DialogTitle className="font-serif text-3xl text-forest leading-tight">Cómo fotografiar tus piezas</DialogTitle>
      </DialogHeader>
      <div className="mt-6 space-y-8">
        <p className="text-sm text-muted2 leading-relaxed">
          No hace falta equipo profesional — tu móvil es suficiente. Estos principios marcan la diferencia entre una foto común y una que enamora a la primera vista:
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {TIPS.map((t) => (
            <div key={t.title} className="border border-line p-5">
              <div className="flex items-start gap-3 mb-2">
                <t.icon className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                <h4 className="font-serif text-lg text-ink leading-tight">{t.title}</h4>
              </div>
              <p className="text-sm text-muted2 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="overline text-clay mb-3">Referencias visuales</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INSPIRATION.map((img) => (
              <div key={img.url} className="aspect-square overflow-hidden bg-line">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted2 mt-2">Observa: fondos limpios, luz suave, el elemento natural siempre visible y en foco.</p>
        </div>

        <div className="bg-sand border border-line p-5">
          <p className="overline text-clay mb-2">Checklist antes de subir</p>
          <ul className="text-sm text-muted2 space-y-1 list-disc pl-5">
            <li>¿La foto está enfocada al detalle del elemento natural?</li>
            <li>¿El fondo es neutro y no distrae?</li>
            <li>¿La luz es natural (no flash, no fluorescente)?</li>
            <li>¿La imagen está recortada vertical u horizontal — no cuadrada con mucho espacio vacío?</li>
            <li>¿El color de la resina se ve fiel a como es en realidad?</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-primary" data-testid="photo-tips-close">Entendido</button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AdminDashboard;
