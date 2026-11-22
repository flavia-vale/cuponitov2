-- Promo Pet e Promo Auto e Moto: grupos e links criados pela Flávia em 22/11/2026
-- (docs/analise-grupos-e-grupos-novos-2026-11-22.md, seções 6.3, 6.4 e 8).
--
-- Dados que guiaram o texto (Planejador, Brasil, nov/2025 a out/2026, média mensal; lance = topo da página):
--   Auto: acessórios para carro 22.200 (27.100 em nov e dez; lance até R$ 3,16) · aspirador de pó carro 18.100
--     (+22% no ano) · aspirador de carros 5.400 · aspirador para carro 4.400 · aspirador de pó automotivo 3.600
--     · aspirador automotivo 2.900 · acessórios automotivos 5.400 · pneu (12/11): ~144 mil somando as medidas
--   Moto: acessórios para moto 8.100 · acessorios moto 4.400 · acessórios de moto 2.900
--     · capacete promoção 6.600 · capacete barato 6.600 (+22% no ano)
--   Fora: moto peças 60.500, peças de carro 18.100 → loja do bairro ("perto de mim", nome de loja) e peça
--     que depende do modelo; não é busca de oferta online.
--   Pet: ração em promoção 720 · promoção de ração 320 · bravecto promoção 480 (+85% no ano)
--     · ração cachorro/gato promoção 210 cada · por marca e peso (Golden 20 kg, 15 kg, 10 kg) 110 a 170.
--     Pouca busca, lance de R$ 6 a R$ 10 (o mais alto dos estudos).
--   "grupo de … whatsapp": peças de moto 20, peças de carro 10, pet sem volume → página de ofertas.
-- Respostas das IAs ainda não levantadas (a Flávia pediu as páginas em 22/11). Rodada depois.
--
-- Links do Link Inteligente no formato novo, com o número da conta: /g/262/<grupo> (conferidos: 302).
-- Por isso o coletor do arquivo de ofertas passa a aceitar /g/<conta>/<grupo> (item 1). O site faz o
-- mesmo em src/lib/groupOfferFeed.ts (offerFeedUrl/offerFeedSlug).

-- 1) Coletor do arquivo de ofertas: aceita /g/<grupo> e /g/<conta>/<grupo> ---------------------------
--    Igual a 20261113120000_arquivo_de_ofertas.sql; só muda o padrão do link (passo 3).

CREATE OR REPLACE FUNCTION public.collect_group_offers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  response RECORD;
  feed RECORD;
