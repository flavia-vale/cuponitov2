-- Fonte da visita no clique do botão do grupo (docs/plano-leads-quentes-2026-11-10.md, frente A).
--
-- Em 03 a 09/11 o botão teve 362 cliques, e o Google mandou só ~2 visitas por dia: a maior
-- parte dos leads chega por fora do Google, e não sabíamos por onde.
-- O script do index.html guarda no cookie `cpn_src` só o domínio de onde a pessoa chegou
-- (ou o utm_source do link, ex.: chatgpt.com). O /entrar grava aqui junto com o clique.
-- Sem URL completa, sem IP, sem identificador de pessoa.
-- Vazio = o JavaScript da página não rodou (robô que se passa por navegador).
--
-- Pode rodar antes ou depois do deploy: sem a coluna, o /entrar grava o clique sem a fonte.

ALTER TABLE public.group_join_clicks
  ADD COLUMN IF NOT EXISTS source TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'group_join_clicks_source_format'
  ) THEN
    ALTER TABLE public.group_join_clicks
      ADD CONSTRAINT group_join_clicks_source_format
      CHECK (source IS NULL OR source ~ '^[a-z0-9._-]{1,60}$');
  END IF;
END $$;

COMMENT ON COLUMN public.group_join_clicks.source IS
  'Domínio de onde o visitante chegou ao site ou utm_source (cookie cpn_src); "direto" sem origem; NULL = JavaScript não rodou. Aba Captação → Por fonte.';
