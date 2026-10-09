import GroupJoinCTA from '@/components/GroupJoinCTA';

interface BlogWhatsAppCTAProps {
  source?: string;
  context?: string | null;
}

const BlogWhatsAppCTA = ({ source = 'blog_whatsapp_cta', context = null }: BlogWhatsAppCTAProps) => (
  <GroupJoinCTA
    title="Cupons em tempo real no WhatsApp"
    text="Receba as ofertas relâmpago e os cupons no celular assim que saem."
    learnMoreHref="/grupo-whatsapp"
    source={source}
    context={context}
  />
);

export default BlogWhatsAppCTA;
