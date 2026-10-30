-- Black November 2026: páginas de TV e de tênis + seções de Black Friday
-- (docs/plano-black-november-2026-10-30.md, seções 7.1 a 7.5).
--
-- ANTES DE RODAR: criar no Link Inteligente os links `promo-tv` e `promo-tenis`
-- (grupos Promo TV e Promo Tênis). Sem eles, o botão das páginas novas leva a um link morto.
--
-- Dados que guiaram os textos (Planejador, Brasil, out/2025 a set/2026):
--   "tenis em promoção", "tênis feminino promoção", "tênis nike promoção": 10–100 mil cada
--   "tênis de corrida promoção": 1–10 mil; "grupo de promoção de tênis whatsapp": 100–1 mil
--   "tenis black friday", "black friday nike", "black friday netshoes": 1–10 mil (+900% em 3 meses)
--   "tv em promoção": 10–100 mil (+900% no ano, dado de 23/10); "black friday tv",
--   "televisao black friday", "tv blackfriday": 1–10 mil
--   "black friday celular samsung" e variações: 1–10 mil
--   "grupo black friday whatsapp", "grupo de ofertas black friday": 10–100 (não vira página)
-- Google Trends (jan/2025 a out/2026): em nov/2025, "black friday tv" 100, "black friday celular" 60,
--   "black friday tênis" 25; tudo volta ao nível de outubro em dezembro. No tênis, o feminino é
--   quase 3x o masculino na Black Friday; New Balance (+30%) e On (+40%) subindo.
-- Respostas de IA (ChatGPT, 30/10): para "grupo de promoção de tênis" e "tem grupo de black friday"
--   ele cita diretórios e páginas com nome do grupo + link; para "promoção real" cita
--   comparadores de preço e a Senacon ("metade do dobro").
--
-- Fatos confirmados pela Flávia em 30/10: Promo Tênis ~50 ofertas/dia; Promo TV é grupo
-- novo (volume ainda não medido, por isso sem número na página).
--
-- As páginas antigas não são reescritas: as seções novas entram por replace(), só se ainda
-- não estiverem lá. Assim nada editado no painel depois de 23/10 se perde.

