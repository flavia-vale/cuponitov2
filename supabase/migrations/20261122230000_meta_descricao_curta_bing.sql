-- Bing Webmaster (22/11): "meta descriptions too short" em 19 páginas. Lojas, categorias e páginas
-- institucionais foram corrigidas no código (storeMetaDescription/categoryMetaDescription em
-- src/lib/seo.ts e src/pages/institutional/content.ts). Este post tem a descrição no banco.
-- Mesmos termos do post e do título de hoje; só fica com tamanho para o resultado de busca.

UPDATE public.blog_posts
SET meta_description = 'Cupom Shopee ou Amazon: qual compensa mais? A Shopee tem promoções mais frequentes e a Amazon, campanhas mais previsíveis. Compare cupom, frete e preço final.'
WHERE slug = 'cupom-shopee-vs-amazon-2026'
  AND char_length(coalesce(meta_description, '')) < 110;
