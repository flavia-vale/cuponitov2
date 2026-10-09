-- Páginas do grupo de ofertas no WhatsApp (/grupo-whatsapp e /grupo-whatsapp/:slug).
--
-- Por que existe: quem busca "grupo de ofertas whatsapp", "grupo de promoções
-- whatsapp" (1 mil–10 mil/mês cada) ou "grupo de achadinhos da shopee" (100–1 mil)
-- encontra, no Google e na Visão geral de IA, sempre o mesmo formato: uma página
-- "/grupo-whatsapp" dentro de um site de cupons (Pechinchou, Promobit, Pelando).
-- Dados e plano: wabot/docs/marketing/PLANO_LEADS_GRUPO_OFERTAS_2026-10-09.md.
--
-- A linha com slug = 'principal' é servida em /grupo-whatsapp (sem sufixo).
-- `join_url` NULL = usa o link global (site_settings.global_links.whatsapp_group),
-- para nenhuma página nascer com botão quebrado antes do Link Inteligente existir.

CREATE TABLE IF NOT EXISTS public.whatsapp_group_pages (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,
  store_slug       TEXT,
  title            TEXT        NOT NULL,
  h1               TEXT        NOT NULL,
  meta_description TEXT        NOT NULL,
  intro            TEXT        NOT NULL,
  content          TEXT        NOT NULL DEFAULT '',
  faq              JSONB       NOT NULL DEFAULT '[]'::jsonb,
  join_url         TEXT,
  is_published     BOOLEAN     NOT NULL DEFAULT true,
  sort_order       INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_group_pages_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT whatsapp_group_pages_faq_is_array CHECK (jsonb_typeof(faq) = 'array')
);

COMMENT ON TABLE public.whatsapp_group_pages IS
  'Páginas públicas do grupo de ofertas no WhatsApp. slug=principal → /grupo-whatsapp; demais → /grupo-whatsapp/<slug>.';
COMMENT ON COLUMN public.whatsapp_group_pages.store_slug IS
  'stores.slug da loja ligada a esta página: o botão da página da loja aponta para cá.';
COMMENT ON COLUMN public.whatsapp_group_pages.join_url IS
  'Link do botão "Entrar no grupo" (Link Inteligente do Espelha Grupos). NULL = link global do site.';
COMMENT ON COLUMN public.whatsapp_group_pages.faq IS
  'Perguntas frequentes: array de {"question": "...", "answer": "..."}. Sai em FAQPage no HTML do servidor.';

ALTER TABLE public.whatsapp_group_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_group_pages_read_public" ON public.whatsapp_group_pages;
DROP POLICY IF EXISTS "whatsapp_group_pages_write_admin" ON public.whatsapp_group_pages;

CREATE POLICY "whatsapp_group_pages_read_public"
  ON public.whatsapp_group_pages FOR SELECT
  USING (true);

CREATE POLICY "whatsapp_group_pages_write_admin"
  ON public.whatsapp_group_pages FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_whatsapp_group_pages_store_slug ON public.whatsapp_group_pages(store_slug);

