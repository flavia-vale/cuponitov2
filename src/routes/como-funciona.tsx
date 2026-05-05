import { createFileRoute } from '@tanstack/react-router';
import HowItWorksPage from '@/pages/institutional/HowItWorksPage';

export const Route = createFileRoute('/como-funciona')({
  component: HowItWorksPage,
});
