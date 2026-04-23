import { createFileRoute } from '@tanstack/react-router';
import AdminIndex from '@/pages/AdminIndex';

export const Route = createFileRoute('/admin/')({
  component: AdminIndex,
});
