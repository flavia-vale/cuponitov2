-- Grupos de nicho no site (docs/plano-ofertas-e-nichos-2026-10-22.md).
--
-- A Flávia tem 4 grupos de nicho no Espelha Grupos (Link Inteligente próprio cada):
--   promo-tech   → tecnologia, games e informática
--   promo-bebes  → bebês, crianças e mamães
--   promo-festas → organizadoras de festa: balões, pegue e monte, painéis
--   promo-salao  → donas de salão, manicures, cabeleireiras, depiladoras
--
-- Cada nicho vira uma página do grupo (/grupo-whatsapp/<slug>) com o link dele, e as
-- categorias de cupom apontam para o nicho: o botão do WhatsApp na categoria e nas
-- lojas em que ela é a mais comum leva ao grupo certo. Tudo editável no painel.
--
-- Idempotente: ADD COLUMN IF NOT EXISTS, INSERT ... ON CONFLICT DO NOTHING (não
-- sobrescreve o que for editado no painel) e UPDATE só onde o nicho está vazio.

-- 1) Colunas ----------------------------------------------------------------------------

ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS group_name TEXT,
  ADD COLUMN IF NOT EXISTS topics     TEXT;

COMMENT ON COLUMN public.whatsapp_group_pages.group_name IS
  'Grupo de nicho: nome do grupo no WhatsApp. Vazio = a página fala do grupo geral.';
COMMENT ON COLUMN public.whatsapp_group_pages.topics IS
  'Grupo de nicho: o que chega nele. Aparece no botão ("Receba ofertas de ...").';

ALTER TABLE public.coupon_categories
  ADD COLUMN IF NOT EXISTS group_slug TEXT;

COMMENT ON COLUMN public.coupon_categories.group_slug IS
  'Página do grupo de nicho (whatsapp_group_pages.slug). Vazio = grupo geral.';

