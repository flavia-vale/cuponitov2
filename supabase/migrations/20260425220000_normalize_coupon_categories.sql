-- Normaliza o campo coupons.category: substitui slugs/valores ingleses pelo name da tabela
-- Ex: 'animals' → 'Animals', 'education' → 'Educação'
UPDATE public.coupons
SET category = cc.name
FROM public.coupon_categories cc
WHERE public.coupons.category = cc.slug
  AND public.coupons.category IS DISTINCT FROM cc.name;
