-- Capas dos 4 posts que estavam sem imagem (geradas no Canva a partir de
-- docs/prompts-imagens-blog-2026-10-09.md, servidas por public/blog/).
-- Só preenche quem ainda não tem capa: não sobrescreve escolha feita no painel.
UPDATE public.blog_posts AS p
SET cover_image = c.url
FROM (VALUES
  ('cupom-shopee-vs-amazon-2026',          'https://www.cuponito.com.br/blog/capa-cupom-shopee-vs-amazon.webp'),
  ('cupom-amazon-vs-mercado-livre-2026',   'https://www.cuponito.com.br/blog/capa-cupom-amazon-vs-mercado-livre.webp'),
  ('melhores-cupons-tech-vs-moda',         'https://www.cuponito.com.br/blog/capa-cupons-tech-vs-moda.webp'),
  ('mercado-livre-vs-shopee-frete-gratis', 'https://www.cuponito.com.br/blog/capa-frete-gratis-comparacao.webp')
) AS c(slug, url)
WHERE p.slug = c.slug
  AND (p.cover_image IS NULL OR p.cover_image = '');
