import { createRouter, createBrowserHistory } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

const browserHistory = createBrowserHistory();

export function createAppRouter() {
  const queryClient = new QueryClient();
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