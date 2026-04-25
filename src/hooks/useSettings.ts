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
    trust_badge_1: string;
    trust_badge_2: string;
    trust_badge_3: string;
  };
  seo_defaults: {
    home_title: string;
    home_description: string;
  };
  how_it_works: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
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
    button_text: "Receber cupons em tempo real",
    trust_badge_1: "Verificados hoje",
    trust_badge_2: "100% gratuito",
    trust_badge_3: "Economia real"
  },
  seo_defaults: {
    home_title: "Cupom de Desconto {month_year} → Ofertas Atualizadas Hoje | cuponito",
    home_description: "Os melhores cupons de desconto para Amazon, Shopee e Mercado Livre no cuponito. Economize agora com ofertas verificadas e atualizadas diariamente."
  },
  how_it_works: {
    title: "Como usar um cupom?",
    step1: "Encontre sua loja favorita",
    step2: "Copie o código com 1 clique",
    step3: "Cole no carrinho e economize!"
  }
};

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      
      if (error) throw error;

      // Transforma o array de chaves em um objeto estruturado
      const settings = { ...DEFAULT_SETTINGS };
      data?.forEach((item) => {
        if (item.key in settings) {
          (settings as any)[item.key] = item.value;
        }
      });

      return settings as SiteSettings;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: value as any, updated_at: new Date().toISOString() })
          .eq('key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key, value: value as any }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}