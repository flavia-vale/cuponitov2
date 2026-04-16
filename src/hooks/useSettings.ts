import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    button_text: "Receber cupons em tempo real"
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
    queryFn: async () => DEFAULT_SETTINGS,
    staleTime: Infinity,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      // TODO: implement when site_settings table is created
      console.warn('site_settings table not yet created, update skipped', key, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}