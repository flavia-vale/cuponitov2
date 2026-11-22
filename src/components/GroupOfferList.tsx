import { useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { formatOfferText, offerWhen, storeLabel, type GroupOffer } from '@/lib/groupOfferFeed';
import { buildOfferClickHref } from '@/lib/offerClickTracking';

/** Foto da loja; sem foto (ou se a loja não deixar carregar), um ícone no mesmo espaço. */
function OfferImage({ src, alt }: { src?: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white sm:h-28 sm:w-28">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          width={112}
          height={112}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <ShoppingBag className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
      )}
    </div>
  );
}

/**
 * Ofertas reais do grupo: foto, nome do produto, preço "de → por", loja, horário e o link
 * da loja. Mesmo conteúdo do HTML do servidor (`offerListItems` em prerender/render.ts).
 */
export default function GroupOfferList({
  offers,
  groupSlug = null,
  origin,
}: {
  offers: GroupOffer[];
  /** Página do grupo cujo feed tem as ofertas (o /ir confere o link nele); sem ela, o grupo geral. */
  groupSlug?: string | null;
  /** Onde fica a lista, para a aba "Cliques em cupom": `group_page_offer`, `offers_page_offer`… */
  origin: string;
}) {
  const pathname = useRouterState({ select: state => state.location.pathname });
  return (
    <ul className="space-y-3">
      {offers.map(offer => {
        const time = offerWhen(offer.sentAt);
        const shown = formatOfferText(offer.text);
        return (
          <li key={offer.link} className="flex gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
            <OfferImage src={offer.image} alt={shown.title} />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-black uppercase tracking-wide text-[#ff5200]">
                {storeLabel(offer.store)}
                {time && (
                  <>
                    {' · '}
                    <time dateTime={offer.sentAt ?? undefined} className="font-semibold normal-case text-muted-foreground">
                      {time}
                    </time>
                  </>
                )}
              </p>
              <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground md:text-base">{shown.title}</p>
              {shown.price && (
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
                  {shown.oldPrice && <s className="text-muted-foreground">{shown.oldPrice}</s>}
                  <span className="text-lg font-black text-[oklch(0.5_0.15_150)]">{shown.price}</span>
                  {shown.priceNote && <span className="text-xs text-muted-foreground">{shown.priceNote}</span>}
                </p>
              )}
              {shown.details && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{shown.details}</p>}
              <a
                href={buildOfferClickHref({ link: offer.link, groupSlug, origin, pagePath: pathname }) ?? offer.link}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#ff5200] hover:underline"
              >
                Ver oferta <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
