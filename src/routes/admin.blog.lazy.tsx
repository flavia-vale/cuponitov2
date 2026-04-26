import { createLazyFileRoute } from '@tanstack/react-router';
import AdminBlogPage from '@/pages/AdminBlogPage';

export const Route = createLazyFileRoute('/admin/blog')({
  component: AdminBlogPage,
});
