"use client";

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/sonner";
import Home from './pages/Home';
import StoreDetail from './pages/StoreDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

/**
 * Gerenciador de Redirecionamento SPA
 * Detecta se viemos de um 404 (parâmetro ?path=) e restaura a URL original
 */
function SPANavigationHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('path');
    
    if (redirectPath) {
      const decodedPath = decodeURIComponent(redirectPath);
      // 1. Limpa a URL visualmente (remove o ?path=...) sem recarregar
      window.history.replaceState(null, '', decodedPath);
      // 2. Faz a navegação interna no React Router
      navigate(decodedPath, { replace: true });
    }
  }, [navigate, location]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SPANavigationHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/desconto/:slug" element={<StoreDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}