BEGIN
  -- 1. Respostas dos pedidos anteriores → ofertas novas.
  FOR response IN
    SELECT f.request_id, f.feed_slug, r.content
    FROM public.group_offer_fetches f
    JOIN net._http_response r ON r.id = f.request_id
    WHERE r.status_code = 200 AND r.content IS NOT NULL
  LOOP
    BEGIN
      INSERT INTO public.group_offers (feed_slug, link, text, text_norm, store, sent_at)
      SELECT
        response.feed_slug,
        left(trim(item->>'link'), 2000),
        left(trim(item->>'text'), 200),
        lower(extensions.unaccent(left(trim(item->>'text'), 200))),
        nullif(left(trim(item->>'store'), 40), ''),
        coalesce(public.safe_timestamptz(item->>'sentAt'), now())
      FROM jsonb_array_elements(
        CASE WHEN jsonb_typeof(response.content::jsonb -> 'items') = 'array'
             THEN response.content::jsonb -> 'items' ELSE '[]'::jsonb END
      ) AS item
      WHERE jsonb_typeof(item) = 'object'
        AND coalesce(trim(item->>'text'), '') <> ''
        AND item->>'link' ~ '^https?://[^\s]+$'
      ON CONFLICT (feed_slug, link) DO NOTHING;
    EXCEPTION WHEN others THEN
      -- Resposta que não é JSON: ignora este feed nesta rodada.
      NULL;
    END;
  END LOOP;

  -- Pedido respondido (com sucesso ou não) ou esquecido há mais de 1 hora sai da fila.
  DELETE FROM public.group_offer_fetches f
  WHERE f.requested_at < now() - interval '1 hour'
     OR EXISTS (SELECT 1 FROM net._http_response r WHERE r.id = f.request_id);

  -- 2. Oferta com mais de 35 dias: o preço já não vale.
  DELETE FROM public.group_offers
  WHERE coalesce(sent_at, first_seen) < now() - interval '35 days';

  -- 3. Novos pedidos: um por grupo (links das páginas + link global), só do Link Inteligente.
  --    `promo-tech` (link antigo) ou `262/promo-pet` (link novo, com o número da conta).
  FOR feed IN
    SELECT DISTINCT (regexp_match(url, '^https://(?:www\.)?linkdivulgador\.com\.br/g/((?:[0-9]{1,10}/)?[a-z0-9-]{3,40})/?$'))[1] AS slug
    FROM (
      SELECT join_url AS url FROM public.whatsapp_group_pages WHERE join_url IS NOT NULL
      UNION
      SELECT value->>'whatsapp_group' FROM public.site_settings WHERE key = 'global_links'
    ) links
  LOOP
    CONTINUE WHEN feed.slug IS NULL;
    INSERT INTO public.group_offer_fetches (request_id, feed_slug)
    VALUES (
      net.http_get(
        url := 'https://linkdivulgador.com.br/g/' || feed.slug || '/ofertas.json',
        headers := '{"Accept": "application/json"}'::jsonb,
        timeout_milliseconds := 8000
      ),
      feed.slug
    );
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.collect_group_offers() FROM PUBLIC, anon, authenticated;

