import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type GroupJoinClick = Tables<'group_join_clicks'>;

/** Cliques no botão do grupo dos últimos `days` dias (aba Captação; leitura só para logado). */
export function useGroupJoinClicks(days: number) {
  return useQuery<GroupJoinClick[]>({
    queryKey: ['group-join-clicks', days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await supabase
        .from('group_join_clicks')
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
