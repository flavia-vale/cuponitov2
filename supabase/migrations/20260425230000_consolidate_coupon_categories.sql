-- Adiciona categorias que faltavam no mapeamento
INSERT INTO public.coupon_categories (name, slug, description, icon, color_hex, sort_order)
VALUES
  ('Casa & Decoração', 'casa-e-decoracao', 'Cupons para móveis, decoração e produtos para o lar', '🏠', '#F97316', 24),
  ('Arte & Cultura',   'arte-e-cultura',   'Cupons para museus, teatros, shows e cultura em geral',  '🎨', '#A855F7', 25)
ON CONFLICT (name) DO NOTHING;

-- Consolida categorias compostas → categoria mais próxima
-- beauty + qualquer coisa → Beleza
UPDATE public.coupons SET category = 'Beleza'
WHERE category IN ('beauty', 'beauty shopping', 'beauty wellness', 'shopping beauty', 'wellness shopping beauty');

-- health/wellness compostos → categoria mais relevante
UPDATE public.coupons SET category = 'Saúde'
WHERE category IN ('shopping health');

UPDATE public.coupons SET category = 'Bem-estar'
WHERE category IN ('wellness', 'shopping wellness', 'wellness shopping');

-- home-and-decoration e compostos → Casa & Decoração
UPDATE public.coupons SET category = 'Casa & Decoração'
WHERE category IN (
  'home-and-decoration',
  'home-and-decoration shopping',
  'shopping home-and-decoration',
  'home-and-decoration promotions industry-and-commerce'
);

-- Mistura longa com arte/cultura/jogos → Entretenimento
UPDATE public.coupons SET category = 'Entretenimento'
WHERE category = 'art-and-culture home-and-decoration entertainment games books-and-literature infant-products promotions';

-- art-and-culture simples → Arte & Cultura
UPDATE public.coupons SET category = 'Arte & Cultura'
WHERE category = 'art-and-culture';

-- Normaliza slugs ingleses restantes via slug da tabela (segurança extra)
UPDATE public.coupons
SET category = cc.name
FROM public.coupon_categories cc
WHERE public.coupons.category = cc.slug
  AND public.coupons.category IS DISTINCT FROM cc.name;
