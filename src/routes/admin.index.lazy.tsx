import { createLazyFileRoute } from '@tanstack/react-router';
import AdminIndex from '@/pages/AdminIndex';

export const Route = createLazyFileRoute('/admin/')({
  component: AdminIndex,
});
