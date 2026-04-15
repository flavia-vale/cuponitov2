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
 * Componente que intercepta o redirecionamento do 404.html
 * Ele lê o parâmetro 'p' da URL e navega internamente para a rota correta.
 */
function SPAUrlHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('p');
    
    if (redirectPath) {
      // Remove o parâmetro 'p' da URL e faz a navegação interna silenciosa
      navigate(decodeURIComponent(redirectPath), { replace: true });
    }
  }, [navigate, location]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SPAUrlHandler />
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