import { createFileRoute } from '@tanstack/react-router';
import CuponsPage from '@/pages/CuponsPage';

export const Route = createFileRoute('/cupons')({
  component: CuponsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) ?? '',
  }),
});
