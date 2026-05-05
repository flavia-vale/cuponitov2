import { createFileRoute } from '@tanstack/react-router';
import AboutPage from '@/pages/institutional/AboutPage';

export const Route = createFileRoute('/quem-somos')({
  component: AboutPage,
});
