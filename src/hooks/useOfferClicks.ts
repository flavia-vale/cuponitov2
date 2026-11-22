import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OfferClick {
  created_at: string;
  store: string | null;
  group_slug: string | null;
  origin: string | null;
  page_path: string | null;
  device: string;
  source: string | null;
}

/**
 * Cliques em "Ver oferta" dos últimos `days` dias (aba "Cliques em cupom"; leitura só para logado).
 * A tabela `offer_clicks` (20261122200000) ainda não está nos tipos gerados: consulta sem tipo.
 */
export function useOfferClicks(days: number) {
  return useQuery<OfferClick[]>({
    queryKey: ['offer-clicks', days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await (supabase as unknown as { from: (table: string) => any })
        .from('offer_clicks')
        .select('created_at,store,group_slug,origin,page_path,device,source')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10000);
      if (error) throw error;
      return (data ?? []) as OfferClick[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
