-- Diretório /grupos-de-promocao: todos os grupos do Cuponito por assunto
-- (docs/plano-black-november-2026-10-30.md, seção 14).
--
-- Dados que guiaram o texto (Planejador, Brasil, out/2025 a set/2026, enviados em 31/10):
--   "grupos de promoção whatsapp", "grupos de promoção", "grupo de promoções whatsapp",
--   "grupos de ofertas whatsapp", "grupos de promoções whatsapp": 1–10 mil cada
--   "melhores grupos de promoções whatsapp", "grupo de promoção no whatsapp": 100–1 mil (+900% no ano)
--   "grupos de achadinhos whatsapp", "grupos de desconto whatsapp", "grupo de promoção telegram",
--   "melhores grupos de promoções telegram": 100–1 mil
--   "grupo de whatsapp" (genérico): 100 mil–1 milhão, dominado por adulto/"vazados" → fora do escopo
-- Autocompletar (31/10): "grupos de promoção de" celular, mercado livre, peças de pc, shopee,
--   perfumes, tenis, fraldas; "grupos de promoção telegram".
-- Search Console (3 meses, consulta contém "grupos"): nenhuma impressão do Cuponito.
-- ChatGPT (31/10), critérios que diz usar para recomendar grupo: origem identificável, link
--   oficial publicado no site do responsável, sem Pix/senha/código, ofertas conferíveis,
--   transparência sobre afiliados, atividade recente. Cita páginas de marcas com os grupos
--   separados por categoria (TecMundo, Promo no Alvo, Ninja das Ofertas).
--
-- Fase 1: só os grupos do Cuponito. Grupos de outros administradores ficam para a fase 2.

-- 1) Coluna da seção --------------------------------------------------------------------

ALTER TABLE public.whatsapp_group_pages
  ADD COLUMN IF NOT EXISTS directory_section TEXT;

COMMENT ON COLUMN public.whatsapp_group_pages.directory_section IS
  'Assunto em que o grupo aparece no diretório /grupos-de-promocao ("Celulares, TV e games"). Vazio = fora do diretório. A ordem segue o sort_order.';

-- 2) Cada grupo no seu assunto (só se ainda não tiver seção: o painel manda) -------------

UPDATE public.whatsapp_group_pages AS p
SET directory_section = v.section, updated_at = now()
FROM (VALUES
  ('principal', 'Achadinhos e ofertas de tudo'),
  ('celular',   'Celulares, TV e games'),
  ('pc-gamer',  'Celulares, TV e games'),
  ('tv',        'Celulares, TV e games'),
  ('iphone',    'Celulares, TV e games'),
  ('tenis',     'Moda e esporte'),
  ('whey',      'Saúde e beleza'),
  ('perfume',   'Saúde e beleza'),
  ('manicure',  'Saúde e beleza'),
  ('fraldas',   'Bebês e festas'),
  ('festas',    'Bebês e festas')
) AS v(slug, section)
WHERE p.slug = v.slug
  AND p.directory_section IS NULL;

-- 3) A página do diretório -------------------------------------------------------------

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, join_url,
   group_name, topics, offer_volume, page_type, offer_terms, sort_order, is_published)
