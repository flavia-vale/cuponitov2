import { createLazyFileRoute } from '@tanstack/react-router';
import AdminAccessDenied from '@/pages/AdminAccessDenied';

export const Route = createLazyFileRoute('/admin/access-denied')({
  component: AdminAccessDenied,
});
