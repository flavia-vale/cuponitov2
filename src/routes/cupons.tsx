import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cupons')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) ?? '',
  }),
});
