-- Tabela para armazenar configurações dinâmicas (Zero-Code)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Permissões: Leitura pública, Escrita apenas para autenticados (admin)
CREATE POLICY "Allow public read access" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin all access" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Inserir configurações iniciais padrão
INSERT INTO public.site_settings (key, value, description) VALUES
('global_links', '{
    "whatsapp_group": "https://chat.whatsapp.com/KxLjSgr9xBi87F4zQxaT4C",
    "instagram": "",
    "contact_email": "contato@cuponito.com.br"
}'::jsonb, 'Links externos globais'),
('hero_content', '{
    "title": "Cupons de Desconto {month_year} 🎯",
    "subtitle": "Amazon, Shopee e Mercado Livre",
    "description": "Encontre o melhor cupom de desconto e código promocional válido para as maiores lojas online do Brasil.",
    "button_text": "Receba os cupons em tempo real pelo WhatsApp"
}'::jsonb, 'Conteúdo dinâmico da seção principal'),
('seo_defaults', '{
    "home_title": "Cupom de Desconto {month_year} → Ofertas Atualizadas Hoje",
    "home_description": "Os melhores cupons de desconto para Amazon, Shopee e Mercado Livre. Economize agora com ofertas verificadas e atualizadas diariamente."
}'::jsonb, 'Metadados de SEO padrão');