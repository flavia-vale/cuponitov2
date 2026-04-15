import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  global_links: {
    whatsapp_group: string;
    instagram: string;
    contact_email: string;
  };
  hero_content: {
    hero_title: string;
    hero_subtitle: string;
    description: string;
    button_text: string;
  };
  seo_defaults: {
    home_title: string;
    home_description: string;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  global_links: {
    whatsapp_group: "https://chat.whatsapp.com/KxLjSgr9xBi87F4zQxaT4C",
    instagram: "",
    contact_email: "contato@cuponito.com.br"
  },
  hero_content: {
    hero_title: "Economize em cada compra",
    hero_subtitle: "+3.000 cupons verificados todos os dias",
    description: "Encontre o melhor cupom de desconto válido para as maiores lojas online do Brasil.",
    button_text: "Buscar"
  },
  seo_defaults: {
    home_title: "Cupom de Desconto {month_year} → Ofertas Atualizadas Hoje",
    home_description: "Os melhores cupons de desconto para Amazon, Shopee e Mercado Livre. Economize agora com ofertas verificadas e atualizadas diariamente."
  }
};

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error || !data || data.length === 0) return DEFAULT_SETTINGS;
        
        return data.reduce((acc, item) => ({
          ...acc,
          [item.key]: item.value
        }), {} as SiteSettings);
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    },
    staleTime: 10 * 60 * 1000,
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