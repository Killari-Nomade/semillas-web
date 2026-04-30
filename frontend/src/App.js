import "@/App.css";
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from 'sonner';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import CartSheet from './components/CartSheet';
import WhatsAppFloat from './components/WhatsAppFloat';
import AdminProtected from './components/AdminProtected';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Story from './pages/Story';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CustomOrder from './pages/CustomOrder';

const StorefrontLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
    <CartSheet />
    <WhatsAppFloat />
  </>
);

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
      </Routes>
    );
  }

  return (
    <StorefrontLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/historia" element={<Story />} />
        <Route path="/personalizada" element={<CustomOrder />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </StorefrontLayout>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="bottom-center" richColors />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
