import { createRouter, createHashHistory } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

const hashHistory = createHashHistory();

export function createAppRouter() {
  const queryClient = new QueryClient();
  return createRouter({
    routeTree,
    history: hashHistory,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}