-- Normalização abrangente de coupons.category
-- Pode ser aplicada mesmo se migrações anteriores já rodaram (idempotente).

-- 1. Remove espaços extras (ex: "home-and-decoration " com trailing space)
UPDATE public.coupons
SET category = TRIM(category)
WHERE category IS DISTINCT FROM TRIM(category);

-- 2. Renomeia "Animals" → "Animais" na tabela de categorias e nos cupons
UPDATE public.coupon_categories
SET name = 'Animais', slug = 'animais'
WHERE name = 'Animals';

UPDATE public.coupons
SET category = 'Animais'
WHERE category = 'Animals';

-- 3. Slug exato → name (segunda passagem de segurança para slugs simples)
UPDATE public.coupons c
SET category = cc.name
FROM public.coupon_categories cc
WHERE c.category = cc.slug
  AND c.category IS DISTINCT FROM cc.name;

-- 4. Compostos: processa do mais específico ao mais genérico.
--    Cada UPDATE só afeta linhas que ainda não têm um name válido.
--    Após cada UPDATE a linha fica protegida pelas seguintes.

-- Moda
UPDATE public.coupons
SET category = 'Moda'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%fashion%' OR category LIKE '%clothing%' OR category LIKE '%apparel%');

-- Tech
UPDATE public.coupons
SET category = 'Tech'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%electronics%' OR category LIKE '%technology%');

-- Livros & Literatura
UPDATE public.coupons
SET category = 'Livros & Literatura'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%books%' OR category LIKE '%literature%');

-- Jogos
UPDATE public.coupons
SET category = 'Jogos'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%games%';

-- Entretenimento
UPDATE public.coupons
SET category = 'Entretenimento'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%entertainment%' OR category LIKE '%streaming%' OR category LIKE '%art-and-culture%');

-- Beleza
UPDATE public.coupons
SET category = 'Beleza'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%beauty%' OR category LIKE '%cosmetic%');

-- Saúde
UPDATE public.coupons
SET category = 'Saúde'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%health%';

-- Auto & Acessórios
UPDATE public.coupons
SET category = 'Auto & Acessórios'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%auto%' OR category LIKE '%automotive%');

-- Viagens
UPDATE public.coupons
SET category = 'Viagens'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%travel%' OR category LIKE '%hotel%' OR category LIKE '%flight%' OR category LIKE '%tourism%');

-- Esportes (antes de wellness para que "wellness sports" vá para Esportes)
UPDATE public.coupons
SET category = 'Esportes'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%sports%';

-- Bem-estar
UPDATE public.coupons
SET category = 'Bem-estar'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%wellness%' OR category LIKE '%fitness%' OR category LIKE '%yoga%');

-- Casa & Decoração
UPDATE public.coupons
SET category = 'Casa & Decoração'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%home%' OR category LIKE '%decoration%' OR category LIKE '%furniture%');

-- Delivery / Comida
UPDATE public.coupons
SET category = 'Delivery'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%delivery%' OR category LIKE '%food%' OR category LIKE '%restaurant%');

-- Produtos para Bebês
UPDATE public.coupons
SET category = 'Produtos para Bebês'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND (category LIKE '%infant%' OR category LIKE '%baby%');

-- Indústria & Comércio
UPDATE public.coupons
SET category = 'Indústria & Comércio'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%industry%';

-- Promoções
UPDATE public.coupons
SET category = 'Promoções'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%promotions%';

-- Shopping (genérico)
UPDATE public.coupons
SET category = 'Shopping'
WHERE category NOT IN (SELECT name FROM public.coupon_categories)
  AND category LIKE '%shopping%';

-- 5. Tudo que sobrou e não bate com nenhuma categoria → Geral
UPDATE public.coupons
SET category = 'Geral'
WHERE category IS NOT NULL
  AND category != ''
  AND category NOT IN (SELECT name FROM public.coupon_categories);
