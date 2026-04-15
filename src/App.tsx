import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";

const Index = lazy(() => import("./pages/Index.tsx"));
const StorePage = lazy(() => import("./pages/StorePage.tsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Carregando...</div>}>
          <Routes>
            <Route path="/" element={<><Header /><Index /></>} />
            <Route path="/blog" element={<><Header /><BlogPage /></>} />
            <Route path="/blog/:slug" element={<><Header /><BlogPostPage /></>} />
            <Route path="/desconto/:slug" element={<><Header /><StorePage /></>} />
            <Route path="*" element={<><Header /><NotFound /></>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;