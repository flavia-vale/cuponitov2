import { createLazyFileRoute } from '@tanstack/react-router';
import AdminLogin from '@/pages/AdminLogin';

export const Route = createLazyFileRoute('/admin/login')({
  component: AdminLogin,
});