-- 2) Páginas dos nichos -----------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url, group_name, topics, sort_order)
VALUES
(
  'tecnologia',
  NULL,
  'Grupo de Promoções de Tecnologia no WhatsApp | Cuponito',
  'Grupo de promoções de tecnologia e games no WhatsApp',
  'Promoções de celular, notebook, games, periféricos e eletrônicos no WhatsApp, grátis. Grupo só de ofertas, com o link da loja oficial.',
  'O Promo Tech, do Cuponito, é um grupo de WhatsApp só com promoções de tecnologia: celulares, notebooks, games, periféricos e eletrônicos, com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## O que chega no grupo

- **Celulares e acessórios:** smartphones, fones, carregadores, capinhas.
- **Informática:** notebooks, monitores, SSD, memória, roteadores.
- **Games:** consoles, jogos, controles, cadeiras e periféricos gamer.
- **Casa conectada:** smart TVs, caixas de som, lâmpadas e tomadas inteligentes.

Cada oferta chega com o preço do momento e o link da loja. Preço de tecnologia muda rápido: confira o valor final no carrinho antes de pagar.

## Cupons de tecnologia

Além do grupo, veja os [cupons de desconto da KaBuM](/desconto/cupom-desconto-kabum-br) e os [cupons de tecnologia](/categoria/tech), atualizados todos os dias.

## Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. Tecnologia é a categoria que mais cai de preço e a que mais tem "desconto de mentira". Entrar antes ajuda a ver o preço normal e saber se a oferta é boa de verdade.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**; o grupo só envia o link. O grupo nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também o [grupo de ofertas geral do Cuponito](/grupo-whatsapp), com achadinhos de todas as lojas.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de tecnologia no WhatsApp?', 'answer', 'Sim. O Promo Tech, do Cuponito, envia promoções de celulares, notebooks, games e eletrônicos, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'O grupo de tecnologia manda ofertas de games?', 'answer', 'Sim. Consoles, jogos, controles e periféricos gamer entram no grupo junto com as outras ofertas de tecnologia.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-tech',
  'Promo Tech',
  'tecnologia, games e informática',
  50
),
(
  'bebes',
  NULL,
  'Grupo de Promoções para Bebês no WhatsApp | Cuponito',
  'Grupo de promoções para bebês, crianças e mamães no WhatsApp',
  'Promoções de fraldas, enxoval, brinquedos e roupas infantis no WhatsApp, grátis. Grupo só de ofertas para mamães, com o link da loja oficial.',
  'O Promo Bebês, do Cuponito, é um grupo de WhatsApp com promoções para bebês, crianças e mamães: fraldas, enxoval, brinquedos, roupas e itens de maternidade, com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## O que chega no grupo

- **Fraldas e higiene:** fraldas, lenços umedecidos, pomadas, itens de banho.
- **Enxoval e maternidade:** bodies, mantas, bolsas, bombas de leite.
- **Brinquedos e livros infantis** para todas as idades.
- **Roupas e calçados infantis**, inclusive de volta às aulas.

Fralda e lenço são compra de todo mês: vale comparar o **preço por unidade** e aproveitar quando cai.

## Cupons para bebês

Veja também os [cupons de produtos para bebês](/categoria/infant-products) e [todos os cupons de hoje](/cupons).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**; o grupo só envia o link. O grupo nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também o [grupo de ofertas geral do Cuponito](/grupo-whatsapp).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de fralda no WhatsApp?', 'answer', 'Sim. O Promo Bebês, do Cuponito, envia promoções de fraldas, lenços, enxoval e brinquedos, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'O grupo é só para mães?', 'answer', 'Não. Qualquer pessoa que compra para bebês e crianças pode entrar: pais, avós, tios e quem vai dar presente.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-bebes',
  'Promo Bebês',
  'bebês, crianças e mamães',
  60
),
(
  'festas',
  NULL,
  'Grupo de Promoções para Festas no WhatsApp | Cuponito',
  'Grupo de promoções para festas e decoração no WhatsApp',
  'Promoções de balões, kits pegue e monte, painéis e artigos de festa no WhatsApp, grátis. Para quem organiza e decora festas.',
  'O Promo Festas, do Cuponito, é um grupo de WhatsApp com promoções para quem organiza e decora festas: balões, kits pegue e monte, painéis, toalhas, descartáveis e lembrancinhas, com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## Para quem é

Para **decoradoras e organizadoras de festa** que compram material toda semana, e para quem está montando a própria festa em casa.

## O que chega no grupo

- **Balões:** bexigas, balões metalizados, arcos e bombas de encher.
- **Pegue e monte:** kits, bandejas, suportes, boleiras e cilindros.
- **Painéis e tecidos:** painéis redondos, capas, toalhas e trilhos.
- **Descartáveis e lembrancinhas:** copos, pratos, forminhas, caixinhas.

Material de festa é compra em quantidade: compare o preço **por unidade** e o frete antes de fechar.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**; o grupo só envia o link. O grupo nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também os [cupons de hoje](/cupons) e o [grupo de ofertas geral do Cuponito](/grupo-whatsapp).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de material de festa no WhatsApp?', 'answer', 'Sim. O Promo Festas, do Cuponito, envia promoções de balões, kits pegue e monte, painéis e descartáveis, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'Serve para decoradora profissional?', 'answer', 'Sim. O grupo foi pensado para quem compra material de festa com frequência, mas qualquer pessoa pode entrar.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-festas',
  'Promo Festas',
  'artigos de festa, balões e decoração',
  70
),
(
  'salao-de-beleza',
  NULL,
  'Grupo de Promoções para Salão de Beleza no WhatsApp | Cuponito',
  'Grupo de promoções para salão de beleza no WhatsApp',
  'Promoções de produtos para salão, manicure, cabelo e depilação no WhatsApp, grátis. Para donas de salão e profissionais da beleza.',
  'O Promo Salão, do Cuponito, é um grupo de WhatsApp com promoções para profissionais da beleza: produtos de cabelo, esmaltes e materiais de manicure, cera e depilação, equipamentos e móveis de salão, com o link da loja oficial. É grátis e só os administradores postam.',
  $md$
## Para quem é

Para **donas de salão, cabeleireiras, manicures, depiladoras** e quem atende em casa e precisa repor material sem pagar caro.

## O que chega no grupo

- **Cabelo:** progressivas, máscaras, tintas, escovas, secadores e chapinhas.
- **Unhas:** esmaltes, géis, cabines, lixas, alicates e descartáveis.
- **Depilação:** ceras, aquecedores, roll-on e lenços.
- **Salão:** cadeiras, carrinhos auxiliares, lavatórios, toalhas e itens de esterilização.

Para quem compra para trabalhar, a economia está em repor no momento da baixa: o grupo avisa quando o preço cai.

## Cupons de beleza

Veja também os [cupons de beleza](/categoria/beleza) e [todos os cupons de hoje](/cupons).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**; o grupo só envia o link. O grupo nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também o [grupo de ofertas geral do Cuponito](/grupo-whatsapp).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção para salão de beleza no WhatsApp?', 'answer', 'Sim. O Promo Salão, do Cuponito, envia promoções de produtos de cabelo, manicure, depilação e equipamentos de salão, com o link da loja oficial. É grátis.'),
    jsonb_build_object('question', 'Serve para manicure e depiladora?', 'answer', 'Sim. O grupo é para todas as profissionais da beleza: cabeleireiras, manicures, depiladoras e donas de salão.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-salao',
  'Promo Salão',
  'produtos para salão, manicure e cabelo',
  80
)
ON CONFLICT (slug) DO NOTHING;

-- 3) Categorias → nicho -----------------------------------------------------------------

UPDATE public.coupon_categories SET group_slug = 'tecnologia'
WHERE group_slug IS NULL AND slug IN ('tech', 'games');

UPDATE public.coupon_categories SET group_slug = 'bebes'
WHERE group_slug IS NULL AND slug = 'infant-products';

UPDATE public.coupon_categories SET group_slug = 'salao-de-beleza'
WHERE group_slug IS NULL AND slug = 'beleza';
