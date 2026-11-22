-- Promo Natal (só decoração de Natal) e Promo Presentes (presentes de Natal): grupos criados pela
-- Flávia em 22/11/2026 (docs/analise-grupos-e-grupos-novos-2026-11-22.md, seção 6).
--
-- Dados que guiaram o texto (Planejador, Brasil, nov/2025 a out/2026; entre parênteses, nov/25 e dez/25):
--   decoração de natal 90.500 (450.000; 368.000) · enfeites de natal 74.000 (368.000; 165.000)
--   guirlanda de natal 60.500 (368.000; 165.000) · árvore de natal decorada 33.100 (246.000; 90.500)
--   decoração de natal simples 14.800 (49.500; 90.500) · mesa de natal 12.100 (33.100; 110.000)
--   pisca pisca de natal 9.900 (60.500; 22.200; +235% no ano) · enfeite de natal para porta 8.100
--   decoração de natal barata e criativa 6.600 (33.100) · enfeites de natal promoção 1.300 (9.900)
--   árvore de natal promoção 880 (5.400) · enfeites de natal shopee 880 (4.400)
--   presentes de natal 33.100 (90.500; 246.000) · amigo secreto 40.500 (165.000; 201.000)
--   presente de natal para namorado 5.400 (49.500 em dez) · presentes de natal feminino 3.600 (27.100 em dez)
--   presente amigo secreto 4.400 (27.100 em dez) · presentes de amigo secreto até 50 reais 1.300 (9.900 em dez)
--   presentes até 100 reais 1.000 (6.600 em dez) · presente até 30 reais 590 (4.400 em dez)
--   presente de natal barato 720 (5.400 em dez)
--   "grupo de … whatsapp" para decoração e presentes: sem volume. O grupo é achado pelo ChatGPT e pelo
--   diretório /grupos-de-promocao; a busca do Google é pelo produto → página de ofertas, não de grupo.
-- Respostas das IAs ainda não levantadas: a Flávia pediu as páginas já, porque a decoração tem o pico em
-- novembro. Rodada de IA depois.
--
-- offer_terms NULL: os dois grupos são só do assunto, então a página mostra todas as ofertas do grupo.
-- sort_order 2 e 3: a seção "Natal" fica logo depois dos achadinhos no diretório (a ordem da seção é a do
-- primeiro grupo dela). Depois do Natal, a Flávia muda no painel.
--
-- Links do Link Inteligente no formato novo, com o número da conta (/g/262/...), conferidos em 22/11 (302).
-- O feed delas só entra no arquivo de ofertas com o coletor novo (20261122150000_promo_pet_e_auto.sql),
-- que aceita /g/262/<grupo>. As duas migrations são independentes.

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published, directory_section)
VALUES
(
  'decoracao-de-natal',
  NULL,
  'Decoração de Natal: enfeites, árvore e pisca-pisca | Cuponito',
  'Decoração de Natal barata',
  'Decoração de Natal em promoção: enfeites, árvore, guirlanda e pisca-pisca no Promo Natal, com o link da loja oficial. E ideias simples para decorar gastando pouco.',
  'Esta página reúne as promoções de decoração de Natal que saíram no Promo Natal, o grupo de WhatsApp do Cuponito só de decoração de Natal: árvores, enfeites, bolas, guirlandas, pisca-pisca e mesa de Natal, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Compre a decoração em novembro

A procura por decoração de Natal tem o pico em **novembro**, não em dezembro. Em novembro de 2025, "decoração de natal" chegou a **450 mil buscas** no Google, e "enfeites de natal" e "guirlanda de natal", a 368 mil cada (Planejador de Palavras-chave do Google). Em dezembro, a procura muda para a **mesa de Natal**. Comprar cedo dá mais opção de modelo e tempo para a entrega chegar antes da ceia.

## Grupo de decoração de Natal no WhatsApp

O **Promo Natal** é um grupo só de ofertas de decoração de Natal: não tem conversa nem venda entre membros. Só os administradores postam, sempre com o link da loja oficial ou de um marketplace conhecido. É grátis, e dá para sair quando quiser.

## Árvore de Natal: o tamanho certo

- **Meça o pé-direito** e deixe espaço para a ponteira: a árvore não deve encostar no teto.
- **Árvore estreita** cabe em canto de sala pequena; a cheia pede mais espaço em volta.
- **Compare o número de galhos ou pontas**, não só a altura: duas árvores da mesma altura podem ter cheios bem diferentes, e o preço acompanha.
- **Árvore na parede** (feita de fita, luzes ou galhos) é a opção para quem não tem espaço nenhum.

## Pisca-pisca: o que conferir

- **LED** gasta menos energia e esquenta menos que a lâmpada comum.
- **Voltagem**: confira se é 127 V, 220 V ou bivolt antes de ligar.
- **Uso externo**: só use na varanda, na fachada ou no jardim o pisca-pisca que a embalagem diz ser para área externa.
- **Selo do Inmetro na embalagem** e fio sem emenda: desconfie do anúncio que não mostra a embalagem.
- **Quantas luzes**: uma regra comum de decorador é cerca de 100 lâmpadas para cada 30 cm de altura da árvore. Menos que isso fica discreto; mais, bem iluminado.

## Decoração de Natal simples e barata: 6 ideias

1. **Uma cor só** (dourado, vermelho ou branco): poucos enfeites parecem mais caros quando combinam.
2. **Kit de bolas** sai mais barato por unidade que bola avulsa: compare pelo preço de cada bola.
3. **Guirlanda na porta**: é o enfeite que mais aparece e um dos mais baratos.
4. **Pisca-pisca fora da árvore**: na janela, na estante ou dentro de um vidro.
5. **Mesa de Natal com o que já tem em casa**, mais um caminho de mesa e velas.
6. **Enfeite que dura**: o de plástico ou tecido aguenta vários Natais; o de vidro quebra.

## Como saber se a promoção é boa

- **Compare o preço por unidade** nos kits (bolas, enfeites, luzes).
- **Some o frete** e confira o **prazo de entrega** antes de 25 de dezembro.
- **Veja as fotos de quem comprou**: em decoração, a foto do anúncio engana no tamanho.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Procurando presente? O [Promo Presentes](/ofertas/presentes-de-natal) é o grupo de presentes de Natal, e tem também [brinquedos em promoção](/ofertas/brinquedos) e [perfume em promoção](/ofertas/perfume). Veja todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de decoração de Natal no WhatsApp?', 'answer', 'Sim. O Promo Natal, do Cuponito, é um grupo de WhatsApp grátis só com promoções de decoração de Natal: árvores, enfeites, guirlandas, pisca-pisca e mesa de Natal, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Quando comprar a decoração de Natal?', 'answer', 'Em novembro. É quando a procura chega ao pico e as lojas têm mais modelos; comprando cedo, a entrega chega antes do Natal.'),
    jsonb_build_object('question', 'Como fazer uma decoração de Natal barata?', 'answer', 'Escolha uma cor só, compre bolas em kit e compare pelo preço de cada uma, use guirlanda na porta e pisca-pisca fora da árvore, e prefira enfeites de plástico ou tecido, que duram vários anos.'),
    jsonb_build_object('question', 'O que conferir no pisca-pisca?', 'answer', 'Se é de LED, a voltagem (127 V, 220 V ou bivolt), se é para uso externo quando for ficar na área de fora e o selo do Inmetro na embalagem.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Natal é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/262/promo-natal',
  'Promo Natal',
  'decoração de Natal: árvores, enfeites, guirlandas e pisca-pisca',
  NULL,
  'offers',
  NULL,
  2,
  true,
  'Natal'
),
(
  'presentes-de-natal',
  NULL,
  'Presentes de Natal Baratos: até 50 e até 100 reais | Cuponito',
  'Presentes de Natal baratos',
  'Presentes de Natal em promoção no Promo Presentes: ideias até 30, 50 e 100 reais, amigo secreto, para ela e para ele, com o link da loja oficial.',
  'Esta página reúne as promoções de presentes de Natal que saíram no Promo Presentes, o grupo de WhatsApp do Cuponito só de presentes de Natal, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Presente de Natal: a procura é em dezembro

"Presentes de natal" chegou a **246 mil buscas em dezembro de 2025** no Google, e "amigo secreto", a 201 mil (Planejador de Palavras-chave do Google). Quem compra em novembro, na Black Friday (**27 de novembro de 2026**), tem mais estoque e mais tempo para a entrega.

## Grupo de presentes de Natal no WhatsApp

O **Promo Presentes** é um grupo só de ofertas de presentes de Natal: não tem conversa nem venda entre membros. Só os administradores postam, sempre com o link da loja oficial ou de um marketplace conhecido. É grátis, e dá para sair quando quiser.

## Presentes por faixa de preço

Defina o valor antes de procurar: é o que mais economiza no Natal.

- **Até 30 reais**: lembrancinhas, canecas, chocolates, itens de papelaria e acessórios.
- **Até 50 reais**: a faixa mais comum de amigo secreto. Kits de beleza, livros, jogos de cartas, acessórios de celular.
- **Até 100 reais**: perfumes nacionais, fones de ouvido, kits de cuidados, jogos de tabuleiro.
- **Acima de 100 reais**: eletrônicos, perfumes importados e brinquedos maiores. Veja as páginas de [perfume em promoção](/ofertas/perfume) e de [brinquedos em promoção](/ofertas/brinquedos).

## Amigo secreto: como acertar

- **Combine o valor** com o grupo e fique perto dele: presente muito acima constrange quem gastou menos.
- **Peça uma lista** de 3 opções, se o grupo permitir.
- **Presente unissex** (caneca, kit de chocolate, vela aromática, livro) é o que menos erra quando você não conhece a pessoa.

## Como saber se o presente em promoção é bom

- **Compare o preço** em mais de uma loja e o **preço por item** nos kits.
- **Some o frete** e confira o **prazo de entrega** antes de 25 de dezembro.
- **Veja a política de troca**: em presente, ela vale tanto quanto o preço.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Decorando a casa? O [Promo Natal](/ofertas/decoracao-de-natal) é o grupo de decoração de Natal. Veja todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de presentes de Natal no WhatsApp?', 'answer', 'Sim. O Promo Presentes, do Cuponito, é um grupo de WhatsApp grátis só com promoções de presentes de Natal, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Qual presente de amigo secreto até 50 reais?', 'answer', 'Kits de beleza, livros, jogos de cartas e acessórios de celular cabem nessa faixa. Se você não conhece a pessoa, prefira um presente unissex, como caneca, kit de chocolate ou vela aromática.'),
    jsonb_build_object('question', 'Quando comprar o presente de Natal mais barato?', 'answer', 'Na Black Friday, em 27 de novembro de 2026, ou logo depois. Em dezembro a procura sobe e o prazo de entrega fica mais apertado.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Presentes é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/262/promo-presentes',
  'Promo Presentes',
  'presentes de Natal',
  NULL,
  'offers',
  NULL,
  3,
  true,
  'Natal'
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  h1                = EXCLUDED.h1,
  meta_description  = EXCLUDED.meta_description,
  intro             = EXCLUDED.intro,
  content           = EXCLUDED.content,
  faq               = EXCLUDED.faq,
  join_url          = EXCLUDED.join_url,
  group_name        = EXCLUDED.group_name,
  topics            = EXCLUDED.topics,
  offer_volume      = EXCLUDED.offer_volume,
  page_type         = EXCLUDED.page_type,
  offer_terms       = EXCLUDED.offer_terms,
  sort_order        = EXCLUDED.sort_order,
  is_published      = EXCLUDED.is_published,
  directory_section = EXCLUDED.directory_section,
  updated_at        = now();

-- Links internos (≥ 3 por página nova): grupo geral, brinquedos, perfume (+ diretório e home, automáticos).

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.',
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.
- **Natal**: [Promo Natal](/ofertas/decoracao-de-natal), só decoração de Natal, e [Promo Presentes](/ofertas/presentes-de-natal), presentes de Natal.'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/ofertas/decoracao-de-natal%';

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      'Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).',
      'Procurando outros presentes? Veja os [presentes de Natal em promoção](/ofertas/presentes-de-natal) e a [decoração de Natal barata](/ofertas/decoracao-de-natal). Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).'
    ),
    updated_at = now()
WHERE slug = 'brinquedos'
  AND content NOT LIKE '%/ofertas/presentes-de-natal%';

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '## Perfume de presente

Para presentear sem errar o cheiro, prefira um perfume que a pessoa já usa ou um tamanho menor. Confira a **política de troca** da loja antes de comprar.',
      '## Perfume de presente

Para presentear sem errar o cheiro, prefira um perfume que a pessoa já usa ou um tamanho menor. Confira a **política de troca** da loja antes de comprar. Mais ideias por faixa de preço em [presentes de Natal em promoção](/ofertas/presentes-de-natal).'
    ),
    updated_at = now()
WHERE slug = 'perfume'
  AND content NOT LIKE '%/ofertas/presentes-de-natal%';

-- Diretório: os dois grupos na resposta "quais são os grupos" (só se ainda não estiverem).
UPDATE public.whatsapp_group_pages
SET faq = (
      SELECT jsonb_agg(
               CASE
                 WHEN item->>'question' = 'Quais são os grupos de promoção do Cuponito no WhatsApp?'
                  AND item->>'answer' NOT LIKE '%Promo Natal%'
                 THEN jsonb_set(item, '{answer}', to_jsonb(replace(
                        item->>'answer',
                        'Promo Festas',
                        'Promo Festas, Promo Natal (decoração de Natal), Promo Presentes (presentes de Natal)')))
                 ELSE item
               END)
      FROM jsonb_array_elements(faq) AS item
    ),
    updated_at = now()
WHERE slug = 'grupos-de-promocao'
  AND jsonb_typeof(faq) = 'array'
  AND faq::text NOT LIKE '%Promo Natal%';
