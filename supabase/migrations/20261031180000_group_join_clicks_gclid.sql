-- Medição do Google Ads (docs/plano-black-november-2026-10-30.md, seção 11).
--
-- O anúncio leva `?gclid=...` à página do grupo; o botão repassa ao /entrar, que grava
-- aqui junto com o clique. A aba Captação exporta esses cliques no modelo de conversões
-- offline do Google Ads (Google Click ID). Só cliques vindos de anúncio têm gclid.
--
-- Pode rodar antes ou depois do deploy: sem a coluna, o /entrar grava o clique sem o gclid.

ALTER TABLE public.group_join_clicks
  ADD COLUMN IF NOT EXISTS gclid TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'group_join_clicks_gclid_format'
  ) THEN
    ALTER TABLE public.group_join_clicks
      ADD CONSTRAINT group_join_clicks_gclid_format
      CHECK (gclid IS NULL OR gclid ~ '^[A-Za-z0-9_-]{10,200}$');
  END IF;
END $$;

COMMENT ON COLUMN public.group_join_clicks.gclid IS
  'Identificador do clique no anúncio do Google (gclid), quando o visitante veio de anúncio. Exportado na aba Captação como conversão offline.';