-- 2) Páginas ------------------------------------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published, directory_section)
VALUES
(
  'acessorios-para-carro',
  NULL,
  'Acessórios para Carro em Promoção: aspirador e mais | Cuponito',
  'Acessórios para carro em promoção',
  'Acessórios para carro em promoção: aspirador automotivo, suporte de celular, multimídia, tapetes e pneus no Promo Auto e Moto, com o link da loja oficial.',
  'Esta página reúne as promoções de acessórios para carro que saíram no Promo Auto e Moto, o grupo de WhatsApp do Cuponito de acessórios para carro e moto, capacetes e pneus, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Grupo de promoção de carro e moto no WhatsApp

O **Promo Auto e Moto** é um grupo só de ofertas para carro e moto: acessórios, aspiradores, multimídia, capacetes e pneus. Não tem conversa nem venda entre membros. Só os administradores postam, sempre com o link da loja oficial ou de um marketplace conhecido. É grátis, e dá para sair quando quiser.

O grupo manda **produto que dá para comprar pela internet**. Peça de reposição (freio, embreagem, suspensão) depende do modelo e do ano do veículo: compre com o código da peça e, de preferência, com o mecânico que vai instalar.

## Aspirador automotivo: qual escolher

"Aspirador de pó carro" tem cerca de **18 mil buscas por mês** no Google, e cresceu 22% no último ano (Planejador de Palavras-chave do Google).

- **12 V (na tomada do carro)**: não acaba a bateria no meio da limpeza, mas o fio limita o alcance. Confira o comprimento do cabo.
- **Sem fio (bateria)**: mais prático, mas a bateria dura poucos minutos. Veja o tempo de uso e de recarga no anúncio.
- **Filtro lavável** economiza: não precisa comprar refil.
- **Bicos**: o bico estreito é o que alcança entre os bancos e no trilho.

## Acessórios para carro mais procurados

- **Suporte de celular** e **carregador veicular**: confira se o carregador tem a potência que o seu celular aceita.
- **Multimídia**: confira o tamanho do encaixe do painel (1 DIN ou 2 DIN) e se é compatível com Android Auto ou CarPlay, se você usa.
- **Câmera de ré** e **sensor de estacionamento**: a instalação costuma ser cobrada à parte.
- **Tapetes e capas de banco**: compre pelo modelo e ano do carro; o "universal" nem sempre encaixa.
- **Calibrador e compressor portátil**: ajudam a manter a pressão certa dos pneus, indicada na porta ou no manual.

## Pneus em promoção

Pneu também chega no grupo. Veja como ler a medida (175/70 R14) e as medidas mais procuradas em [pneu em promoção](/ofertas/pneu).

## Moto

Capacete e acessórios para moto têm página própria: [capacete em promoção](/ofertas/capacete).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de acessórios para carro no WhatsApp?', 'answer', 'Sim. O Promo Auto e Moto, do Cuponito, é um grupo de WhatsApp grátis com promoções de acessórios para carro e moto, aspiradores, capacetes e pneus, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Aspirador automotivo 12 V ou sem fio?', 'answer', 'O de 12 V liga na tomada do carro e não descarrega no meio da limpeza, mas o fio limita o alcance. O sem fio é mais prático, mas a bateria dura poucos minutos: veja o tempo de uso no anúncio.'),
    jsonb_build_object('question', 'O grupo manda peças de carro e moto?', 'answer', 'O foco são acessórios, aspiradores, capacetes e pneus, que dá para comprar pela internet. Peça de reposição depende do modelo e do ano do veículo; compre com o código da peça.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Auto e Moto é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/262/promo-auto-e-moto',
  'Promo Auto e Moto',
  'acessórios para carro e moto, aspiradores, capacetes e pneus',
  NULL,
  'offers',
  'carro,automotiv,veicular,aspirador,multimidia,calibrador,compressor,camera de re,sensor de estacionamento,tapete,capa de banco,porta-malas,volante,palheta,pneu',
  82,
  true,
  'Carro e moto'
),
(
  'capacete',
  NULL,
  'Capacete em Promoção e acessórios para moto | Cuponito',
  'Capacete em promoção',
  'Capacete em promoção e acessórios para moto no Promo Auto e Moto, com o link da loja oficial. Como achar o tamanho certo e o que conferir no selo do Inmetro.',
  'Esta página reúne as promoções de capacete e de acessórios para moto que saíram no Promo Auto e Moto, o grupo de WhatsApp do Cuponito de carro e moto, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Capacete em promoção: o que mais se busca

"Capacete promoção" e "capacete barato" têm cerca de **6,6 mil buscas por mês cada** no Google, e "acessórios para moto", cerca de **8 mil** (Planejador de Palavras-chave do Google). Capacete é o item em que não vale economizar na segurança: a promoção boa é a do capacete certo, mais barato.

## Como achar o tamanho do capacete

1. Meça a **volta da cabeça** com uma fita métrica, cerca de 2 cm acima das sobrancelhas.
2. O número do capacete (56, 58, 60…) é essa medida em **centímetros**. Entre dois tamanhos, prove os dois se puder.
3. O capacete certo fica **firme**: não gira na cabeça e não aperta a ponto de doer.

## O que conferir antes de comprar

- **Selo do Inmetro** no capacete: capacete de moto vendido no Brasil precisa ter a certificação.
- **Tipo**: fechado (mais proteção), articulado (abre a queixeira) ou aberto.
- **Viseira**: a transparente é a que vale para pilotar à noite.
- **Depois de uma queda**, troque o capacete, mesmo sem rachadura aparente.

## Acessórios para moto

- **Baú e bagageiro**: confira se o suporte é compatível com o modelo da moto.
- **Luvas, jaqueta e capa de chuva**: compare a tabela de medidas da marca.
- **Suporte de celular para moto**: prefira os que travam o aparelho e amortecem a vibração.
- **Peça de reposição** (relação, pastilha de freio, cabo) depende do modelo e do ano: compre com o código da peça.

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Para carro, veja os [acessórios para carro em promoção](/ofertas/acessorios-para-carro) e o [pneu em promoção](/ofertas/pneu). Todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de moto no WhatsApp?', 'answer', 'Sim. O Promo Auto e Moto, do Cuponito, é um grupo de WhatsApp grátis com promoções de capacetes, acessórios para moto e carro e pneus, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como saber o tamanho do capacete?', 'answer', 'Meça a volta da cabeça com uma fita métrica, cerca de 2 cm acima das sobrancelhas. O número do capacete é essa medida em centímetros: 58 cm, tamanho 58.'),
    jsonb_build_object('question', 'O que conferir num capacete em promoção?', 'answer', 'O selo do Inmetro, o tamanho certo, o tipo (fechado, articulado ou aberto) e a viseira. Depois de uma queda, troque o capacete.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Auto e Moto é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/262/promo-auto-e-moto',
  'Promo Auto e Moto',
  'acessórios para carro e moto, aspiradores, capacetes e pneus',
  NULL,
  'offers',
  'capacete,moto,viseira,bau,bagageiro,luva,jaqueta,capa de chuva,motociclista',
  83,
  true,
  NULL
),
(
  'racao',
  NULL,
  'Ração em Promoção: cachorro e gato | Cuponito',
  'Ração em promoção',
  'Ração em promoção para cachorro e gato, areia, antipulgas e petiscos no Promo Pet, com o link da loja oficial. E como comparar pelo preço do quilo.',
  'Esta página reúne as promoções de ração e de produtos para pet que saíram no Promo Pet, o grupo de WhatsApp do Cuponito só de pet: ração para cachorro e gato, areia, antipulgas, petiscos e acessórios, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
  $md$
## Grupo de promoção de pet no WhatsApp

O **Promo Pet** é um grupo só de ofertas para cachorro e gato: não tem conversa nem venda entre membros. Só os administradores postam, sempre com o link da loja oficial ou de um marketplace conhecido. É grátis, e dá para sair quando quiser.

Ração é compra de todo mês: quem acompanha as promoções compra quando o preço cai e não quando o saco acaba.

## Como saber se a ração está barata: o preço do quilo

Sacos de tamanhos diferentes enganam. Compare **quanto custa cada quilo**:

**preço ÷ quilos do saco = preço por kg**

Exemplo: um saco de 15 kg por R$ 210 sai a **R$ 14 por kg**. O de 3 kg da mesma ração por R$ 60 sai a R$ 20 por kg. Compare sempre **a mesma linha** da marca: filhote, adulto, castrado e sênior são rações diferentes.

## Saco grande vale a pena?

- **Sim, se o pet come tudo antes da validade** e você guarda a ração **fechada**, em pote com tampa, longe do calor e da umidade.
- **Não, se a ração vai ficar aberta por meses**: perde o cheiro e o pet pode recusar.

## Trocar de ração

Trocar de uma vez pode dar diarreia ou vômito. O mais comum é fazer a troca **aos poucos, em cerca de uma semana**, misturando a nova à antiga. Pet com doença ou dieta especial: só com orientação do veterinário.

## Antipulgas e areia

- **Antipulgas**: compre pela **faixa de peso** do animal escrita na caixa. **Nunca use antipulgas de cachorro em gato**: alguns são tóxicos para gatos.
- **Areia de gato**: compare pelo preço do quilo e pelo tipo (argila, sílica ou biodegradável).

## É confiável?

A compra acontece **no site ou aplicativo oficial da loja**: o grupo só envia o link e nunca cobra nada. Os links são de afiliado: o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Veja todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao) e os achadinhos de todas as lojas no [grupo de ofertas do Cuponito](/grupo-whatsapp).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Tem grupo de promoção de pet no WhatsApp?', 'answer', 'Sim. O Promo Pet, do Cuponito, é um grupo de WhatsApp grátis com promoções de ração para cachorro e gato, areia, antipulgas e petiscos, com o link da loja oficial. Só os administradores postam.'),
    jsonb_build_object('question', 'Como saber se a ração em promoção está barata?', 'answer', 'Divida o preço pelos quilos do saco. Um saco de 15 kg por R$ 210 sai a R$ 14 por kg. Compare sempre a mesma linha da marca: filhote, adulto, castrado ou sênior.'),
    jsonb_build_object('question', 'Saco grande de ração vale a pena?', 'answer', 'Vale se o pet come tudo antes da validade e a ração fica guardada fechada, em pote com tampa. Aberta por meses, ela perde o cheiro e o pet pode recusar.'),
    jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Pet é grátis e só os administradores postam.')
  ),
  'https://linkdivulgador.com.br/g/262/promo-pet',
  'Promo Pet',
  'ração para cachorro e gato, areia, antipulgas e petiscos',
  NULL,
  'offers',
  NULL,
  84,
  true,
  'Pet'
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

-- 3) /ofertas/pneu passa a levar ao Promo Auto e Moto (antes: grupo geral) -------------------------------

