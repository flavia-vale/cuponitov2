-- Capas do lote 1 do Gemini (docs/prompts-gemini-11-imagens.md, itens 1 a 4),
-- servidas por public/imagens/blog/ (fora de /blog/:slug, que o middleware trata como post).
-- Troca a capa vazia OU a capa antiga conhecida de cada post; se alguém já trocou
-- a capa pelo painel depois disso, a escolha do painel fica.
UPDATE public.blog_posts AS p
SET cover_image = c.url
FROM (VALUES
  ('cashback-vs-cupom-qual-compensa',
   'https://www.cuponito.com.br/imagens/blog/capa-cashback-vs-cupom.webp',
   ''),
  ('cupom-shopee-hoje',
   'https://www.cuponito.com.br/imagens/blog/capa-cupom-shopee-hoje.webp',
   'https://jyvmrkykukialdbcebei.supabase.co/storage/v1/object/public/blog-images/covers/1778121776384-z8xmwfkbja8.png'),
  ('mercado-livre-guia-para-economizar',
   'https://www.cuponito.com.br/imagens/blog/capa-guia-mercado-livre.webp',
   'https://jyvmrkykukialdbcebei.supabase.co/storage/v1/object/public/blog-images/covers/1778120884667-6mm3f2gt6vy.png'),
  ('presentes-dia-das-maes-comprar-com-desconto',
   'https://www.cuponito.com.br/imagens/blog/capa-dia-das-maes-desconto.webp',
   'https://jyvmrkykukialdbcebei.supabase.co/storage/v1/object/public/blog-images/covers/1778123052996-ont6nvragfr.png')
) AS c(slug, url, capa_antiga)
WHERE p.slug = c.slug
  AND (p.cover_image IS NULL OR p.cover_image = '' OR p.cover_image = c.capa_antiga);