-- 1) Páginas novas -------------------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES
(
  'tv',
  NULL,
  'TV em Promoção: ofertas de Smart TV e Black Friday | Cuponito',
  'TV em promoção',
  'TV em promoção: as ofertas de Smart TV do Promo TV, com o preço do momento e o link da loja oficial. Black Friday 2026 em 27/11 e como saber se o desconto é real.',
  'Esta página reúne as promoções de TV que saíram no Promo TV, o grupo de WhatsApp do Cuponito só de televisão, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Black Friday 2026: a semana da TV

A Black Friday é em **27 de novembro de 2026** e o Cyber Monday em 30 de novembro. TV é o produto mais procurado em promoção nessa época: no Google Trends de 2025, a busca por "black friday tv" foi **o dobro** da de celular. A procura começa a subir em outubro e cai de volta já em dezembro.

Por isso o desconto falso também aparece mais. Antes de comprar:

1. **Anote o preço de hoje** da TV que você quer. Se ele subir em novembro e "cair" na Black Friday, o desconto é de mentira. A Senacon chama isso de **"metade do dobro"**.
2. **Compare em comparadores de preço** (Buscapé, Zoom, Google Shopping), que mostram o histórico.
3. **Compare o preço no Pix com o parcelado**: o desconto costuma estar no Pix.
4. **Confira quem vende e entrega**: prefira a loja oficial ou "vendido e entregue por" a própria loja, com nota fiscal e garantia.

## Qual TV escolher

- **Tamanho**: quanto mais longe do sofá, maior a tela. Em sala pequena, 43" a 50" costumam bastar; em sala grande, 55" a 65". Meça a parede e a distância antes de comprar.
- **4K**: virou o padrão a partir de 43". Em 32", as TVs costumam ser HD ou Full HD.
- **LED, QLED ou OLED**: o LED comum é o mais barato; o QLED tem mais brilho e cor; o OLED tem preto de verdade e o melhor contraste, e custa mais.
- **Sistema**: Google TV, webOS (LG), Tizen (Samsung) e Roku TV rodam os principais apps de streaming. Escolha o que você já sabe usar.
- **Para videogame**: procure HDMI 2.1 e 120 Hz se você joga no PS5 ou no Xbox Series X.

## TV em promoção: modelo exato antes do preço

A mesma TV muda de código de ano para ano, e o modelo do ano anterior costuma ser mais barato. Antes de comparar preços, **confira o código do modelo** (ele fica no título do anúncio). Comparar pelo nome ("TV 55 4K") junta aparelhos diferentes.

## Receba as promoções de TV no WhatsApp

O **Promo TV** manda só promoções de televisão, com o preço do momento e o link da loja oficial. É grátis e só os administradores postam. Quer também PC, videogame e peças? Veja o [grupo de promoção de PC gamer](/grupo-whatsapp/pc-gamer). Celular tem o [grupo de promoção de celular](/grupo-whatsapp/celular).

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia), os [cupons da KaBuM](/desconto/cupom-desconto-kabum-br) e os [cupons de tecnologia](/categoria/tech).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de TV no WhatsApp?', 'answer', 'Sim. O Promo TV, do Cuponito, é um grupo de WhatsApp grátis só com promoções de televisão, com o preço do momento e o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. O Cyber Monday é em 30 de novembro.'),
    jsonb_build_object('question', 'Como saber se o desconto da TV na Black Friday é real?', 'answer', 'Anote o preço da TV antes de novembro e compare em comparadores com histórico de preço, como Buscapé, Zoom e Google Shopping. Se o preço subiu antes e "caiu" na Black Friday, o desconto é falso.'),
    jsonb_build_object('question', 'Qual tamanho de TV comprar?', 'answer', 'Depende da distância do sofá. Em sala pequena, 43 a 50 polegadas costumam bastar; em sala grande, 55 a 65. Meça a parede e a distância antes.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo TV é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-tv',
  'Promo TV',
  'TV e Smart TV',
  NULL,
  'offers',
  'tv,televis',
  58,
  true
),
(
  'tenis',
  'cupom-desconto-netshoes',
  'Tênis em Promoção: Nike, Adidas, corrida e feminino | Cuponito',
  'Tênis em promoção',
  'Tênis em promoção: Nike, Adidas, New Balance, corrida, feminino e masculino. Cerca de 50 ofertas por dia no Promo Tênis, com o link da loja oficial. Grátis.',
  'Esta página reúne as promoções de tênis que saíram no Promo Tênis, o grupo de WhatsApp do Cuponito só de tênis: Nike, Adidas, New Balance, corrida e academia, feminino e masculino. São cerca de 50 ofertas por dia, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Grupo de promoção de tênis no WhatsApp

O **Promo Tênis** é um grupo só de ofertas: não tem conversa nem compra e venda entre membros. Só os administradores postam, com o link da loja oficial (Netshoes, Centauro, Nike, Adidas, Amazon, Mercado Livre e outras). São **cerca de 50 ofertas por dia**, então vale silenciar o grupo e usar a busca do WhatsApp dentro dele: "corrida", "feminino", "42", "New Balance".

## O que chega no grupo

- **Tênis feminino e masculino** em promoção, para o dia a dia.
- **Tênis de corrida** e de academia.
- **Marcas** como Nike, Adidas, New Balance e outras, conforme as promoções do dia.
- **Ofertas relâmpago** e cupons das lojas de esporte.

## Tênis na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. A busca por "tênis black friday" multiplica em novembro, e o que mais se procura é **tênis feminino**, seguido de Nike, Adidas e Netshoes. New Balance e On são as marcas que mais cresceram em procura.

Para não cair em desconto falso:

1. **Anote o preço de hoje** do modelo que você quer e compare na semana da Black Friday.
2. **Compare o mesmo modelo em duas lojas**: Netshoes, Centauro e a loja da marca costumam ter preços diferentes.
3. **Some o frete** e confira a política de troca antes de pagar.

## Como saber se o tênis em promoção é original

- **Compre na loja oficial** da marca ou em loja de esporte conhecida, com nota fiscal.
- No marketplace, veja se é **"vendido e entregue por"** a própria loja ou por um vendedor com boa reputação.
- **Preço muito abaixo** do das lojas grandes é sinal de réplica.

## Numeração e troca

A numeração muda de marca para marca. Antes de comprar, **confira a tabela de medidas** da marca (em centímetros do pé) e a **política de troca** da loja: a primeira troca costuma ser grátis nas lojas grandes, mas vale confirmar.

## Cupons de tênis

Além do grupo, veja os [cupons da Netshoes](/desconto/cupom-desconto-netshoes), os [cupons da Nike](/desconto/cupom-desconto-nike-br), os [cupons da Adidas](/desconto/cupom-desconto-adidas-br) e os [cupons de esportes](/categoria/sports).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de tênis no WhatsApp?', 'answer', 'Sim. O Promo Tênis, do Cuponito, é um grupo de WhatsApp grátis só com promoções de tênis: Nike, Adidas, New Balance, corrida, feminino e masculino. São cerca de 50 ofertas por dia, com o link da loja oficial.'),
    jsonb_build_object('question', 'O grupo vende tênis?', 'answer', 'Não. O grupo só envia o link da oferta, e a compra é feita no site ou aplicativo da loja. Para evitar réplica, prefira a loja oficial da marca ou uma loja de esporte conhecida, com nota fiscal.'),
    jsonb_build_object('question', 'Tem promoção de tênis feminino?', 'answer', 'Sim. O grupo manda tênis feminino e masculino, de corrida, academia e dia a dia.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026. Na Black Friday, as ofertas de tênis da Nike, Adidas, Netshoes e Centauro chegam ao grupo assim que saem.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  'https://linkdivulgador.com.br/g/promo-tenis',
  'Promo Tênis',
  'tênis feminino, masculino e de corrida',
  'cerca de 50 ofertas por dia',
  'offers',
  'tenis',
  62,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  store_slug       = EXCLUDED.store_slug,
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

-- 2) /grupo-whatsapp: os grupos por assunto na Black Friday --------------------------------
-- "grupo black friday whatsapp" tem só 10–100 buscas: não vira página. A pergunta vai às IAs,
-- então a resposta entra na página do grupo, que o ChatGPT já lê.

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '## Páginas do grupo por loja e tema',
      $md$## Grupo de Black Friday no WhatsApp: escolha pelo assunto

Na Black Friday, quem procura um produto encontra mais rápido num grupo só daquele assunto. Os grupos do Cuponito são grátis, e em todos só os administradores postam:

- **TV**: [Promo TV](/ofertas/tv), só promoções de televisão.
- **Celular**: [Promo Celular](/grupo-whatsapp/celular). iPhone tem o [Promo iPhone](/ofertas/iphone).
- **PC, PS5 e games**: [Promo Tech Nerd](/grupo-whatsapp/pc-gamer).
- **Tênis**: [Promo Tênis](/ofertas/tenis), Nike, Adidas, corrida, feminino e masculino.
- **Bebês**: [Promo Bebês](/ofertas/fraldas), fraldas e produtos para bebê.
- **De tudo um pouco**: este grupo, com cerca de 200 ofertas por dia.

## Páginas do grupo por loja e tema$md$
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content LIKE '%## Páginas do grupo por loja e tema%'
  AND content NOT LIKE '%Grupo de Black Friday no WhatsApp%';

-- 3) Tech Nerd: TV agora tem grupo próprio ------------------------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Smart TV em promoção**, de 32 a 75 polegadas.',
      '- **Smart TV em promoção**, de 32 a 75 polegadas. Quer só TV? O **Promo TV** manda só televisão: [TV em promoção](/ofertas/tv).'
    ),
    updated_at = now()
WHERE slug = 'pc-gamer'
  AND content NOT LIKE '%/ofertas/tv%';

-- 4) Celular: Black Friday com as marcas que mais se procuram -------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      'A Black Friday é em **27 de novembro de 2026**. Entrar no grupo antes ajuda a conhecer o preço normal dos celulares e perceber quando o desconto é de verdade.',
      'A Black Friday é em **27 de novembro de 2026**. No Google Trends de 2025, a busca por "black friday celular" só perdeu para a de TV. Entrar no grupo antes ajuda a conhecer o preço normal dos celulares e perceber quando o desconto é de verdade.

Para não cair em desconto falso, anote o preço de hoje do modelo que você quer e compare na Black Friday: se o preço subiu antes e "caiu" depois, o desconto é de mentira. Comparadores como Buscapé e Zoom mostram o histórico de preço.'
    ),
    updated_at = now()
WHERE slug = 'celular'
  AND content NOT LIKE '%black friday celular%';

-- 5) Categoria → grupo do nicho ---------------------------------------------------------

UPDATE public.coupon_categories SET group_slug = 'tenis' WHERE slug = 'sports';
