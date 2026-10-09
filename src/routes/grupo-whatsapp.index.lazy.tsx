import { createLazyFileRoute } from '@tanstack/react-router';
import WhatsappGroupPage from '@/pages/WhatsappGroupPage';

export const Route = createLazyFileRoute('/grupo-whatsapp/')({
  component: () => <WhatsappGroupPage />,
});
