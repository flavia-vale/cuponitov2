-- Cliques no botão do cupom (docs/plano-crescimento-agressivo-2026-11-12.md, prioridade 3).
--
-- Até aqui o clique no cupom só ficava no navegador do visitante (localStorage): não dava
-- para saber qual loja, página ou fonte gera venda de afiliado. O /ir (middleware.ts) grava
-- uma linha por clique e redireciona para o link de afiliado salvo no cupom.
--
-- Sem IP e sem identificador de pessoa: cupom, loja, botão, página, aparelho e o domínio
-- de onde a pessoa chegou ao site (cookie cpn_src, o mesmo da Captação do grupo).
-- Escrita: qualquer um (chave pública), com limite de tamanho. Leitura: só logado no painel.
--
-- Pode rodar antes ou depois do deploy: sem a tabela, o /ir redireciona do mesmo jeito.

CREATE TABLE IF NOT EXISTS public.coupon_clicks (
  id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  coupon_id   UUID        NOT NULL,
  store       TEXT,
  origin      TEXT,
  page_path   TEXT,
  device      TEXT        NOT NULL DEFAULT 'desktop',
  source      TEXT,
  CONSTRAINT coupon_clicks_store_len CHECK (store IS NULL OR char_length(store) <= 120),
  CONSTRAINT coupon_clicks_origin_len CHECK (origin IS NULL OR char_length(origin) <= 60),
  CONSTRAINT coupon_clicks_path_len CHECK (page_path IS NULL OR char_length(page_path) <= 200),
  CONSTRAINT coupon_clicks_device CHECK (device IN ('mobile', 'desktop')),
  CONSTRAINT coupon_clicks_source_format CHECK (source IS NULL OR source ~ '^[a-z0-9._-]{1,60}$')
);

COMMENT ON TABLE public.coupon_clicks IS
  'Um clique no botão de cupom, gravado pelo /ir antes de redirecionar ao link de afiliado. Aba "Cliques em cupom" do admin.';

CREATE INDEX IF NOT EXISTS idx_coupon_clicks_created_at ON public.coupon_clicks(created_at DESC);

ALTER TABLE public.coupon_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupon_clicks_insert_public" ON public.coupon_clicks;
DROP POLICY IF EXISTS "coupon_clicks_read_admin" ON public.coupon_clicks;

CREATE POLICY "coupon_clicks_insert_public"
  ON public.coupon_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "coupon_clicks_read_admin"
  ON public.coupon_clicks FOR SELECT TO authenticated
  USING (true);

GRANT INSERT ON public.coupon_clicks TO anon, authenticated;
GRANT SELECT ON public.coupon_clicks TO authenticated;
