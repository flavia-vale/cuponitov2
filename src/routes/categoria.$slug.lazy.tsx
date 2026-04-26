import { createLazyFileRoute } from '@tanstack/react-router';
import CategoryPage from '@/pages/CategoryPage';

export const Route = createLazyFileRoute('/categoria/$slug')({
  component: CategoryPage,
});
