-- Promo Perfumes: página /ofertas/perfume (docs/plano-black-november-2026-10-30.md, seção 12).
--
-- Dados que guiaram o texto (Planejador, Brasil, out/2025 a set/2026):
--   "grupo de promoção de perfumes whatsapp": 100–1 mil (+900% no ano) → o grupo
--   "perfume em promoção", "perfume promoção", "promoção de perfumes": 1–10 mil
--   "perfume masculino promoção", "perfume feminino promoção": 1–10 mil cada
--   "perfumes importados promoção", "promoção perfume importado": 1–10 mil
--   "promoção boticário", "promoções do boticário": 10–100 mil; "perfumes da natura em promoção": 1–10 mil
--   "perfume promoção black friday": 10–100 (Black Friday quase não pesa em perfume)
-- Página de ofertas (como /ofertas/tenis): a busca do produto é 10x a do "grupo de".
-- Link Inteligente promo-perfumes criado pela Flávia em 31/10; volume do grupo ainda não medido.

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES (
  'perfume',
  NULL,
  'Perfume em Promoção: importados, masculino e feminino | Cuponito',
  'Perfume em promoção',
  'Perfume em promoção: importados, nacionais, Boticário e Natura, masculino e feminino, no Promo Perfumes, com o link da loja oficial. E como comparar pelo preço por ml.',
  'Esta página reúne as promoções de perfume que saíram no Promo Perfumes, o grupo de WhatsApp do Cuponito só de perfumes: importados e nacionais, masculinos e femininos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Grupo de promoção de perfumes no WhatsApp

O **Promo Perfumes** é um grupo só de ofertas de perfume: não tem conversa nem venda entre membros. Só os administradores postam, sempre com o link da loja oficial ou de um marketplace conhecido. É grátis.

## Como saber se o perfume está barato: o preço por ml

Frascos de tamanhos diferentes enganam. Compare **quanto custa cada ml**:

**preço ÷ ml do frasco = preço por ml**

Exemplo: um frasco de 100 ml por R$ 399 sai a **R$ 3,99 por ml**. O de 50 ml do mesmo perfume por R$ 249 sai a R$ 4,98 por ml: o frasco maior é mais barato, mesmo custando mais.

Compare sempre a **mesma concentração**: um Eau de Parfum e um Eau de Toilette do mesmo nome são produtos diferentes.

## Concentração: parfum, EDP, EDT e colônia

- **Parfum / Extrait**: a maior concentração, dura mais e custa mais.
- **Eau de Parfum (EDP)**: boa fixação, a mais comum nos importados.
- **Eau de Toilette (EDT)**: mais leve e mais barata que o EDP.
- **Colônia e body splash**: as mais leves, para o dia a dia.

## Perfume importado em promoção: como evitar falsificado

- **Compre na loja oficial** da marca, em perfumaria conhecida ou no marketplace com "vendido e entregue por" a própria loja.
- **Preço muito abaixo** do das lojas grandes é o principal sinal de falsificação.
- Confira **lote, validade e lacre** da caixa ao receber.
- "Inspirado em" ou "contratipo" **não é o perfume original**: é outro produto, com outro preço.

## Boticário, Natura e perfumes nacionais

As marcas nacionais fazem promoção com frequência, inclusive em kits. Compare o kit pelo preço de cada item avulso: kit só vale a pena se você usa tudo o que vem nele.

## Perfume de presente

Para presentear sem errar o cheiro, prefira um perfume que a pessoa já usa ou um tamanho menor. Confira a **política de troca** da loja antes de comprar.

## Receba as promoções no WhatsApp

O **Promo Perfumes** manda promoções de perfume com o preço do momento e o link da loja oficial. É grátis e só os administradores postam. Veja também os [cupons de beleza](/categoria/beleza), o [grupo de promoções para manicure e salão](/grupo-whatsapp/manicure) e todos os grupos no [grupo de ofertas do Cuponito](/grupo-whatsapp).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de perfumes no WhatsApp?', 'answer', 'Sim. O Promo Perfumes, do Cuponito, é um grupo de WhatsApp grátis só com promoções de perfume: importados e nacionais, masculinos e femininos, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como saber se o perfume em promoção está barato?', 'answer', 'Divida o preço pelos ml do frasco. Um frasco de 100 ml por R$ 399 sai a R$ 3,99 por ml. Compare sempre a mesma concentração, como Eau de Parfum com Eau de Parfum.'),
    jsonb_build_object('question', 'Como saber se o perfume importado é original?', 'answer', 'Compre na loja oficial, em perfumaria conhecida ou com "vendido e entregue por" a própria loja, e desconfie de preço muito abaixo do mercado. "Inspirado em" ou contratipo não é o original.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Perfumes é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-perfumes',
  'Promo Perfumes',
  'perfumes importados e nacionais',
  NULL,
  'offers',
  'perfume,colonia,parfum,toilette,body splash,fragrancia',
  66,
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
  page_type        = EXCLUDED.page_type,
  offer_terms      = EXCLUDED.offer_terms,
  sort_order       = EXCLUDED.sort_order,
  is_published     = EXCLUDED.is_published,
  updated_at       = now();

-- /grupo-whatsapp: Promo Perfumes na lista de grupos por assunto
UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Whey e creatina**: [Promo Fit](/ofertas/whey), suplementos.',
      '- **Whey e creatina**: [Promo Fit](/ofertas/whey), suplementos.
- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/ofertas/perfume%';
