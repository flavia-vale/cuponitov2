import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  global_links: {
    whatsapp_group: string;
    instagram: string;
    contact_email: string;
  };
  hero_content: {
    title: string;
    subtitle: string;
    description: string;
    button_text: string;
  };
  seo_defaults: {
    home_title: string;
    home_description: string;
  };
}

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      
      // Transform array of {key, value} into a single object
      return data.reduce((acc, item) => ({
        ...acc,
        [item.key]: item.value
      }), {} as SiteSettings);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}