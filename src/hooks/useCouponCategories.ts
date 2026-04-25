import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CouponCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color_hex: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useCouponCategories() {
  return useQuery<CouponCategory[]>({
    queryKey: ['coupon-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupon_categories')
        .select('*')
        .order('sort_order')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000,
  });
}
