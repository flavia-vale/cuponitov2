import { useQuery } from '@tanstack/react-query';
import { groupOffersFeedPath, parseGroupOffers, type GroupOffer } from '@/lib/groupOfferFeed';

/**
 * Ofertas reais que saíram no grupo (lidas pelo /achadinhos-hoje.json, mesma origem).
 * Com `groupSlug`, as do grupo daquela página (nicho). Falha = lista vazia.
 */
export function useGroupOffers(groupSlug?: string | null) {
  return useQuery<GroupOffer[]>({
    queryKey: ['group-offers', groupSlug ?? null],
    queryFn: async () => {
      try {
        const response = await fetch(groupOffersFeedPath(groupSlug), { headers: { Accept: 'application/json' } });
        if (!response.ok) return [];
        return parseGroupOffers(await response.json());
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
