import { createFileRoute } from '@tanstack/react-router';
import LojasPage from '@/pages/LojasPage';

export const Route = createFileRoute('/lojas')({
  component: LojasPage,
});
