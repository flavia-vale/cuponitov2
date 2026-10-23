import GroupJoinCTA from '@/components/GroupJoinCTA';
import { useWhatsappGroupInfo, useWhatsappGroupPages } from '@/hooks/useWhatsappGroupPages';
import { groupCtaTitle, groupInfoForPage, groupPagePath, GROUP_HUB_SLUG, pagePath } from '@/lib/whatsappGroup';

interface BlogWhatsAppCTAProps {
  source?: string;
  context?: string | null;
  /** Grupo do post (`blog_posts.group_slug`); sem ele, o grupo geral. */
  groupSlug?: string | null;
}

const DEFAULT_TITLE = 'Cupons em tempo real no WhatsApp';
const DEFAULT_TEXT = 'Receba as ofertas relâmpago e os cupons no celular assim que saem.';

const BlogWhatsAppCTA = ({ source = 'blog_whatsapp_cta', context = null, groupSlug = null }: BlogWhatsAppCTAProps) => {
  const globalInfo = useWhatsappGroupInfo();
  // Com rascunhos: o grupo do post pode estar numa página despublicada que só guarda o link.
  const { data: pages } = useWhatsappGroupPages({ includeDrafts: true });
  const page = groupSlug ? pages?.find(item => item.slug === groupSlug) : undefined;

  if (!page) {
    return (
      <GroupJoinCTA title={DEFAULT_TITLE} text={DEFAULT_TEXT} learnMoreHref="/grupo-whatsapp" source={source} context={context} />
    );
  }

  return (
    <GroupJoinCTA
      title={groupCtaTitle(page, groupInfoForPage(globalInfo, page), DEFAULT_TITLE)}
      groupSlug={page.slug}
      learnMoreHref={page.is_published ? pagePath(page) : groupPagePath(GROUP_HUB_SLUG)}
      source={source}
      context={context}
    />
  );
};

export default BlogWhatsAppCTA;
