import { createLazyFileRoute } from '@tanstack/react-router';
import StorePage from '@/pages/StorePage';

export const Route = createLazyFileRoute('/desconto/$slug')({
  component: StorePage,
});
