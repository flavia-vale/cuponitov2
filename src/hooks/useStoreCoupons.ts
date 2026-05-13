import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { COUPON_COLUMNS, type Coupon } from '@/hooks/useCoupons';

export function useStoreCoupons(storeId?: string) {
  return useQuery<Coupon[]>({
    queryKey: ['store-coupons', storeId],
    enabled: Boolean(storeId),
    queryFn: async () => {
      if (!storeId) return [];

      const { data, error } = await supabase
        .from('coupons')
        .select(COUPON_COLUMNS)
        .eq('store_id', storeId)
        .order('status', { ascending: false })
        .order('is_flash', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as Coupon[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