UPDATE public.whatsapp_group_pages
SET join_url   = 'https://linkdivulgador.com.br/g/262/promo-auto-e-moto',
    group_name = 'Promo Auto e Moto',
    topics     = 'acessórios para carro e moto, aspiradores, capacetes e pneus',
    intro      = 'Esta página reúne as promoções de pneu que saíram no Promo Auto e Moto, o grupo de WhatsApp do Cuponito de carro e moto, sempre com o preço do momento e o link da loja oficial. O grupo é grátis e só os administradores postam.',
    content    = replace(
      content,
      'As promoções de pneu saem nos grupos do Cuponito, com o link da loja oficial. Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).',
      'As promoções de pneu saem no **Promo Auto e Moto**, com o link da loja oficial, junto com [acessórios para carro](/ofertas/acessorios-para-carro) e [capacetes](/ofertas/capacete). Veja também todos os grupos em [grupos de promoção do Cuponito](/grupos-de-promocao).'
    ),
    faq = (
      SELECT jsonb_agg(
               CASE WHEN item->>'question' = 'O grupo é pago?'
                    THEN jsonb_build_object('question', 'O grupo é pago?', 'answer', 'Não. O Promo Auto e Moto é grátis e só os administradores postam.')
                    ELSE item END)
      FROM jsonb_array_elements(faq) AS item
    ),
    updated_at = now()
