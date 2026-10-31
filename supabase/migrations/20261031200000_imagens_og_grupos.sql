-- Imagens de compartilhamento (og:image) das páginas de grupo e de ofertas.
-- A primeira imagem do conteúdo vira o og:image (firstContentImage em src/lib/whatsappGroup.ts)
-- e aparece também no topo do texto. Arquivos em public/imagens/og/ (1200x630, sem marca nem preço).
-- Idempotente: só acrescenta se a imagem ainda não estiver no conteúdo.

UPDATE public.whatsapp_group_pages
SET content = '![TV em promoção: grupo grátis Promo TV no WhatsApp, Black Friday 27/11](https://www.cuponito.com.br/imagens/og/og-tv.png)' || E'\n\n' || content,
    updated_at = now()
WHERE slug = 'tv'
  AND content NOT LIKE '%/imagens/og/og-tv.png%';

UPDATE public.whatsapp_group_pages
SET content = '![Tênis em promoção: grupo grátis Promo Tênis no WhatsApp, corrida, feminino e masculino](https://www.cuponito.com.br/imagens/og/og-tenis.png)' || E'\n\n' || content,
    updated_at = now()
WHERE slug = 'tenis'
  AND content NOT LIKE '%/imagens/og/og-tenis.png%';

UPDATE public.whatsapp_group_pages
SET content = '![Whey e creatina em promoção: grupo grátis Promo Fit no WhatsApp](https://www.cuponito.com.br/imagens/og/og-whey.png)' || E'\n\n' || content,
    updated_at = now()
WHERE slug = 'whey'
  AND content NOT LIKE '%/imagens/og/og-whey.png%';

UPDATE public.whatsapp_group_pages
SET content = '![Promoção de celular: grupo grátis Promo Celular no WhatsApp](https://www.cuponito.com.br/imagens/og/og-celular.png)' || E'\n\n' || content,
    updated_at = now()
WHERE slug = 'celular'
  AND content NOT LIKE '%/imagens/og/og-celular.png%';

UPDATE public.whatsapp_group_pages
SET content = '![Promoção de PC e games: grupo grátis Promo Tech Nerd no WhatsApp, placa de vídeo, peças e PS5](https://www.cuponito.com.br/imagens/og/og-pc-gamer.png)' || E'\n\n' || content,
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND content NOT LIKE '%/imagens/og/og-pc-gamer.png%';
