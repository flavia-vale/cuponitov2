import "./styles.css";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter, createBrowserHistory } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

// Instanciando dependências globais
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const history = createBrowserHistory();

// Criando o router no formato esperado pelo analisador estático
export const router = createRouter({
  routeTree,
  history,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

// Tratamento para evitar erro ao carregar via /index.html (comum em fallbacks de servidor)
if (typeof window !== 'undefined' && window.location.pathname === '/index.html') {
  history.push('/');
}

// Registro de tipos do roteador
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.innerHTML) {
  createRoot(rootElement).render(
    <RouterProvider router={router} />
  );
}