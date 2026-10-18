import GroupJoinCTA from '@/components/GroupJoinCTA';

type Variant = 'urgency' | 'social-proof' | 'store';

interface WhatsAppCTAProps {
  variant: Variant;
  storeName?: string;
  /** Página do grupo da loja (o link dela vale no botão). Padrão: link global. */
  groupSlug?: string | null;
  /** Página do grupo no site — link interno "como funciona", que também conta para o SEO. */
  learnMoreHref?: string;
}

function getCopy(variant: Variant, storeName?: string): { title: string; text: string } {
  switch (variant) {
    case 'urgency':
      return {
        title: 'Os melhores cupons acabam em minutos',
        text: 'Receba as ofertas e os cupons no celular assim que eles saem, antes de esgotar.',
      };
    case 'social-proof':
      return {
        title: 'Receba as ofertas no WhatsApp',
        text: 'Cupons e achadinhos de Shopee, Mercado Livre, Amazon, Magalu e Shein, direto no seu celular.',
      };
    case 'store':
      return {
        title: `Receba os cupons da ${storeName ?? 'loja'} no WhatsApp`,
        text: `Os cupons e ofertas da ${storeName ?? 'loja'} chegam no grupo assim que saem.`,
      };
  }
}

const WhatsAppCTA = ({ variant, storeName, groupSlug, learnMoreHref }: WhatsAppCTAProps) => {
  const { title, text } = getCopy(variant, storeName);
  return (
    <div className="px-4 py-6">
      <GroupJoinCTA
        title={title}
        text={text}
        groupSlug={groupSlug}
        learnMoreHref={learnMoreHref ?? '/grupo-whatsapp'}
        source={variant}
        context={storeName ?? null}
      />
    </div>
  );
};

export default WhatsAppCTA;
