-- Conteúdo dos grupos de nicho, escrito com dados (docs/plano-ofertas-e-nichos-2026-10-22.md).
-- Rode DEPOIS da 20261023120000_paginas_de_ofertas.sql.
--
-- Mapa aprovado pela Flávia em 23/10:
--   Promo Celular   → /grupo-whatsapp/celular   (renomeia "tecnologia"; o ChatGPT já cita a página)
--   Promo Tech Nerd → /grupo-whatsapp/pc-gamer
--   Promo iPhone    → /ofertas/iphone           (página de ofertas)
--   Promo Bebês     → /ofertas/fraldas          (renomeia "bebes"; página de ofertas)
--   Promo Salão     → /grupo-whatsapp/manicure  (renomeia "salao-de-beleza")
--   Promo Festas    → post /blog/decoracao-de-ano-novo-simples-e-barata; a linha "festas"
--                     fica despublicada, só guardando o link do grupo para o botão do post.
-- Os endereços antigos mandam 301 para os novos (middleware.ts, RENAMED_GROUP_PAGES).
--
-- Dados que guiaram os textos (Planejador, faixas mensais):
--   "grupo de promoção de celular", "grupo whatsapp promoção celular": 100–1 mil, subindo
--   "grupo de promoção de peças de pc", "grupo de ofertas pc gamer": 100–1 mil
--   "tv em promoção" 10–100 mil (+900% no ano); ps5, placa de vídeo, notebook gamer, jogos: 1–10 mil
--   "iphone em promoção", "iphone barato": 10–100 mil; "grupo de promoção de iphone": 10–100
--   "promoção de fralda", "fraldas em promoção": 10–100 mil; "fralda barata": 1–10 mil
--   "grupo de manicure whatsapp" (+8 variações): 10–100 cada, concorrência baixa
--   "decoração de ano novo simples e barata": 1–10 mil, +900% em 3 meses
-- Respostas de IA (ChatGPT, Visão geral de IA do Google, 23/10): destacam grátis, só admins
-- postam, quantas ofertas por dia, conferir preço; fralda = "preço por fralda"; manicure =
-- intenção de comunidade, com "promoções de materiais" como um dos tipos; ano novo = ideias
-- com custo e lista até R$ 50.
--
-- Fatos dos grupos confirmados pela Flávia em 23/10: só admins postam em todos; Promo Celular
-- ~5 ofertas/dia; Promo Tech Nerd ~200/dia; Promo iPhone ~2/semana, só iPhone novo.
--
-- Os textos destas páginas são reescritos aqui (ON CONFLICT DO UPDATE): os de 22/10 foram
-- escritos sem dados.

-- 1) Colunas -----------------------------------------------------------------------------

ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS group_name   TEXT,
  ADD COLUMN IF NOT EXISTS topics       TEXT,
  ADD COLUMN IF NOT EXISTS page_type    TEXT NOT NULL DEFAULT 'group',
  ADD COLUMN IF NOT EXISTS offer_terms  TEXT,
  ADD COLUMN IF NOT EXISTS offer_volume TEXT;

COMMENT ON COLUMN public.whatsapp_group_pages.offer_volume IS
  'Grupo de nicho: quantas ofertas chegam, em frase pronta ("cerca de 5 ofertas por dia").';

ALTER TABLE public.coupon_categories
  ADD COLUMN IF NOT EXISTS group_slug TEXT;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS group_slug TEXT;

COMMENT ON COLUMN public.blog_posts.group_slug IS
  'Página do grupo (whatsapp_group_pages.slug) do botão "Entrar no grupo" do post. Vazio = grupo geral.';

-- 2) Renomeia as páginas de 22/10 (mantém o id e a data de criação) ------------------------

UPDATE public.whatsapp_group_pages SET slug = 'celular'
WHERE slug = 'tecnologia'
  AND NOT EXISTS (SELECT 1 FROM public.whatsapp_group_pages WHERE slug = 'celular');

UPDATE public.whatsapp_group_pages SET slug = 'fraldas'
WHERE slug = 'bebes'
  AND NOT EXISTS (SELECT 1 FROM public.whatsapp_group_pages WHERE slug = 'fraldas');

UPDATE public.whatsapp_group_pages SET slug = 'manicure'
WHERE slug = 'salao-de-beleza'
  AND NOT EXISTS (SELECT 1 FROM public.whatsapp_group_pages WHERE slug = 'manicure');

