import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PredefinedLink {
  id: string;
  name: string;
  url: string;
  store: string;
}

export function usePredefinedLinks() {
  return useQuery<PredefinedLink[]>({
    queryKey: ['predefined-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'predefined_links')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return []; // Not found
        throw error;
      }
      return (data.value as any) as PredefinedLink[] || [];
    },
  });
}

export function useUpdatePredefinedLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (links: PredefinedLink[]) => {
      // First, try to check if it exists
      const { data } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'predefined_links')
        .single();

      if (data) {
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value: links as any, 
            updated_at: new Date().toISOString() 
          })
          .eq('key', 'predefined_links');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{
            key: 'predefined_links',
            value: links as any,
            description: 'Links de afiliados pré-definidos por loja'
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predefined-links'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar links: ' + error.message);
    }
  });
}
