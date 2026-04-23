import { createFileRoute } from '@tanstack/react-router';
import AdminAccessDenied from '@/pages/AdminAccessDenied';

export const Route = createFileRoute('/admin/access-denied')({
  component: AdminAccessDenied,
});
