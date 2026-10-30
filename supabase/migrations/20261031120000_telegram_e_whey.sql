-- Canal do Telegram nas páginas do grupo + página de whey + Black Friday no iPhone e no PC gamer
-- (docs/plano-black-november-2026-10-30.md, seção 9). Rode DEPOIS da 20261030180000_black_friday_tv_tenis.sql.
--
-- Dados que guiaram os textos (Planejador, Brasil, out/2025 a set/2026):
--   "whey promoção", "whey protein promoção", "creatina promoção", "creatina em promoção": 1–10 mil cada
--   "whey isolado promoção", "whey dux promoção", "whey growth promoção", "hipercalorico em promoção",
--   "black friday whey", "black friday creatina": 100–1 mil; "creatina creapure promoção": 10–100 (+900% em 3 meses)
--   "grupo de promoção de suplementos": 10–100 (por isso página de ofertas, não página "grupo de")
--   "black friday iphone", "black friday ps5", "black friday notebook": 1–10 mil cada
-- Google Trends: "whey promoção" fica estável o ano todo (5 a 9) e sobe em novembro (8): busca de
--   compra recorrente, não só de Black Friday.
-- Autocompletar (30/10): "grupo de promoção placa de video", "grupo de promoção de peças de pc telegram".
-- Respostas de IA (ChatGPT, 30/10) para "grupo de promoção de whey": cita grupos especializados e diz
--   que o critério certo é o preço por grama de proteína e o histórico de preço, não o % de desconto.
--
-- Fatos confirmados pela Flávia: canal https://t.me/promotechnerd (espelha o Promo Tech Nerd);
-- grupo de whey e suplementos no Link Inteligente promo-fit-whey-suplemento (volume ainda não medido).

-- 1) Coluna do canal do Telegram ---------------------------------------------------------

ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS telegram_url TEXT;

COMMENT ON COLUMN public.whatsapp_group_pages.telegram_url IS
  'Canal do Telegram com as mesmas ofertas (https://t.me/<nome>). Vazio = sem botão "Prefere Telegram?". O /entrar?d=telegram usa este link.';

UPDATE public.whatsapp_group_pages
SET telegram_url = 'https://t.me/promotechnerd', updated_at = now()
WHERE slug = 'pc-gamer' AND telegram_url IS NULL;

