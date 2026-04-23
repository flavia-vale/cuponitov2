import { createFileRoute } from '@tanstack/react-router';
import AdminBlogPage from '@/pages/AdminBlogPage';

export const Route = createFileRoute('/admin/blog')({
  component: AdminBlogPage,
});
