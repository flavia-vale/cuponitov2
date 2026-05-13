import { createFileRoute } from '@tanstack/react-router';
import TermsPage from '@/pages/institutional/TermsPage';

export const Route = createFileRoute('/termos-de-uso')({
  component: TermsPage,
});
