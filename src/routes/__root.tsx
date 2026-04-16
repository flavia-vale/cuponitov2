import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <div className="text-6xl">😕</div>
      <h1 className="text-2xl font-bold">404 — Página não encontrada</h1>
      <p className="text-muted-foreground">A página que você procura não existe.</p>
      <Link to="/" className="text-primary font-bold hover:underline">
        Voltar ao início
      </Link>
    </div>
  ),
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Outlet />
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  );
}