-- Fatos do grupo, comuns a todas as páginas (editáveis na aba "Grupo WhatsApp").
INSERT INTO public.site_settings (key, value, description)
VALUES (
  'whatsapp_group_info',
  jsonb_build_object(
    'group_name', 'Grupo de Ofertas Fafaciane',
    'offers_per_day', 'cerca de 200',
    'stores', 'Shopee, Mercado Livre, Amazon, Magalu e Shein',
    'admins_only', true,
    'channel_url', ''
  ),
  'Fatos do grupo de ofertas exibidos nas páginas /grupo-whatsapp.'
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.whatsapp_group_pages
  (slug, store_slug, title, h1, meta_description, intro, content, faq, sort_order)
VALUES
(
  'principal',
  NULL,
  'Grupo de Ofertas no WhatsApp grátis | Cuponito',
  'Grupo de ofertas no WhatsApp do Cuponito',
  'Entre grátis no grupo de ofertas do Cuponito: cerca de 200 ofertas por dia de Shopee, Mercado Livre, Amazon, Magalu e Shein. Só os admins postam.',
  'O Grupo de Ofertas Fafaciane é o grupo de WhatsApp do Cuponito: é gratuito, só os administradores postam e chegam cerca de 200 ofertas por dia de Shopee, Mercado Livre, Amazon, Magalu e Shein, sempre com o link da loja oficial.',
  $md$
## O que chega no grupo

- **Ofertas e achadinhos** de Shopee, Mercado Livre, Amazon, Magalu e Shein, com o preço da oferta e o link da loja.
- **Cupons de desconto** e cupons de frete grátis assim que aparecem.
- **Ofertas relâmpago**, que costumam acabar em minutos.

São cerca de 200 ofertas por dia. A dica de quem está no grupo: **silencie as notificações** e abra o grupo quando quiser procurar alguma coisa.

## Como entrar

1. Toque no botão **Entrar no grupo**.
2. O WhatsApp abre o convite. Toque em **Entrar no grupo** de novo.
3. Pronto: as próximas ofertas já chegam para você. Para sair, é só sair do grupo, como em qualquer grupo.

## Grupo ou canal?

O grupo é **silencioso**: só os administradores postam, então não tem conversa, corrente nem spam de outros membros. Quem prefere que o próprio número não apareça para ninguém pode seguir o **canal do WhatsApp**, que recebe as mesmas ofertas.

## O grupo de ofertas é confiável?

A compra sempre acontece **no site ou no aplicativo oficial da loja**. O grupo só envia o link da oferta. Para comprar com segurança em qualquer grupo de ofertas:

- **Nunca** pague por Pix para uma pessoa física nem para "liberar" cupom. Grupo de ofertas sério não cobra nada.
- **Nunca** informe senha ou código recebido por SMS.
- Confira o **preço final com frete** e a validade do cupom no carrinho antes de pagar: oferta relâmpago muda de preço rápido.

## Quem mantém o grupo

O grupo é mantido pela mesma equipe do Cuponito. Os links das ofertas são links de afiliado: quando você compra por eles, o Cuponito pode receber uma comissão da loja, **sem custo extra para você**.

Procurando um cupom agora? Veja [todos os cupons de hoje](/cupons) ou [as lojas](/lojas).
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'O grupo de ofertas é grátis?', 'answer', 'Sim. Entrar e ficar no grupo é gratuito. O grupo nunca cobra taxa, Pix ou pagamento para enviar ofertas ou cupons.'),
    jsonb_build_object('question', 'Quantas ofertas chegam por dia?', 'answer', 'Cerca de 200 ofertas por dia, de Shopee, Mercado Livre, Amazon, Magalu e Shein. Vale silenciar o grupo e abrir quando quiser.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem no grupo?', 'answer', 'Não. Só os administradores postam. O grupo é só de ofertas, sem conversa entre membros.'),
    jsonb_build_object('question', 'Qual a diferença entre o grupo e o canal?', 'answer', 'Os dois recebem as mesmas ofertas. No canal do WhatsApp o seu número não aparece para ninguém; no grupo, os outros membros podem ver o seu número.'),
    jsonb_build_object('question', 'Tem grupo no Telegram?', 'answer', 'Não. As ofertas saem no grupo e no canal do WhatsApp.'),
    jsonb_build_object('question', 'Posso sair do grupo quando quiser?', 'answer', 'Sim. Basta sair do grupo pelo próprio WhatsApp, como em qualquer grupo.')
  ),
  0
),
(
  'shopee',
  'cupom-desconto-shopee',
  'Grupo de Achadinhos da Shopee no WhatsApp | Cuponito',
  'Grupo de achadinhos e cupons da Shopee no WhatsApp',
  'Achadinhos, cupons de frete grátis e ofertas relâmpago da Shopee no WhatsApp, grátis. Grupo só de ofertas: só os admins postam.',
  'No Grupo de Ofertas Fafaciane chegam achadinhos, cupons e ofertas relâmpago da Shopee todos os dias, junto com ofertas de Mercado Livre, Amazon, Magalu e Shein. É grátis e só os administradores postam.',
  $md$
## O que chega da Shopee

- **Achadinhos**: produtos baratos de casa, beleza, moda e utilidades, com o link da Shopee.
- **Cupons de frete grátis** e **cupons diários** da Shopee.
- **Ofertas relâmpago**, que costumam durar poucos minutos.

O grupo não é só da Shopee: ela é uma das cinco lojas, junto com Mercado Livre, Amazon, Magalu e Shein. São cerca de 200 ofertas por dia no total.

## Como usar um cupom da Shopee que chegou no grupo

1. Toque no link da oferta: ele abre o produto no aplicativo ou no site da Shopee.
2. Resgate o cupom antes de ir para o carrinho (cupons da Shopee costumam ter **valor mínimo** e **quantidade limitada**).
3. No carrinho, confira se o cupom foi aplicado e o **preço final com frete**.

Quer o cupom agora, sem esperar o grupo? Veja os [cupons de desconto da Shopee](/desconto/cupom-desconto-shopee) e o guia [cupom Shopee hoje](/blog/cupom-shopee-hoje).

## É confiável?

A compra acontece **no aplicativo oficial da Shopee**: o grupo só manda o link. Nunca pague por Pix para "liberar" cupom e nunca informe senha ou código de SMS. Os links são de afiliado: o Cuponito pode receber uma comissão da Shopee, sem custo extra para você.

Veja também o [grupo de ofertas do Cuponito](/grupo-whatsapp), com todas as lojas.
$md$,
  jsonb_build_array(
    jsonb_build_object('question', 'Existe grupo de achadinhos da Shopee no WhatsApp?', 'answer', 'Sim. O Grupo de Ofertas Fafaciane, do Cuponito, envia achadinhos, cupons e ofertas relâmpago da Shopee todos os dias, junto com ofertas de outras quatro lojas. É grátis.'),
    jsonb_build_object('question', 'O grupo manda cupom de frete grátis da Shopee?', 'answer', 'Sim, quando a Shopee libera cupons de frete grátis eles são enviados no grupo. Confira o valor mínimo de compra antes de usar.'),
    jsonb_build_object('question', 'O grupo é só da Shopee?', 'answer', 'Não. Ele também envia ofertas de Mercado Livre, Amazon, Magalu e Shein, cerca de 200 por dia no total.'),
    jsonb_build_object('question', 'Os membros podem mandar mensagem?', 'answer', 'Não. Só os administradores postam; o grupo é só de ofertas.')
  ),
  10
)
ON CONFLICT (slug) DO NOTHING;
