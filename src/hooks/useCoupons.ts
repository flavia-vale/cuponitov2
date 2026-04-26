import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Coupon = Tables<'coupons'>;

export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select(
          'id, code, title, description, discount, link, store, store_id, category, expiry, is_flash, is_featured, status, success_rate, updated_at, created_at'
        )
        .eq('status', true)
        .order('is_flash', { ascending: false })
        .order('updated_at', { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data as Coupon[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