-- 3) Páginas com o texto novo ------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES
(
  'celular',
  NULL,
  'Grupo de Promoção de Celular no WhatsApp | Cuponito',
  'Grupo de promoção de celular no WhatsApp',
  'Grupo de promoção de celular no WhatsApp, grátis: cerca de 5 ofertas por dia, só os admins postam, com o link da loja oficial. iPhone tem grupo próprio.',
  'O Promo Celular, do Cuponito, é um grupo de WhatsApp só com promoções de celular: cerca de 5 ofertas por dia, com o link da loja oficial. É grátis, só os administradores postam e o iPhone tem um grupo separado, o Promo iPhone.',
  $md$
## O que chega no grupo

- **Celulares em promoção**, com o preço do momento e o link da loja oficial.
- **Ofertas relâmpago** de celular, que costumam durar pouco.
- **Cerca de 5 ofertas por dia**: só as que valem a pena, para o grupo não lotar o seu WhatsApp.

Procurando iPhone? Ele tem grupo próprio, o **Promo iPhone**, que avisa só quando um iPhone novo cai de preço. Veja as [ofertas de iPhone em promoção](/ofertas/iphone).

## O Promo Tech virou três grupos

Celular, computador e games ficavam todos no Promo Tech. Para cada pessoa receber só o que procura, agora são três grupos:

- **Promo Celular**: promoções de celular (esta página).
- **Promo iPhone**: só iPhone novo, cerca de 2 ofertas por semana. [Ofertas de iPhone](/ofertas/iphone).
- **Promo Tech Nerd**: PC gamer, peças, notebook, monitor, videogame, jogos e TV, cerca de 200 ofertas por dia. [Grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer).

## Como saber se a promoção de celular é boa

1. **Compare o preço em outras lojas** antes de comprar. Desconto anunciado nem sempre é o menor preço.
2. **Confira o preço final com frete** no carrinho: oferta relâmpago muda rápido.
3. **Veja quem vende**: prefira loja oficial ou "vendido e entregue por" a própria loja.
4. **Confirme o modelo exato**: memória, armazenamento e versão mudam o preço.

## Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. Entrar no grupo antes ajuda a conhecer o preço normal dos celulares e perceber quando o desconto é de verdade.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link. O grupo nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**. Veja [como saber se um grupo de ofertas é confiável](/blog/grupo-de-ofertas-whatsapp-e-confiavel).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de celular no WhatsApp?', 'answer', 'Sim. O Promo Celular, do Cuponito, é um grupo de WhatsApp grátis só com promoções de celular, cerca de 5 por dia, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quantas promoções de celular chegam por dia?', 'answer', 'Cerca de 5 por dia. O grupo manda só as ofertas que valem a pena, para não lotar o seu WhatsApp.'),
    jsonb_build_object('question', 'Tem grupo só de iPhone?', 'answer', 'Sim. O Promo iPhone manda só ofertas de iPhone novo, cerca de 2 por semana, quando o preço cai.'),
    jsonb_build_object('question', 'O que aconteceu com o Promo Tech?', 'answer', 'Virou três grupos: Promo Celular (celulares), Promo iPhone (só iPhone novo) e Promo Tech Nerd (PC gamer, peças, games e TV).'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-celular',
  'Promo Celular',
  'celulares',
  'cerca de 5 ofertas por dia',
  'group',
  NULL,
  50,
  true
),
(
  'pc-gamer',
  NULL,
  'Grupo de Promoção de PC Gamer no WhatsApp | Cuponito',
  'Grupo de promoção de PC gamer, peças e games no WhatsApp',
  'Promoções de placa de vídeo, peças de PC, notebook gamer, monitor, PS5, jogos e TV no WhatsApp, grátis. Cerca de 200 por dia, só os admins postam.',
  'O Promo Tech Nerd, do Cuponito, é um grupo de WhatsApp de promoções de tecnologia: placa de vídeo, peças de PC, notebook gamer, monitor, PS5, Xbox, jogos e TV. São cerca de 200 ofertas por dia, com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## O que chega no grupo

- **Placa de vídeo e peças de PC**: processador, memória, SSD, fonte, gabinete.
- **Notebook gamer** e **monitor gamer**.
- **Videogame**: PS5, Xbox e acessórios.
- **Jogos em promoção** para PS4, PS5, Xbox e Steam.
- **Smart TV em promoção**, de 32 a 75 polegadas.

## Cerca de 200 ofertas por dia: como usar sem se perder

O volume é alto porque o grupo cobre muita coisa. Para ver só o que interessa:

1. **Silencie o grupo** e abra quando quiser procurar.
2. Use a **busca do WhatsApp dentro do grupo**: "RTX", "PS5", "monitor 27", "SSD".
3. Quando achar um modelo, **compare o preço em outra loja** antes de comprar.

## TV e PS5 na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. TV e videogame estão entre os produtos mais procurados em promoção nessa época, e também entre os que mais têm desconto inflado. Entrar no grupo antes ajuda a conhecer o preço normal e saber quando a oferta é boa de verdade.

## Antes era o Promo Tech

O Promo Tech virou três grupos. Celular tem o **Promo Celular** ([grupo de promoção de celular](/grupo-whatsapp/celular)) e iPhone tem o **Promo iPhone** ([ofertas de iPhone](/ofertas/iphone)). O Promo Tech Nerd ficou com computador, games e TV.

## Cupons de tecnologia

Além do grupo, veja os [cupons de desconto da KaBuM](/desconto/cupom-desconto-kabum-br) e os [cupons de tecnologia](/categoria/tech).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de peças de PC no WhatsApp?', 'answer', 'Sim. O Promo Tech Nerd, do Cuponito, é um grupo de WhatsApp grátis com promoções de placa de vídeo, peças de PC, notebook gamer, monitor, videogame, jogos e TV, com o link da loja oficial.'),
    jsonb_build_object('question', 'Quantas ofertas chegam por dia?', 'answer', 'Cerca de 200. Vale silenciar o grupo e usar a busca do WhatsApp dentro dele para achar o que procura, como "RTX" ou "PS5".'),
    jsonb_build_object('question', 'O grupo manda promoção de TV e PS5?', 'answer', 'Sim. Smart TV, PS5, Xbox e jogos em promoção entram no grupo junto com as ofertas de PC.'),
    jsonb_build_object('question', 'Tem grupo de promoção de celular?', 'answer', 'Sim. Celular tem o Promo Celular e iPhone tem o Promo iPhone, os dois do Cuponito.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-tech',
  'Promo Tech Nerd',
  'PC gamer, peças, games e TV',
  'cerca de 200 ofertas por dia',
  'group',
  NULL,
  55,
  true
),
(
  'iphone',
  NULL,
  'iPhone em Promoção: ofertas de iPhone novo | Cuponito',
  'iPhone em promoção',
  'iPhone em promoção e iPhone barato: as ofertas de iPhone novo do Promo iPhone, com o link da loja oficial. Cerca de 2 por semana, só quando o preço cai.',
  'Esta página reúne as promoções de iPhone novo que saíram no Promo iPhone, o grupo de WhatsApp do Cuponito só de iPhone. O grupo manda cerca de 2 ofertas por semana, quando o preço cai, sempre com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## Por que só cerca de 2 ofertas por semana

O Promo iPhone avisa só quando um iPhone novo aparece com preço bom. Por isso o grupo **não lota o seu WhatsApp**: chegam poucas mensagens, e cada uma é sobre o aparelho que você quer.

## iPhone barato: novo, seminovo ou recondicionado

O Promo iPhone manda **só iPhone novo**. Antes de comprar qualquer iPhone barato:

- **Novo**: lacrado, com nota fiscal e garantia da Apple.
- **Seminovo ou usado**: já foi de outra pessoa. Confira a saúde da bateria e se o aparelho está desvinculado do iCloud do dono anterior.
- **Recondicionado**: passou por revisão. Veja quem revisou e qual garantia o vendedor dá.

## Como saber se a promoção de iPhone é boa

1. **Confirme o modelo e o armazenamento**: 128 GB e 256 GB têm preços bem diferentes.
2. **Compare o preço à vista no Pix com o parcelado**: o desconto costuma estar no Pix.
3. **Veja quem vende**: prefira a loja oficial ou "vendido e entregue por" a própria loja, com nota fiscal.
4. **Compare com outra loja** antes de fechar: desconto anunciado nem sempre é o menor preço.

## Qual iPhone costuma ter melhor custo-benefício

Os modelos de gerações anteriores costumam ficar mais baratos quando a Apple lança uma linha nova, o que normalmente acontece em setembro. Para quem quer gastar menos, vale olhar o modelo de um ou dois anos antes do mais recente.

## Outros grupos de celular

Procura celular de outras marcas? Veja o [grupo de promoção de celular](/grupo-whatsapp/celular). Para computador, games e TV, o [grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Onde encontrar iPhone em promoção?', 'answer', 'Nesta página e no Promo iPhone, grupo de WhatsApp do Cuponito que avisa quando um iPhone novo cai de preço, cerca de 2 vezes por semana, com o link da loja oficial.'),
    jsonb_build_object('question', 'O grupo manda iPhone usado ou seminovo?', 'answer', 'Não. O Promo iPhone manda só iPhone novo.'),
    jsonb_build_object('question', 'Tem grupo de promoção de iPhone no WhatsApp?', 'answer', 'Sim. O Promo iPhone é grátis, só os administradores postam e chegam cerca de 2 ofertas por semana.'),
    jsonb_build_object('question', 'Como saber se o iPhone em promoção é original?', 'answer', 'Compre na loja oficial ou em vendedor com nota fiscal, e confira se o aparelho vem lacrado e com garantia da Apple.')
  ),
  'https://linkdivulgador.com.br/g/promo-iphone',
  'Promo iPhone',
  'iPhone novo',
  'cerca de 2 ofertas por semana',
  'offers',
  'iphone',
  60,
  true
),
(
  'fraldas',
  NULL,
  'Fraldas em Promoção e Fralda Barata | Cuponito',
  'Fraldas em promoção',
  'Fraldas em promoção e fralda barata: as ofertas de fralda do Promo Bebês, com o link da loja oficial, e como calcular o preço por fralda.',
  'Esta página reúne as promoções de fralda que saíram no Promo Bebês, o grupo de WhatsApp do Cuponito com ofertas para bebês e crianças, sempre com o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Como saber se a fralda está barata: o preço por fralda

O preço do pacote engana. O que importa é **quanto custa cada fralda**:

**preço do pacote ÷ quantidade de fraldas = preço por fralda**

Exemplo: um pacote de R$ 59,90 com 60 fraldas sai a **R$ 1,00 por fralda**. Um pacote de R$ 39,90 com 32 fraldas parece mais barato, mas sai a **R$ 1,25 por fralda**.

## Fralda em promoção por tamanho

- **RN e P**: o bebê troca de tamanho rápido. Compre pouco por vez.
- **M e G**: tamanhos que duram mais meses; vale aproveitar promoção de pacote grande.
- **XG e XXG**: duram até o desfralde; bons para estocar quando o preço cai.

Antes de estocar, confira se o tamanho ainda vai servir até o pacote acabar.

## Fralda barata: onde comprar

- **Lojas online**: as promoções de fralda costumam vir com cupom ou frete grátis. Some o frete no preço por fralda.
- **Compra recorrente**: algumas lojas dão desconto para entrega programada todo mês.
- **Atacarejo**: vale comparar o preço por fralda com o das ofertas online.

Compare marcas (Pampers, Huggies, Personal, Babysec e outras) pelo preço por fralda, não pelo preço do pacote.

## Receba as promoções de fralda no WhatsApp

O **Promo Bebês** manda promoções de fralda e de produtos para bebês com o link da loja oficial. É grátis e só os administradores postam.

Veja também os [cupons de produtos para bebês](/categoria/infant-products), [todos os cupons de hoje](/cupons) e o [grupo de ofertas geral do Cuponito](/grupo-whatsapp).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Como saber se a fralda está barata?', 'answer', 'Divida o preço do pacote pela quantidade de fraldas. Um pacote de R$ 59,90 com 60 fraldas sai a R$ 1,00 por fralda.'),
    jsonb_build_object('question', 'Qual tamanho de fralda vale comprar em quantidade?', 'answer', 'Os tamanhos que duram mais meses, como M, G, XG e XXG. RN e P o bebê troca rápido, então vale comprar pouco por vez.'),
    jsonb_build_object('question', 'Tem grupo de promoção de fraldas no WhatsApp?', 'answer', 'Sim. O Promo Bebês, do Cuponito, manda promoções de fralda e de produtos para bebês, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O grupo é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-bebes',
  'Promo Bebês',
  'fraldas e produtos para bebês',
  NULL,
  'offers',
  'fralda',
  65,
  true
),
(
  'manicure',
  NULL,
  'Grupo de Manicure no WhatsApp: promoções | Cuponito',
  'Grupo de manicure no WhatsApp: promoções de materiais de unha',
  'Grupo de WhatsApp de promoções para manicure e salão: esmaltes, gel, alicates, cabines e materiais de unha, grátis. Só os admins postam.',
  'O Promo Salão, do Cuponito, é um grupo de WhatsApp de promoções para manicures, nail designers e profissionais de salão: esmaltes, gel, alicates, cabines e materiais de unha, com o link da loja oficial. Não é grupo de conversa: só os administradores postam, e é grátis.',
  $md$
## Grupo de promoções, não de conversa

Existem grupos de manicure para trocar dicas, aprender técnicas e divulgar trabalho. **Este é outro tipo**: um grupo só de **promoções de materiais**, para comprar mais barato o que você usa no atendimento. Só os administradores postam, então não tem conversa nem spam.

## O que chega no grupo

- **Esmaltes em promoção**, avulsos e em kit.
- **Unha em gel**: géis, bases, top coats e removedores.
- **Alicates, espátulas e lixas**.
- **Cabine LED/UV** e acessórios.
- **Descartáveis** e itens de esterilização.

## Também para depiladoras e cabeleireiras

O grupo é para quem trabalha em salão: **depiladoras** (cera, aquecedores, roll-on) e **cabeleireiras** (produtos de cabelo, secadores, chapinhas) também encontram promoções dos materiais da área.

## Como aproveitar promoção de esmalte e material de unha

1. **Compare o preço por unidade** em kits e no atacado.
2. **Confira a validade** de géis e esmaltes antes de estocar.
3. **Some o frete**: material leve às vezes sai mais caro pelo frete do que pelo produto.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também os [cupons de beleza](/categoria/beleza) e [todos os cupons de hoje](/cupons).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de manicure no WhatsApp?', 'answer', 'Sim. O Promo Salão, do Cuponito, é um grupo de WhatsApp de promoções de materiais para manicure e salão: esmaltes, gel, alicates e cabines, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'É grupo de conversa?', 'answer', 'Não. É um grupo só de promoções: só os administradores postam. Para trocar dicas, procure comunidades de manicure.'),
    jsonb_build_object('question', 'Serve para depiladora e cabeleireira?', 'answer', 'Sim. O grupo é para quem trabalha em salão, incluindo depiladoras e cabeleireiras.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. É grátis.')
  ),
  'https://linkdivulgador.com.br/g/promo-salao',
  'Promo Salão',
  'materiais de manicure, unha e salão',
  NULL,
  'group',
  NULL,
  70,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  h1               = EXCLUDED.h1,
  meta_description = EXCLUDED.meta_description,
  intro            = EXCLUDED.intro,
  content          = EXCLUDED.content,
  faq              = EXCLUDED.faq,
  join_url         = EXCLUDED.join_url,
  group_name       = EXCLUDED.group_name,
  topics           = EXCLUDED.topics,
  offer_volume     = EXCLUDED.offer_volume,
  page_type        = EXCLUDED.page_type,
  offer_terms      = EXCLUDED.offer_terms,
  sort_order       = EXCLUDED.sort_order,
  is_published     = EXCLUDED.is_published,
  updated_at       = now();

-- 4) Festas: despublicada, só guarda o link do grupo para o botão do post ------------------

INSERT INTO public.whatsapp_group_pages
  (slug, title, h1, meta_description, intro, content, join_url, group_name, topics, sort_order, is_published)
VALUES (
  'festas',
  'Promo Festas | Cuponito',
  'Promo Festas',
  'Grupo de promoções de artigos de festa e decoração do Cuponito.',
  'Grupo de WhatsApp de promoções de artigos de festa e decoração.',
  '',
  'https://linkdivulgador.com.br/g/promo-festas',
  'Promo Festas',
  'artigos de festa e decoração',
  90,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  join_url     = EXCLUDED.join_url,
  group_name   = EXCLUDED.group_name,
  topics       = EXCLUDED.topics,
  is_published = false,
  updated_at   = now();

-- 5) Categorias → grupo do nicho ---------------------------------------------------------

UPDATE public.coupon_categories SET group_slug = 'pc-gamer' WHERE slug IN ('tech', 'games');
UPDATE public.coupon_categories SET group_slug = 'fraldas' WHERE slug = 'infant-products';
UPDATE public.coupon_categories SET group_slug = 'manicure' WHERE slug = 'beleza';

-- 6) Post de ano novo (festas) -----------------------------------------------------------

