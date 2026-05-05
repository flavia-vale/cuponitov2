import { createFileRoute } from '@tanstack/react-router';
import FaqPage from '@/pages/institutional/FaqPage';

export const Route = createFileRoute('/perguntas-frequentes')({
  component: FaqPage,
});
