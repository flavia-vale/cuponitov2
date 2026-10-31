import { createLazyFileRoute } from '@tanstack/react-router';
import DirectoryPage from '@/pages/DirectoryPage';

export const Route = createLazyFileRoute('/grupos-de-promocao')({
  component: DirectoryPage,
});