-- 2) Página de whey e creatina ------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES (
  'whey',
  NULL,
  'Whey e Creatina em Promoção: como achar o preço bom | Cuponito',
  'Whey e creatina em promoção',
  'Whey e creatina em promoção no Promo Fit, com o link da loja oficial, e como calcular o preço por grama de proteína para saber se o desconto é bom.',
  'Esta página reúne as promoções de whey protein, creatina e suplementos que saíram no Promo Fit, o grupo de WhatsApp do Cuponito só de suplementos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Como saber se o whey está barato: o preço por grama de proteína

O preço do pote engana: potes do mesmo tamanho têm quantidades diferentes de proteína. O que importa é **quanto custa cada grama de proteína**:

1. Veja na tabela nutricional **quanta proteína tem cada dose** e **de quantos gramas é a dose**.
2. **Proteína do pote** = peso do pote ÷ tamanho da dose × proteína por dose.
3. **Preço por grama de proteína** = preço ÷ proteína do pote.

Exemplo: um pote de 900 g, com dose de 30 g e 21 g de proteína por dose, tem 630 g de proteína. Por R$ 99, sai a **R$ 0,16 por grama de proteína**. Um pote de 900 g com 24 g de proteína por dose tem 720 g de proteína e, pelo mesmo preço, sai a R$ 0,14: é mais barato, mesmo custando igual.

## Concentrado, isolado ou hidrolisado

- **Concentrado**: o mais barato por grama. Tem um pouco mais de gordura e lactose.
- **Isolado**: mais proteína por dose e menos lactose. Custa mais.
- **Hidrolisado**: proteína "pré-digerida", a mais cara.

Compare o preço por grama de proteína **dentro do mesmo tipo**: isolado sempre parece caro ao lado do concentrado.

## Creatina em promoção: o que conferir

- **Creatina monohidratada** é a forma mais estudada e a mais comum.
- O selo **Creapure** indica uma matéria-prima alemã específica, que custa mais.
- Para comparar, use o **preço por grama**: preço ÷ peso do pote. Potes de 300 g, 500 g e 1 kg têm preços por grama bem diferentes.

## Whey e creatina na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. A busca por "whey promoção" fica estável o ano inteiro e sobe em novembro. Como suplemento é compra que se repete, a Black Friday é boa hora para estocar, **se a validade cobrir o tempo de uso**. Anote o preço por grama de hoje e compare na semana da Black Friday: se o preço subiu antes e "caiu" depois, o desconto é falso.

## Como evitar suplemento falsificado

- **Compre na loja oficial** da marca ou em loja conhecida, com nota fiscal. Desconfie de preço muito abaixo do das lojas grandes.
- Confira **lote e validade** na embalagem e se o lacre está intacto.
- Prefira marcas que **divulgam laudos de análise** da quantidade de proteína.

Suplemento não substitui alimentação. Para saber quanto e qual usar, converse com um nutricionista ou médico.

## Receba as promoções no WhatsApp

O **Promo Fit** manda promoções de whey, creatina e suplementos, com o preço do momento e o link da loja oficial. É grátis e só os administradores postam. Procurando tênis de corrida ou de academia? Veja o [Promo Tênis](/ofertas/tenis). Todos os grupos estão no [grupo de ofertas do Cuponito](/grupo-whatsapp).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de whey no WhatsApp?', 'answer', 'Sim. O Promo Fit, do Cuponito, é um grupo de WhatsApp grátis com promoções de whey, creatina e suplementos, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como saber se o whey em promoção está barato?', 'answer', 'Calcule o preço por grama de proteína: divida o preço pela proteína do pote (peso do pote ÷ tamanho da dose × proteína por dose). Compare sempre dentro do mesmo tipo, concentrado com concentrado.'),
    jsonb_build_object('question', 'Vale comprar whey e creatina na Black Friday?', 'answer', 'Vale para estocar, se a validade cobrir o tempo de uso. Anote o preço por grama antes de novembro para saber se o desconto é real.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Fit é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-fit-whey-suplemento',
  'Promo Fit',
  'whey, creatina e suplementos',
  NULL,
  'offers',
  'whey,creatina,suplement,protein,hipercalor,pre-treino,pre treino',
  64,
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

-- 3) iPhone: Black Friday ------------------------------------------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '## Outros grupos de celular',
      $md$## iPhone na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**, e "black friday iphone" está entre as buscas de Black Friday que mais cresceram nos últimos 3 meses. Para não cair em desconto falso:

1. **Anote hoje o preço** do modelo e do armazenamento que você quer.
2. Na Black Friday, **compare com esse preço**, não com o "de" do anúncio: se o preço subiu antes e "caiu" depois, o desconto é falso.
3. Comparadores como Buscapé e Zoom mostram o **histórico de preço**.

O Promo iPhone avisa quando um iPhone novo cai de preço, também na Black Friday.

## Outros grupos de celular$md$
    ),
    updated_at = now()
WHERE slug = 'iphone'
  AND content LIKE '%## Outros grupos de celular%'
  AND content NOT LIKE '%iPhone na Black Friday%';

-- 4) PC gamer: placa de vídeo, Black Friday de PS5 e notebook, e o canal do Telegram --------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '## Antes era o Promo Tech',
      $md$## Grupo de promoção de placa de vídeo e peças de PC

Placa de vídeo é uma das ofertas que mais aparecem no grupo. Antes de comprar:

- **Compare o mesmo chip** (por exemplo, RTX 4060 com RTX 4060): placas de marcas diferentes com o mesmo chip têm preços diferentes.
- Confira a **memória (VRAM)** e se a sua **fonte** tem a potência e os conectores que a placa pede.
- Veja **quem vende** e a garantia: prefira a loja oficial ou "vendido e entregue por" a própria loja.

PS5 e notebook também estão entre as buscas de Black Friday que mais crescem, e entram no grupo junto com as peças.

## Também no Telegram

Prefere Telegram? O canal **Promo Tech Nerd** no Telegram tem as mesmas ofertas do grupo: [t.me/promotechnerd](https://t.me/promotechnerd). No canal, só os administradores postam e ninguém vê o seu número.

## Antes era o Promo Tech$md$
    ),
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND content LIKE '%## Antes era o Promo Tech%'
  AND content NOT LIKE '%Grupo de promoção de placa de vídeo%';

-- 5) /grupo-whatsapp: Promo Fit na lista de grupos por assunto ------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Bebês**: [Promo Bebês](/ofertas/fraldas), fraldas e produtos para bebê.',
      '- **Bebês**: [Promo Bebês](/ofertas/fraldas), fraldas e produtos para bebê.
- **Whey e creatina**: [Promo Fit](/ofertas/whey), suplementos.
- **PC no Telegram**: [canal Promo Tech Nerd](https://t.me/promotechnerd).'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/ofertas/whey%';