WHERE slug = 'pneu'
  AND jsonb_typeof(faq) = 'array'
  AND (join_url IS NULL OR join_url NOT LIKE '%promo-auto-e-moto%');

-- 4) Links internos: grupo geral (lista por assunto) e diretório ---------------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.',
      '- **Perfumes**: [Promo Perfumes](/ofertas/perfume), importados e nacionais.
- **Carro e moto**: [Promo Auto e Moto](/ofertas/acessorios-para-carro), também [capacetes](/ofertas/capacete) e [pneus](/ofertas/pneu).
- **Pet**: [Promo Pet](/ofertas/racao), ração, areia e antipulgas.'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/ofertas/racao%';

UPDATE public.whatsapp_group_pages
SET faq = (
      SELECT jsonb_agg(
               CASE
                 WHEN item->>'question' = 'Quais são os grupos de promoção do Cuponito no WhatsApp?'
                  AND item->>'answer' NOT LIKE '%Promo Pet%'
                 THEN jsonb_set(item, '{answer}', to_jsonb(replace(
                        item->>'answer',
                        'Promo Festas',
                        'Promo Festas, Promo Auto e Moto (acessórios, capacetes e pneus), Promo Pet (ração e produtos para pet)')))
                 ELSE item
               END)
      FROM jsonb_array_elements(faq) AS item
    ),
    updated_at = now()
WHERE slug = 'grupos-de-promocao'
  AND jsonb_typeof(faq) = 'array'
  AND faq::text NOT LIKE '%Promo Pet%';
