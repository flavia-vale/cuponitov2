-- Títulos e seções pelas palavras-chave do Planejador com números exatos
-- (docs/plano-crescimento-agressivo-2026-11-12.md, seção 7). Brasil, nov/2025 a out/2026.
--
--   home:   "promoções do dia" 2.400 · "ofertas do dia" 2.400 · "ofertas hoje" 2.400 (+86% no ano)
--   grupo:  "grupo de promoção whatsapp" 2.900 > "grupo de ofertas whatsapp" 1.300
--   tênis:  "tenis masculino promoção" 60.500 > "tenis feminino promoção" 40.500 = "tenis promoção" 40.500;
--           Nike 14.800; Adidas 12.100; Olympikus feminino 6.600; corrida 6.600
--   iPhone: "iphone mais barato" 6.600 > "celular iphone promoção" 880
--   Shopee: "achadinhos da shopee" 12.100 > "grupo de achadinhos da shopee" 480
--   TV:     "tv 50 polegadas promoção" 6.600 (8.100 em nov/25) + "smart tv 50 polegadas menor preço" 2.900
--
-- Só muda o que o painel também edita (Grupos do WhatsApp e SEO & Config). Rodar a qualquer
-- hora; repetir não duplica as seções.

-- Home: o título do painel passa a valer também no HTML do servidor (prerender lê seo_defaults).
INSERT INTO public.site_settings (key, value)
VALUES (
  'seo_defaults',
  jsonb_build_object(
    'home_title', 'Promoções do Dia e Cupons de Desconto | Cuponito',
    'home_description', 'Promoções do dia e achadinhos que saem hoje nos grupos de WhatsApp do Cuponito, e cupons de desconto de Amazon, Shopee, Mercado Livre e outras lojas.'
  )
)
ON CONFLICT (key) DO UPDATE
SET value = public.site_settings.value
  || jsonb_build_object(
    'home_title', 'Promoções do Dia e Cupons de Desconto | Cuponito',
    'home_description', 'Promoções do dia e achadinhos que saem hoje nos grupos de WhatsApp do Cuponito, e cupons de desconto de Amazon, Shopee, Mercado Livre e outras lojas.'
  );

UPDATE public.whatsapp_group_pages
SET title = 'Grupo de Promoção e Ofertas no WhatsApp | Cuponito'
WHERE slug = 'principal';

UPDATE public.whatsapp_group_pages
SET title = 'iPhone em Promoção e iPhone Mais Barato | Cuponito'
WHERE slug = 'iphone';

UPDATE public.whatsapp_group_pages
SET title = 'Achadinhos da Shopee: grupo no WhatsApp | Cuponito',
    h1 = 'Achadinhos da Shopee: grupo de ofertas e cupons no WhatsApp'
WHERE slug = 'shopee';

UPDATE public.whatsapp_group_pages
SET title = 'Tênis em Promoção: masculino e feminino | Cuponito',
    meta_description = 'Tênis em promoção masculino e feminino: Nike, Adidas, Olympikus, New Balance e corrida. Cerca de 50 ofertas por dia no Promo Tênis, com o link da loja oficial.'
WHERE slug = 'tenis';

UPDATE public.whatsapp_group_pages
SET content = replace(
  content,
  '## Tênis na Black Friday 2026',
  $md$## Tênis masculino e feminino em promoção

**Tênis masculino** é a busca de tênis em promoção mais feita no Google: cerca de **60 mil por mês**, contra 40 mil do **feminino** (Planejador de Palavras-chave do Google, novembro de 2025 a outubro de 2026). Em novembro, a busca pelo masculino chega a 90 mil.

As ofertas desta página e do grupo misturam os dois. O título de cada oferta diz se o modelo é masculino, feminino ou unissex; confira também a numeração, que muda entre as linhas.

## Tênis Nike, Adidas e Olympikus em promoção

As marcas mais procuradas em promoção são a **Nike** (cerca de 15 mil buscas por mês) e a **Adidas** (cerca de 12 mil). No feminino, a **Olympikus** vem logo depois. Para **corrida**, são cerca de 6,6 mil buscas por mês.

Antes de comprar um modelo de marca, compare o mesmo código em duas lojas (Netshoes, Centauro, Mizuno, Nike, Adidas) e confira se a loja é a oficial ou um parceiro autorizado.

## Tênis na Black Friday 2026$md$
)
WHERE slug = 'tenis'
  AND content LIKE '%## Tênis na Black Friday 2026%'
  AND content NOT LIKE '%## Tênis masculino e feminino em promoção%';

UPDATE public.whatsapp_group_pages
SET content = replace(
  content,
  '## TV em promoção: modelo exato antes do preço',
  $md$## TV 50 polegadas em promoção

**50 polegadas** é o tamanho de TV mais buscado em promoção no Google: cerca de **6,6 mil buscas por mês** só para "tv 50 polegadas promoção", e 8,1 mil em novembro (Planejador de Palavras-chave do Google). Somando "smart tv 50 polegadas menor preço" e as buscas por marca, passa de 15 mil.

Numa TV de 50", compare dentro do mesmo tipo de tela (LED com LED, QLED com QLED) e confira o ano do modelo: a de 50" do ano anterior costuma ser a mais barata nas promoções.

## TV em promoção: modelo exato antes do preço$md$
)
WHERE slug = 'tv'
  AND content LIKE '%## TV em promoção: modelo exato antes do preço%'
  AND content NOT LIKE '%## TV 50 polegadas em promoção%';
