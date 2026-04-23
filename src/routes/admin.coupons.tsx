import { createFileRoute } from '@tanstack/react-router';
import AdminCouponsDashboard from '@/pages/AdminCouponsDashboard';

export const Route = createFileRoute('/admin/coupons')({
  component: AdminCouponsDashboard,
});
