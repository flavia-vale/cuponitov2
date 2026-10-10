-- Lote 2 das imagens do Gemini (docs/prompts-gemini-11-imagens.md, itens 7 a 11),
-- servidas por public/imagens/blog/.
-- Cada bloco só age se a imagem ainda não está no texto: rodar duas vezes não duplica.

-- 1) Imagens internas dos posts: logo abaixo do subtítulo do assunto.
UPDATE public.blog_posts AS p
SET content = replace(p.content, c.subtitulo || E'\n', c.subtitulo || E'\n\n![' || c.alt || '](' || c.url || E')\n')
FROM (VALUES
  ('cashback-vs-cupom-qual-compensa',
   '## Posso usar cupom e cashback juntos?',
   'Peça de quebra-cabeça em forma de cupom se encaixando em um cartão de crédito, com moedas ao redor',
   'https://www.cuponito.com.br/imagens/blog/interna-cupom-e-cashback-juntos.webp'),
  ('cupom-shopee-hoje',
   '## Como garantir frete grátis na Shopee hoje',
   'Caixa de entrega aberta com um cupom de frete grátis saindo de dentro, ao lado de moedas',
   'https://www.cuponito.com.br/imagens/blog/interna-shopee-frete-gratis.webp'),
  ('mercado-livre-vs-shopee-frete-gratis',
   '## Frete grátis é sempre real?',
   'Lupa examinando uma etiqueta de preço com um asterisco, com uma caixa de entrega ao fundo',
   'https://www.cuponito.com.br/imagens/blog/interna-frete-pegadinha.webp')
) AS c(slug, subtitulo, alt, url)
WHERE p.slug = c.slug
  AND position(c.subtitulo || E'\n' IN p.content) > 0
  AND position(c.url IN p.content) = 0;

-- 2) Páginas do grupo: ilustração no topo do conteúdo (também vira o og:image).
UPDATE public.whatsapp_group_pages AS g
SET content = E'![' || c.alt || '](' || c.url || E')\n\n' || ltrim(g.content, E'\n')
FROM (VALUES
  ('principal',
   'Mão segurando um celular com mensagens de ofertas de fone, tênis, panela e perfume, com o sino silenciado',
   'https://www.cuponito.com.br/imagens/blog/grupo-ofertas-whatsapp.webp'),
  ('shopee',
   'Achadinhos baratos de casa e beleza com etiquetas de preço, ao lado de um celular com uma mensagem',
   'https://www.cuponito.com.br/imagens/blog/grupo-achadinhos-shopee.webp')
) AS c(slug, alt, url)
WHERE g.slug = c.slug
  AND position(c.url IN g.content) = 0;
