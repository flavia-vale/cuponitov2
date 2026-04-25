-- Tabela de categorias de cupons (gerenciável via painel admin)
CREATE TABLE public.coupon_categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color_hex   TEXT        NOT NULL DEFAULT '#FF4D00',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed: categorias já existentes no sistema
INSERT INTO public.coupon_categories (name, slug, description, icon, color_hex, sort_order) VALUES
  ('Geral',         'geral',         'Cupons de desconto gerais das melhores lojas.',                           '🏷️',  '#6B7280', 0),
  ('Ofertas no link','ofertas-no-link','Ofertas ativadas diretamente pelo link, sem código necessário.',          '🔗',  '#3B82F6', 1),
  ('Frete Grátis',  'frete-gratis',  'Cupons de frete grátis verificados para compras online.',                 '🚚',  '#10B981', 2),
  ('Moda',          'moda',          'Cupons de desconto para moda, roupas, calçados e acessórios.',            '👗',  '#EC4899', 3),
  ('Tech',          'tech',          'Cupons para tecnologia, eletrônicos, smartphones e gadgets.',             '📱',  '#8B5CF6', 4),
  ('Delivery',      'delivery',      'Cupons e promoções para delivery de comida e apps de entrega.',           '🍕',  '#F59E0B', 5),
  ('Viagens',       'viagens',       'Cupons para passagens aéreas, hotéis e pacotes de turismo.',              '✈️',  '#06B6D4', 6),
  ('Beleza',        'beleza',        'Cupons para beleza, cosméticos, maquiagem e skincare.',                   '✨',  '#F43F5E', 7);

-- RLS: leitura pública, escrita somente autenticado
ALTER TABLE public.coupon_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupon_categories_read_public"
  ON public.coupon_categories FOR SELECT
  USING (true);

CREATE POLICY "coupon_categories_write_admin"
  ON public.coupon_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Índice para ordenação e lookup por slug
CREATE INDEX idx_coupon_categories_sort  ON public.coupon_categories(sort_order);
CREATE INDEX idx_coupon_categories_slug  ON public.coupon_categories(slug);
