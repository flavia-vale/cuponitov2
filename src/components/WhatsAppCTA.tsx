import { MessageCircle, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';

type Variant = 'urgency' | 'social-proof' | 'store';

interface WhatsAppCTAProps {
  variant: Variant;
  storeName?: string;
}

const config: Record<Variant, { icon: typeof MessageCircle; buttonText: string }> = {
  urgency: { icon: MessageCircle, buttonText: 'Entrar no Grupo' },
  'social-proof': { icon: Users, buttonText: 'Quero economizar também' },
  store: { icon: Bell, buttonText: 'Avisar no WhatsApp' },
};

function getText(variant: Variant, storeName?: string) {
  switch (variant) {
    case 'urgency':
      return 'Os melhores cupons duram poucos minutos. Receba o alerta no celular antes que esgotem!';
    case 'social-proof':
      return 'Junte-se a mais de 20 mil pessoas que economizam todos os dias com nossos alertas direto no WhatsApp.';
    case 'store':
      return `O próximo cupom de ${storeName} sai a qualquer momento. Esteja no grupo para garantir o seu.`;
  }
}

const WhatsAppCTA = ({ variant, storeName }: WhatsAppCTAProps) => {
  const { data: settings } = useSettings();
  const { icon: Icon, buttonText } = config[variant];
  const text = getText(variant, storeName);
  
  const whatsappLink = settings?.global_links.whatsapp_group || '#';

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 border-none">
      <div className="relative overflow-hidden rounded-2xl border-[oklch(0.85_0.1_150)] bg-gradient-to-r from-[oklch(0.96_0.03_150)] to-[oklch(0.94_0.03_150)] p-6 md:p-8 border">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.17_150/0.08)]" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[oklch(0.55_0.17_150/0.06)]" />

        <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[oklch(0.55_0.17_150)] shadow-lg">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          <p className="flex-1 text-sm font-medium text-[oklch(0.35_0.05_150)] md:text-base">
            {text}
          </p>

          <a href={whatsappLink} target="_blank" rel="nofollow noopener noreferrer">
            <Button className="gap-2 rounded-full bg-[oklch(0.55_0.17_150)] px-4 py-2 text-sm md:px-6 md:text-base font-semibold text-white shadow-md hover:bg-[oklch(0.48_0.17_150)] hover:shadow-lg transition-all">
              <Icon className="h-5 w-5" />
              {buttonText}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;