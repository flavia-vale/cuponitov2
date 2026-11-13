-- Reforço da /grupo-whatsapp/pc-gamer (docs/plano-black-november-2026-10-30.md, seção 15).
--
-- Search Console (3 meses até 06/11): a página trouxe 18 dos 34 cliques do Google no site,
-- posição média 6, CTR 22%. Consultas abaixo do top 3:
--   "grupo de pc gamer whatsapp": posição 9,6
--   "grupo de ofertas pc gamer whatsapp": posição 9,5
--   "grupo de promoção de peças de pc whatsapp": posição 13 (1 clique)
-- O texto da página não tinha "grupo de PC gamer" nem "grupo de ofertas de PC gamer" na
-- resposta direta nem no FAQ. Aqui entram no resumo, no FAQ e no texto dos links que
-- chegam de /ofertas/tv e /ofertas/iphone. Só acrescenta; nada editado no painel se perde.

-- 1) Resumo (o trecho que o Google e as IAs citam) ------------------------------------------

UPDATE public.whatsapp_group_pages
SET intro = replace(
      intro,
      'O Promo Tech Nerd, do Cuponito, é um grupo de WhatsApp de promoções de tecnologia:',
      'O Promo Tech Nerd, do Cuponito, é um grupo de PC gamer no WhatsApp, de ofertas e promoções de tecnologia:'
    ),
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND intro NOT LIKE '%grupo de PC gamer no WhatsApp%';

-- 2) FAQ com as perguntas das buscas ---------------------------------------------------

UPDATE public.whatsapp_group_pages
SET faq = jsonb_build_array(
      jsonb_build_object('question', 'Tem grupo de PC gamer no WhatsApp?', 'answer', 'Sim. O Promo Tech Nerd, do Cuponito, é um grupo de PC gamer no WhatsApp grátis: promoções de placa de vídeo, processador, SSD, monitor, notebook gamer, PS5 e jogos, cerca de 200 por dia, com o link da loja oficial. Só os administradores postam.'),
      jsonb_build_object('question', 'Qual grupo de ofertas de PC gamer no WhatsApp entrar?', 'answer', 'Prefira um grupo em que só os administradores postam, que nunca peça Pix e que mande o link da loja oficial. O Promo Tech Nerd segue essas regras e também tem canal no Telegram, o t.me/promotechnerd, com as mesmas ofertas.')
    ) || faq,
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND NOT (faq::text LIKE '%Tem grupo de PC gamer no WhatsApp?%');

-- 3) Texto dos links que chegam de outras páginas ----------------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(content, '[grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer)', '[grupo de PC gamer no WhatsApp](/grupo-whatsapp/pc-gamer)'),
    updated_at = now()
WHERE slug = 'tv'
  AND content LIKE '%[grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer)%';

UPDATE public.whatsapp_group_pages
SET content = replace(content, '[grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer)', '[grupo de ofertas de PC gamer no WhatsApp](/grupo-whatsapp/pc-gamer)'),
    updated_at = now()
WHERE slug = 'iphone'
  AND content LIKE '%[grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer)%';
