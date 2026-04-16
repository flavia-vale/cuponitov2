import { createFileRoute } from '@tanstack/react-router';
import StorePage from '@/pages/StorePage';

export const Route = createFileRoute('/desconto/$slug')({
  component: StorePage,
});