WITH refs AS (
  SELECT
    (SELECT id FROM public.blog_authors WHERE name = 'Taciane Andrade' ORDER BY created_at ASC LIMIT 1) AS author_id,
    (SELECT id FROM public.blog_categories WHERE slug = 'datas-que-valem-ouro' LIMIT 1) AS category_id
)
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, cover_image, meta_title, meta_description,
  status, featured, published_at, author_id, category_id, group_slug
)
SELECT
  'Decoração de Ano Novo simples e barata: 7 ideias para gastar até R$ 50',
  'decoracao-de-ano-novo-simples-e-barata',
  'Decoração de Ano Novo simples e barata com o que você já tem em casa: 7 ideias com custo estimado, lista de compras até R$ 50 e onde achar balão e pisca-pisca em promoção.',
  $md$**Resposta direta:** para uma decoração de Ano Novo simples e barata, use **branco, dourado e prata**, **reaproveite o pisca-pisca e os enfeites do Natal** e decore **um ponto só** (a mesa da ceia ou uma parede para fotos). Com cerca de **R$ 50** dá para montar balões, fitas, estrelas de papel e um centro de mesa. Abaixo, 7 ideias com custo estimado e uma lista de compras.

## 7 ideias de decoração de Ano Novo barata

### 1. Painel de balões brancos e dourados

