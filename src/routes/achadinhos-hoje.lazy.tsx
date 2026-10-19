import { createLazyFileRoute } from '@tanstack/react-router';
import AchadinhosHojePage from '@/pages/AchadinhosHojePage';

export const Route = createLazyFileRoute('/achadinhos-hoje')({
  component: () => <AchadinhosHojePage />,
});
