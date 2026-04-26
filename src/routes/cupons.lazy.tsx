import { createLazyFileRoute } from '@tanstack/react-router';
import CuponsPage from '@/pages/CuponsPage';

export const Route = createLazyFileRoute('/cupons')({
  component: CuponsPage,
});
