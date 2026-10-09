import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useSettings } from '@/hooks/useSettings';
import { mergeGroupInfo, type WhatsappGroupInfo } from '@/lib/whatsappGroup';

export type WhatsappGroupPage = Tables<'whatsapp_group_pages'>;
export type WhatsappGroupPageInput = TablesInsert<'whatsapp_group_pages'>;

const PAGES_KEY = ['whatsapp-group-pages'];

/** Páginas publicadas (site) ou todas (painel admin). */
export function useWhatsappGroupPages(options: { includeDrafts?: boolean } = {}) {
  const includeDrafts = options.includeDrafts ?? false;
  return useQuery<WhatsappGroupPage[]>({
    queryKey: [...PAGES_KEY, includeDrafts ? 'all' : 'published'],
    queryFn: async () => {
      let request = supabase.from('whatsapp_group_pages').select('*');
      if (!includeDrafts) request = request.eq('is_published', true);
      const { data, error } = await request.order('sort_order').order('slug');
      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fatos do grupo (`site_settings.whatsapp_group_info`), sempre completos. */
export function useWhatsappGroupInfo(): WhatsappGroupInfo {
  const { data: settings } = useSettings();
  return mergeGroupInfo(settings?.whatsapp_group_info);
}

export function useSaveWhatsappGroupPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: WhatsappGroupPageInput }) => {
      const payload = { ...values, updated_at: new Date().toISOString() };
      const { error } = id
        ? await supabase.from('whatsapp_group_pages').update(payload).eq('id', id)
        : await supabase.from('whatsapp_group_pages').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAGES_KEY }),
  });
}

export function useDeleteWhatsappGroupPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('whatsapp_group_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PAGES_KEY }),
  });
}
