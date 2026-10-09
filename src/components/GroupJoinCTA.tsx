import { Radio } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useWhatsappGroupInfo } from '@/hooks/useWhatsappGroupPages';
import { trackEvent } from '@/lib/analytics';
import { resolveJoinUrl } from '@/lib/whatsappGroup';

const WhatsAppIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export interface GroupJoinCTAProps {
  title?: string;
  text?: string;
  /** Link de entrada próprio da página; padrão: link global (Link Inteligente). */
  href?: string | null;
  /** Página do grupo no site ("como funciona"), link interno. */
  learnMoreHref?: string;
  /** Origem do clique no analytics. */
  source: string;
  context?: string | null;
  className?: string;
}

/**
 * Chamada única para entrar no grupo de ofertas: centralizada, botão grande
 * e o canal como alternativa. Todas as chamadas do site usam esta, para o
 * botão não divergir de página para página.
 */
export default function GroupJoinCTA({
  title = 'Receba as ofertas no WhatsApp',
  text,
  href,
  learnMoreHref,
  source,
  context = null,
  className = '',
}: GroupJoinCTAProps) {
  const { data: settings } = useSettings();
  const info = useWhatsappGroupInfo();
  const joinUrl = resolveJoinUrl({ join_url: href ?? null }, settings?.global_links.whatsapp_group);
  const facts = [
    'Grátis',
    `${info.offers_per_day} ofertas por dia`,
    ...(info.admins_only ? ['só os admins postam'] : []),
  ];

  return (
    <section
      className={`mx-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] px-5 py-8 text-center text-white shadow-xl shadow-green-600/20 sm:px-10 sm:py-10 ${className}`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
        <WhatsAppIcon className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-white/90 sm:text-base">
        {text ?? `${info.group_name}: ofertas de ${info.stores}.`}
      </p>

      <a
        href={joinUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', { source, context })}
        className="group relative mx-auto mt-6 inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black uppercase tracking-wide text-[#128C7E] shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.5s] motion-reduce:hidden" aria-hidden="true" />
        <WhatsAppIcon className="relative h-6 w-6" />
        <span className="relative">Entrar no grupo grátis</span>
      </a>

      <p className="mt-4 text-xs font-semibold text-white/85 sm:text-sm">{facts.join(' · ')}</p>

      <div className="mt-3 flex flex-col items-center justify-center gap-2 text-sm font-bold sm:flex-row sm:gap-5">
        {info.channel_url && (
          <a
            href={info.channel_url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { source: `${source}_channel`, context })}
            className="inline-flex items-center gap-1.5 text-white underline-offset-4 hover:underline"
          >
            <Radio className="h-4 w-4" /> Prefere o canal? Seguir o canal
          </a>
        )}
        {learnMoreHref && (
          <a href={learnMoreHref} className="text-white/90 underline-offset-4 hover:underline">
            Como funciona o grupo
          </a>
        )}
      </div>
    </section>
  );
}
