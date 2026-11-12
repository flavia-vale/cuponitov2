import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type CouponClick = Tables<'coupon_clicks'>;

/** Cliques em cupom dos últimos `days` dias (aba "Cliques em cupom"; leitura só para logado). */
export function useCouponClicks(days: number) {
  return useQuery<CouponClick[]>({
    queryKey: ['coupon-clicks', days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await supabase
        .from('coupon_clicks')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10000);
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
