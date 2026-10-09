import { createLazyFileRoute } from '@tanstack/react-router';
import WhatsappGroupPage from '@/pages/WhatsappGroupPage';

function WhatsappGroupSlugPage() {
  const { slug } = Route.useParams();
  return <WhatsappGroupPage slug={slug} />;
}

export const Route = createLazyFileRoute('/grupo-whatsapp/$slug')({
  component: WhatsappGroupSlugPage,
});
