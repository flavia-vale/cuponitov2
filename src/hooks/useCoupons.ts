import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Coupon = Tables<'coupons'> & { stores?: Tables<'stores'> | null };

export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*, stores(id, name, logo_url, color)')
        .eq('status', true)
        .order('is_flash', { ascending: false })
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