Monte um cantinho atrás da mesa ou para fotos com balões em grupos de 3. Um pacote de cada cor já faz efeito.

**Custo estimado:** R$ 15 a R$ 35.

### 2. Mesa de Ano Novo simples

Toalha branca, copos transparentes, guardanapos dobrados e alguns detalhes dourados. Garrafas de vidro limpas viram vasos.

**Custo estimado:** R$ 0 a R$ 25.

### 3. Cortina de luzes com o pisca-pisca do Natal

Pendure o pisca-pisca atrás de uma cortina branca leve, numa janela ou dentro de um pote de vidro. Prefira luzes de LED.

**Custo estimado:** R$ 0 (reaproveitado) a R$ 20.

### 4. Varal de estrelas de papel

Recorte estrelas em papel branco, dourado ou prata e pendure com barbante ou linha de nylon.

**Custo estimado:** R$ 3 a R$ 12.

### 5. Garrafas decoradas como centro de mesa

Pinte garrafas com tinta spray dourada ou envolva em papel alumínio, amarre uma fita e coloque folhagens ou flores.

**Custo estimado:** R$ 5 a R$ 20.

### 6. Velas em taças e potes de vidro

Velas comuns ou de LED dentro de taças e potes reaproveitados. Bolinhas de Natal prateadas na base dão brilho.

