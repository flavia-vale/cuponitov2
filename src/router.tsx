import { createRouter, createBrowserHistory } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

const browserHistory = createBrowserHistory();

export function createAppRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return createRouter({
    routeTree,
    history: browserHistory,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}