-- Cliques no botão "Entrar no grupo" (docs/plano-captacao-grupo-2026-10-18.md, F1).
--
-- O /entrar (middleware.ts) grava uma linha por clique e redireciona para o link
-- do grupo. Sem isso não dá para saber qual página (SEO/GEO) traz gente: o painel
-- do Link Inteligente só conta o total.
--
-- Sem IP e sem identificador de pessoa: só a origem do botão, a página e o tipo de aparelho.
-- Escrita: qualquer um (o navegador do visitante, pela chave pública), com limite de tamanho.
-- Leitura: só quem está logado no painel.

CREATE TABLE IF NOT EXISTS public.group_join_clicks (
  id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  origin      TEXT,
  group_slug  TEXT,
  page_path   TEXT,
  device      TEXT        NOT NULL DEFAULT 'desktop',
  CONSTRAINT group_join_clicks_origin_len CHECK (origin IS NULL OR char_length(origin) <= 60),
  CONSTRAINT group_join_clicks_slug_len CHECK (group_slug IS NULL OR char_length(group_slug) <= 60),
  CONSTRAINT group_join_clicks_path_len CHECK (page_path IS NULL OR char_length(page_path) <= 200),
  CONSTRAINT group_join_clicks_device CHECK (device IN ('mobile', 'desktop'))
);

COMMENT ON TABLE public.group_join_clicks IS
  'Um clique no botão do grupo de ofertas, gravado pelo /entrar antes de redirecionar. Lido na aba Captação do admin.';

CREATE INDEX IF NOT EXISTS idx_group_join_clicks_created_at ON public.group_join_clicks(created_at DESC);

ALTER TABLE public.group_join_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_join_clicks_insert_public" ON public.group_join_clicks;
DROP POLICY IF EXISTS "group_join_clicks_read_admin" ON public.group_join_clicks;

CREATE POLICY "group_join_clicks_insert_public"
  ON public.group_join_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "group_join_clicks_read_admin"
  ON public.group_join_clicks FOR SELECT TO authenticated
  USING (true);

-- O Supabase costuma dar esses acessos sozinho às tabelas do schema public; explícito
-- para não depender disso. A RLS acima é que limita: anônimo só grava, não lê.
GRANT INSERT ON public.group_join_clicks TO anon, authenticated;
GRANT SELECT ON public.group_join_clicks TO authenticated;
