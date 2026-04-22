import { createFileRoute } from '@tanstack/react-router';
import AdminBlogPage from '@/pages/AdminBlogPage';

export const Route = createFileRoute('/adminblog')({
  component: AdminBlogPage,
});
