import { createLazyFileRoute } from '@tanstack/react-router';
import BlogPost from '@/pages/BlogPost';

export const Route = createLazyFileRoute('/blog/$slug')({
  component: BlogPost,
});
