import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@semillasnomadas.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenida');
      nav('/admin');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al ingresar');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6" data-testid="admin-login-page">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-line p-10">
        <p className="overline text-clay mb-3">Panel administrador</p>
        <h1 className="font-serif text-4xl text-forest mb-8 tracking-tight">Ingresa</h1>

        <label className="block mb-4">
          <span className="overline text-muted2 mb-2 block">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" data-testid="admin-email-input" />
        </label>
        <label className="block mb-6">
          <span className="overline text-muted2 mb-2 block">Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-line px-4 py-3 text-sm focus:outline-none focus:border-forest" data-testid="admin-password-input" />
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center" data-testid="admin-login-submit">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
