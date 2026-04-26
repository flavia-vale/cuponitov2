import { createLazyFileRoute } from '@tanstack/react-router';
import LojasPage from '@/pages/LojasPage';

export const Route = createLazyFileRoute('/lojas')({
  component: LojasPage,
});