VALUES (
  'grupos-de-promocao',
  NULL,
  'Grupos de Promoção no WhatsApp e Telegram (2026) | Cuponito',
  'Grupos de promoção no WhatsApp e Telegram',
  'Os grupos de promoção do Cuponito por assunto: celular, PC, TV, tênis, perfume, whey, bebês e achadinhos. Grátis, só os admins postam, link da loja oficial.',
  'Estes são os grupos de promoção e de ofertas do Cuponito no WhatsApp e no Telegram, separados por assunto. Todos são grátis, só os administradores postam e cada oferta vem com o preço do momento e o link da loja oficial. Escolha o grupo do que você quer comprar: assim chegam só as ofertas que interessam.',
  $md$
## Como escolhemos os grupos desta página

Hoje esta página lista os grupos mantidos pelo Cuponito. Todos seguem as mesmas regras, que são as que vale conferir em qualquer grupo de promoção:

1. **Origem identificável**: os grupos são do Cuponito, mantido por Flávia Vale, que trabalha com grupos de ofertas desde 2023 no Espelha Grupos.
2. **Link oficial publicado aqui**: o botão de cada grupo sai desta página, do próprio site, e não de um link solto em rede social.
3. **Só os administradores postam**: sem conversa, sem spam e sem desconhecido mandando mensagem.
4. **Nunca pedem Pix, senha ou código**: grupo de promoção sério não cobra para entrar nem para "liberar" cupom.
5. **Ofertas conferíveis**: cada oferta traz o preço do momento e o link da loja oficial, para você conferir antes de comprar.
6. **Atividade visível**: cada grupo tem uma página no site com as ofertas que saíram hoje.

**Transparência:** os links das ofertas são de afiliado. Quando você compra por eles, o Cuponito pode receber uma comissão da loja, sem custo extra para você.

## Grupo ou canal? WhatsApp ou Telegram?

- **Grupo do WhatsApp**: as ofertas chegam como mensagem, junto das suas conversas. Nos grupos do Cuponito só os administradores postam.
- **Canal**: ninguém vê o seu número. O Promo Tech Nerd também tem canal no Telegram, com as mesmas ofertas.
- **Telegram**: bom para quem quer separar as promoções do WhatsApp do dia a dia.

## Como não cair em golpe em grupo de promoção

- Desconfie de preço muito abaixo do das lojas grandes.
- Confira se o link leva ao site ou aplicativo oficial da loja antes de pagar.
- Nunca informe código recebido por SMS ou WhatsApp.
- Não pague por Pix para pessoa física.

Veja também [como saber se um grupo de ofertas é confiável](/blog/grupo-de-ofertas-whatsapp-e-confiavel) e [como escolher um grupo de ofertas no WhatsApp](/blog/como-escolher-grupo-de-ofertas-whatsapp).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Quais são os grupos de promoção do Cuponito no WhatsApp?', 'answer', 'Promo Celular, Promo iPhone, Promo Tech Nerd (PC e games), Promo TV, Promo Tênis, Promo Perfumes, Promo Fit (whey e suplementos), Promo Salão, Promo Bebês, Promo Festas e o Grupo de Ofertas Fafaciane, de achadinhos de todas as lojas. Todos são grátis e só os administradores postam.'),
    jsonb_build_object('question', 'Como saber se um grupo de promoção é confiável?', 'answer', 'Veja se tem um responsável identificável, se o link de entrada está publicado no site oficial, se só os administradores postam, se nunca pede Pix, senha ou código e se cada oferta leva à loja oficial.'),
    jsonb_build_object('question', 'Tem grupo de promoção no Telegram?', 'answer', 'Sim. O Promo Tech Nerd, de PC, peças, placa de vídeo e games, tem canal no Telegram com as mesmas ofertas do grupo do WhatsApp.'),
    jsonb_build_object('question', 'Os grupos de promoção são pagos?', 'answer', 'Não. Os grupos do Cuponito são grátis. O Cuponito ganha comissão de afiliado quando você compra pelos links das ofertas, sem custo extra para você.'),
    jsonb_build_object('question', 'Grupo de ofertas e grupo de promoção são a mesma coisa?', 'answer', 'Sim. Os dois nomes são usados para grupos que enviam ofertas, promoções e cupons de lojas online.'),
    jsonb_build_object('question', 'Posso entrar em mais de um grupo?', 'answer', 'Pode. Cada grupo tem um assunto, então dá para entrar só nos que interessam, por exemplo celular e tênis, sem receber o resto.')
  ),
  NULL,
  NULL,
  NULL,
  NULL,
  'directory',
  NULL,
  5,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  h1               = EXCLUDED.h1,
  meta_description = EXCLUDED.meta_description,
  intro            = EXCLUDED.intro,
  content          = EXCLUDED.content,
  faq              = EXCLUDED.faq,
  page_type        = EXCLUDED.page_type,
  sort_order       = EXCLUDED.sort_order,
  is_published     = EXCLUDED.is_published,
  updated_at       = now();

-- 4) /grupo-whatsapp aponta para o diretório ---------------------------------------------

UPDATE public.whatsapp_group_pages
SET content = replace(
      content,
      '- **De tudo um pouco**: este grupo, com cerca de 200 ofertas por dia.',
      '- **De tudo um pouco**: este grupo, com cerca de 200 ofertas por dia.

Todos os grupos, com o que chega em cada um: [grupos de promoção do Cuponito](/grupos-de-promocao).'
    ),
    updated_at = now()
WHERE slug = 'principal'
  AND content NOT LIKE '%/grupos-de-promocao%';
