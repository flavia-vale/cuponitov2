import { useQuery } from '@tanstack/react-query';
import { ACHADINHOS_FEED_PATH, parseGroupOffers, type GroupOffer } from '@/lib/groupOfferFeed';

/** Ofertas reais que saíram no grupo (lidas pelo /achadinhos-hoje.json, mesma origem). Falha = lista vazia. */
export function useGroupOffers() {
  return useQuery<GroupOffer[]>({
    queryKey: ['group-offers'],
    queryFn: async () => {
      try {
        const response = await fetch(ACHADINHOS_FEED_PATH, { headers: { Accept: 'application/json' } });
        if (!response.ok) return [];
        return parseGroupOffers(await response.json());
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
