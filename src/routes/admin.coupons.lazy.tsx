import { createLazyFileRoute } from '@tanstack/react-router';
import AdminCouponsDashboard from '@/pages/AdminCouponsDashboard';

export const Route = createLazyFileRoute('/admin/coupons')({
  component: AdminCouponsDashboard,
});
