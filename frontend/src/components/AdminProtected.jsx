import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtected = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted2">Cargando…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminProtected;
