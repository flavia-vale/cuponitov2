import { createLazyFileRoute } from '@tanstack/react-router';
import OffersPage from '@/pages/OffersPage';

function OffersSlugPage() {
  const { slug } = Route.useParams();
  return <OffersPage slug={slug} />;
}

export const Route = createLazyFileRoute('/ofertas/$slug')({
  component: OffersSlugPage,
});
