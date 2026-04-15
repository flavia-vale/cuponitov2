import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

// QueryClient Singleton
export const queryClient = new QueryClient();

// Criando e exportando a instância do router diretamente
export const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

// Registrando o router para tipagem do TanStack
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}