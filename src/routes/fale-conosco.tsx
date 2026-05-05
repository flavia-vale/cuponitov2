import { createFileRoute } from '@tanstack/react-router';
import ContactPage from '@/pages/institutional/ContactPage';

export const Route = createFileRoute('/fale-conosco')({
  component: ContactPage,
});
