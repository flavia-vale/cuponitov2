import { createLazyFileRoute } from '@tanstack/react-router';
import BlogList from '@/pages/BlogList';

export const Route = createLazyFileRoute('/blog/')({
  component: BlogList,
});
