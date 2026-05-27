import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { COUPON_COLUMNS, type Coupon } from '@/hooks/useCoupons';

export function useStoreCoupons(storeId?: string, storeName?: string) {
  return useQuery<Coupon[]>({
    queryKey: ['store-coupons', storeId, storeName],
    enabled: Boolean(storeId || storeName),
    queryFn: async () => {
      if (!storeId && !storeName) return [];

      const filters: string[] = [];
      if (storeId) filters.push(`store_id.eq.${storeId}`);
      if (storeName) filters.push(`store.eq.${storeName}`);

      const query = supabase
        .from('coupons')
        .select(COUPON_COLUMNS)
        .or(filters.join(','))
        .order('status', { ascending: false })
        .order('is_flash', { ascending: false })
        .order('updated_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data as Coupon[]) || [];
      const seen = new Set<string>();
      const deduped: Coupon[] = [];
      for (const c of rows) {
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        deduped.push(c);
      }
      return deduped;
    },
    staleTime: 5 * 60 * 1000,
  });
}
