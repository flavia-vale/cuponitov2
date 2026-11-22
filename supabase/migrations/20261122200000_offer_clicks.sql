-- Cliques em "Ver oferta" nas listas "Saiu no grupo" (docs/plano-leads-que-compram-2026-11-22.md, 1.2).
--
-- Quem clica numa oferta do site é o lead mais quente (já quer comprar), e esse clique ia
-- direto para a loja, sem medida. Agora passa pelo /ir?u=<link> (middleware.ts), que só
-- redireciona para oferta que saiu num grupo (arquivo group_offers ou feed ao vivo) e grava
-- uma linha aqui. Aba "Cliques em cupom" do painel, parte "Cliques em oferta".
--
-- Sem IP, sem link e sem identificador de pessoa: loja, grupo, botão, página, aparelho e o
-- domínio de onde a pessoa chegou (cookie cpn_src). Escrita: qualquer um (chave pública),
-- com limite de tamanho. Leitura: só logado no painel.
--
-- Pode rodar antes ou depois do deploy: sem a tabela, o /ir redireciona do mesmo jeito.

CREATE TABLE IF NOT EXISTS public.offer_clicks (
  id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  store       TEXT,
  group_slug  TEXT,
  origin      TEXT,
  page_path   TEXT,
  device      TEXT        NOT NULL DEFAULT 'desktop',
  source      TEXT,
  CONSTRAINT offer_clicks_store_len CHECK (store IS NULL OR char_length(store) <= 60),
  CONSTRAINT offer_clicks_group_format CHECK (group_slug IS NULL OR group_slug ~ '^[a-z0-9_-]{1,60}$'),
  CONSTRAINT offer_clicks_origin_len CHECK (origin IS NULL OR char_length(origin) <= 60),
  CONSTRAINT offer_clicks_path_len CHECK (page_path IS NULL OR char_length(page_path) <= 200),
  CONSTRAINT offer_clicks_device CHECK (device IN ('mobile', 'desktop')),
  CONSTRAINT offer_clicks_source_format CHECK (source IS NULL OR source ~ '^[a-z0-9._-]{1,60}$')
);

COMMENT ON TABLE public.offer_clicks IS
  'Um clique em "Ver oferta" (lista Saiu no grupo), gravado pelo /ir?u= antes de redirecionar à loja. Aba "Cliques em cupom" do admin.';

CREATE INDEX IF NOT EXISTS idx_offer_clicks_created_at ON public.offer_clicks(created_at DESC);

ALTER TABLE public.offer_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "offer_clicks_insert_public" ON public.offer_clicks;
DROP POLICY IF EXISTS "offer_clicks_read_admin" ON public.offer_clicks;

CREATE POLICY "offer_clicks_insert_public"
  ON public.offer_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "offer_clicks_read_admin"
  ON public.offer_clicks FOR SELECT TO authenticated
  USING (true);

GRANT INSERT ON public.offer_clicks TO anon, authenticated;
GRANT SELECT ON public.offer_clicks TO authenticated;

-- O /ir confere o link da oferta no arquivo (group_offers.link): índice para a busca por link.
CREATE INDEX IF NOT EXISTS idx_group_offers_link ON public.group_offers(link);
