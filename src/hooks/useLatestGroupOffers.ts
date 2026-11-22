import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { LatestOfferRow } from '@/lib/groupOfferFeed';

/**
 * Última oferta de cada grupo (view `group_offers_latest`, migration 20261122210000), para o
 * diretório. A view não está nos tipos gerados: consulta sem tipo. Sem a view → lista vazia.
 */
export function useLatestGroupOffers() {
  return useQuery<LatestOfferRow[]>({
    queryKey: ['group-offers-latest'],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as { from: (table: string) => any })
        .from('group_offers_latest')
        .select('feed_slug,text,link,store,sent_at,image_url');
      if (error) return [];
      return (data ?? []) as LatestOfferRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
