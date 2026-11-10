-- Promo Eletrodomésticos: /ofertas/geladeira e /ofertas/ar-condicionado
-- (docs/plano-leads-quentes-2026-11-10.md, seção 9).
--
-- Dados que guiaram o texto (Planejador, Brasil, out/2025 a set/2026, série mensal):
--   "geladeira em promoção" e 8 variações: 60.500/mês (nov/25: 90.500; nunca abaixo de 49.500)
--   "black friday geladeira": 6.600/mês, 60.500 em nov/25
--   "geladeira frost free promoção" 8.100; Brastemp 1.900, Electrolux 1.600, Consul 1.300;
--   "geladeira side by side promoção" 880 (+156% no ano); "geladeira inverter promoção" 720
--   "ar condicionado em promoção": 14.800/mês (+83% em 3 meses, +50% no ano), 33.100 em dez/25
--   "black friday ar condicionado": 27.100 em nov/25; 12.000 BTUs 5.400; 9.000 BTUs 3.600
--   "air fryer promoção" 8.100; "grupo de promoção de eletrodomésticos whatsapp" 30 (subindo)
-- Google Trends (2021–2026): Black Friday de geladeira = metade da de TV; em alta: inverter, Midea,
-- 3 portas, side by side. ChatGPT (09/11) cita 4 grupos de eletrodomésticos, nenhum do Cuponito.
-- Formato do tênis e da TV: página de ofertas por produto, grupo próprio por trás.
-- Grupo criado pela Flávia em 10/11, ~30 ofertas por dia.
--
-- Rodar depois de ligar o feed ofertas.json do link promo-eletrodomesticos no Espelha Grupos
-- (sem o feed a página sai sem "Ofertas de hoje").

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES
(
  'geladeira',
  'cupom-desconto-electrolux',
  'Geladeira em Promoção: frost free e inverter | Cuponito',
  'Geladeira em promoção',
  'Geladeira em promoção: frost free e inverter de Brastemp, Electrolux, Consul e Midea, com o link da loja oficial. Como comparar pelo preço por litro.',
  'Esta página reúne as promoções de geladeira que saíram no Promo Eletrodomésticos, o grupo de WhatsApp do Cuponito de geladeira, ar-condicionado, air fryer e outros eletrodomésticos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Geladeira na Black Friday 2026

A Black Friday é em **27 de novembro de 2026**. Geladeira é um dos eletrodomésticos mais procurados nessa data: em novembro de 2025, a busca "black friday geladeira" chegou a **60 mil por mês** no Google, quase dez vezes a média do ano.

Desconto falso aparece mais nessa época. Antes de comprar:

1. **Anote o preço de hoje** do modelo que você quer. Se ele subir em novembro e "cair" na Black Friday, o desconto é de mentira (a Senacon chama de "metade do dobro").
2. **Compare em comparadores com histórico de preço** (Buscapé, Zoom, Google Shopping).
3. **Compare o Pix com o parcelado**: o desconto costuma estar no Pix.
4. **Confira o frete e a entrega**: geladeira é grande, e o frete muda muito de loja para loja.

## Como saber se a geladeira está barata: o preço por litro

Geladeiras de tamanhos diferentes enganam. Compare **quanto custa cada litro**:

**preço ÷ litros da geladeira = preço por litro**

Exemplo: uma geladeira de 450 litros por R$ 3.600 sai a **R$ 8 por litro**. Uma de 300 litros por R$ 2.700 sai a R$ 9 por litro: a maior é mais barata por litro, mesmo custando mais. Só vale comparar geladeiras do mesmo tipo (frost free com frost free, inverter com inverter).

## Frost free, inverter, side by side ou 3 portas?

- **Frost free**: não forma gelo nas paredes e não precisa descongelar. É o tipo mais procurado.
- **Inverter**: o compressor muda de velocidade em vez de ligar e desligar, e por isso gasta menos energia. Custa mais na compra e economiza na conta de luz.
- **Inverse**: o freezer fica embaixo e a geladeira em cima, na altura dos olhos.
- **Side by side**: geladeira e freezer lado a lado, com portas verticais. Ocupa mais largura.
- **3 portas e french door**: duas portas em cima e freezer em gaveta embaixo. Ocupam mais espaço e custam mais.

## Qual o tamanho certo

Uma referência comum: **até 300 litros** para 1 ou 2 pessoas, **300 a 400 litros** para 3 ou 4 pessoas e **mais de 400 litros** para 5 ou mais, ou para quem faz compra do mês. Antes de comprar, **meça o espaço** (com folga atrás para ventilação) e **a largura da porta** por onde a geladeira vai passar.

Confira também a **voltagem** (110 V ou 220 V) e a **etiqueta de eficiência** do Inmetro: quanto mais perto da classe A, menor o consumo.

## Brastemp, Electrolux, Consul e Midea

As quatro marcas mais procuradas em promoção. A **Midea** é a que mais cresce nas buscas de geladeira na Black Friday nos últimos anos. Compare sempre o **mesmo tipo e o mesmo tamanho** entre marcas, pelo preço por litro.

## O que mais chega no Promo Eletrodomésticos

Além de geladeira: [ar-condicionado em promoção](/ofertas/ar-condicionado), air fryer, micro-ondas, fogão, lava e seca e freezer. São cerca de 30 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia), os [cupons da Electrolux](/desconto/cupom-desconto-electrolux), o [grupo de promoção de TV](/ofertas/tv) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de eletrodomésticos no WhatsApp?', 'answer', 'Sim. O Promo Eletrodomésticos, do Cuponito, é um grupo de WhatsApp grátis com promoções de geladeira, ar-condicionado, air fryer e outros eletrodomésticos, cerca de 30 por dia, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. O Cyber Monday é em 30 de novembro.'),
    jsonb_build_object('question', 'Como saber se a geladeira em promoção está barata?', 'answer', 'Divida o preço pelos litros. Uma geladeira de 450 litros por R$ 3.600 sai a R$ 8 por litro. Compare só geladeiras do mesmo tipo, como frost free com frost free, e confira o frete.'),
    jsonb_build_object('question', 'Geladeira inverter vale a pena?', 'answer', 'O compressor inverter gasta menos energia porque muda de velocidade em vez de ligar e desligar. A geladeira custa mais na compra e economiza na conta de luz ao longo dos anos.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Eletrodomésticos é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/promo-eletrodomesticos',
  'Promo Eletrodomésticos',
  'geladeira, ar-condicionado, air fryer e eletrodomésticos',
  'cerca de 30 ofertas por dia',
  'offers',
  'geladeira,refrigerador,frost free,freezer,frigobar,side by side,inverse',
  67,
  true
),
(
  'ar-condicionado',
  NULL,
  'Ar-Condicionado em Promoção: split inverter | Cuponito',
  'Ar-condicionado em promoção',
  'Ar-condicionado em promoção: split inverter de 9.000, 12.000 e 18.000 BTUs, com o link da loja oficial. Quantos BTUs para o seu cômodo.',
  'Esta página reúne as promoções de ar-condicionado que saíram no Promo Eletrodomésticos, o grupo de WhatsApp do Cuponito de ar-condicionado, geladeira, air fryer e outros eletrodomésticos, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Ar-condicionado na Black Friday e no verão

A Black Friday é em **27 de novembro de 2026**. Em novembro de 2025, a busca "black friday ar condicionado" chegou a **27 mil por mês** no Google. E a procura por ar-condicionado em promoção não para aí: ela **quase dobra em dezembro**, com o calor, e só volta ao normal depois do verão.

Antes de comprar:

1. **Anote o preço de hoje** do modelo e compare em comparadores com histórico (Buscapé, Zoom, Google Shopping). Se o preço subir e "cair" na Black Friday, o desconto é de mentira.
2. **Confira se a instalação está incluída**: normalmente ela é cobrada à parte. Some o valor da instalação ao comparar ofertas.
3. **Compare o Pix com o parcelado**: o desconto costuma estar no Pix.
4. **Confira a voltagem** (110 V ou 220 V) antes de fechar.

## Quantos BTUs para o meu cômodo

A regra prática mais usada é de **cerca de 600 BTUs por metro quadrado**, somando mais para cada pessoa a mais no ambiente e para cômodo com sol da tarde:

| Cômodo | BTUs |
|---|---|
| até ~15 m² (quarto) | 9.000 |
| até ~20 m² (quarto grande, sala pequena) | 12.000 |
| até ~30 m² (sala) | 18.000 |
| acima de ~30 m² | 22.000 ou mais |

É uma referência: o instalador confirma pelo tamanho real, pela insolação e pelo número de pessoas. Ar fraco demais para o cômodo trabalha sem parar e gasta mais.

## Inverter ou convencional?

O **inverter** ajusta a velocidade do compressor e mantém a temperatura sem ligar e desligar o tempo todo, por isso **gasta menos energia** e faz menos barulho. Custa mais na compra e se paga na conta de luz, principalmente para quem usa todo dia. Confira a **etiqueta do Inmetro**: quanto mais perto da classe A, menor o consumo.

## Split, janela ou portátil

- **Split hi-wall**: o mais comum hoje. Unidade dentro e fora de casa, silencioso, precisa de instalação.
- **Janela**: mais barato e mais barulhento, precisa de um vão na parede.
- **Portátil**: não precisa de instalação fixa, mas resfria menos e precisa de saída de ar pela janela.

## O que mais chega no Promo Eletrodomésticos

Além de ar-condicionado: [geladeira em promoção](/ofertas/geladeira), air fryer, micro-ondas, fogão, lava e seca e freezer. São cerca de 30 ofertas por dia.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada, nem Pix para "liberar" cupom. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja também os [cupons da Casas Bahia](/desconto/cupom-desconto-casas-bahia), o [grupo de promoção de TV](/ofertas/tv) e todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de ar-condicionado no WhatsApp?', 'answer', 'Sim. O Promo Eletrodomésticos, do Cuponito, é um grupo de WhatsApp grátis com promoções de ar-condicionado, geladeira, air fryer e outros eletrodomésticos, cerca de 30 por dia, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quantos BTUs preciso para um quarto?', 'answer', 'Pela regra prática de cerca de 600 BTUs por metro quadrado, um quarto de até 15 m² pede 9.000 BTUs e um de até 20 m², 12.000 BTUs. Some mais para cada pessoa a mais e para cômodo com sol da tarde. O instalador confirma.'),
    jsonb_build_object('question', 'Ar-condicionado inverter vale a pena?', 'answer', 'Para quem usa todo dia, sim: o inverter gasta menos energia e faz menos barulho. Custa mais na compra e se paga na conta de luz.'),
    jsonb_build_object('question', 'A instalação vem incluída na promoção?', 'answer', 'Normalmente não. A instalação costuma ser cobrada à parte; confira no anúncio e some o valor ao comparar ofertas.'),
    jsonb_build_object('question', 'Quando é a Black Friday 2026?', 'answer', 'Em 27 de novembro de 2026, uma sexta-feira. A procura por ar-condicionado continua alta em dezembro e janeiro, com o calor.')
  ),
  'https://linkdivulgador.com.br/g/promo-eletrodomesticos',
  'Promo Eletrodomésticos',
  'ar-condicionado, geladeira, air fryer e eletrodomésticos',
  'cerca de 30 ofertas por dia',
  'offers',
  'ar condicionado,ar-condicionado,split,btus,climatizador,ventilador',
  68,
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

-- Diretório /grupos-de-promocao: o grupo entra uma vez só, pela página da geladeira.
UPDATE public.whatsapp_group_pages
SET directory_section = 'Casa e eletrodomésticos', updated_at = now()
WHERE slug = 'geladeira'
  AND directory_section IS NULL;

-- /grupo-whatsapp: Promo Eletrodomésticos na lista de grupos por assunto
UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.',
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.
- **Geladeira e ar-condicionado**: [Promo Eletrodomésticos](/ofertas/geladeira), também [ar-condicionado](/ofertas/ar-condicionado), air fryer e micro-ondas.'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/ofertas/geladeira%';

-- /ofertas/tv: link para o grupo de eletrodomésticos (quem compra TV na Black Friday olha geladeira)
UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      'Celular tem o [grupo de promoção de celular](/grupo-whatsapp/celular).',
      'Celular tem o [grupo de promoção de celular](/grupo-whatsapp/celular). Geladeira e ar-condicionado têm o [Promo Eletrodomésticos](/ofertas/geladeira).'
    ),
    updated_at = now()
WHERE slug = 'tv'
  AND content NOT LIKE '%/ofertas/geladeira%';
