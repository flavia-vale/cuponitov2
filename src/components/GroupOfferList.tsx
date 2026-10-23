import { ExternalLink } from 'lucide-react';
import { offerWhen, storeLabel, type GroupOffer } from '@/lib/groupOfferFeed';

/** Ofertas reais do grupo: loja, horário, texto e o link da loja. Mesmo conteúdo do HTML do servidor. */
export default function GroupOfferList({ offers }: { offers: GroupOffer[] }) {
  return (
    <ul className="space-y-3">
      {offers.map(offer => {
        const time = offerWhen(offer.sentAt);
        return (
          <li key={offer.link} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
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
            <p className="mb-3 text-sm leading-relaxed text-foreground md:text-base">{offer.text}</p>
            <a
              href={offer.link}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ff5200] hover:underline"
            >
              Ver oferta <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