**Custo estimado:** R$ 5 a R$ 15.

### 7. Enfeites de Natal trocados de cor

Troque o vermelho e o verde por branco, dourado e prata: as mesmas bolinhas e fitas servem para o Réveillon.

**Custo estimado:** R$ 0.

## Lista de compras até R$ 50

| Item | Valor aproximado |
|---|---|
| Balões brancos e dourados | R$ 12 |
| Fita dourada | R$ 5 |
| Papel para estrelas | R$ 4 |
| Guardanapos brancos | R$ 5 |
| Velas de LED | R$ 10 |
| Tinta spray dourada | R$ 12 |
| Pisca-pisca e garrafas | reaproveitados |
| **Total** | **cerca de R$ 48** |

Os preços variam conforme a loja, a quantidade e o frete.

## Dica para gastar menos

Decore **um ponto principal** (a mesa da ceia ou uma parede para fotos) em vez da casa inteira. O ambiente fica bonito e a lista de compras cabe no orçamento.

## Onde achar balão, pisca-pisca e artigos de festa em promoção

O **Promo Festas**, grupo de WhatsApp do Cuponito, manda promoções de artigos de festa e decoração (balões, painéis, descartáveis e enfeites) com o link da loja oficial. É grátis e só os administradores postam. Compre com antecedência: perto do dia 31, o frete demora e os preços sobem.

Veja também os [cupons de hoje](/cupons) e [como saber se um grupo de ofertas é confiável](/blog/grupo-de-ofertas-whatsapp-e-confiavel).$md$,
  '/og-default.png',
  'Decoração de Ano Novo simples e barata | Cuponito',
  'Decoração de Ano Novo simples e barata: 7 ideias com custo estimado, lista de compras até R$ 50 e onde achar balões e pisca-pisca em promoção.',
  'published'::public.blog_post_status,
  false,
  now(),
  refs.author_id,
  refs.category_id,
  'festas'
FROM refs
ON CONFLICT (slug) DO NOTHING;
