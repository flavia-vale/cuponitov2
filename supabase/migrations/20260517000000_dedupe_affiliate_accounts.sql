-- ============================================================
-- Deduplicação de affiliate_accounts (Awin - Outras lojas e demais)
-- Problema: existiam múltiplas linhas (até 4) em affiliate_accounts
-- com o mesmo (provider_id, publisher_id), fazendo o sync-dispatcher
-- disparar a sync várias vezes por execução.
-- Solução:
--   1) Manter apenas a linha mais antiga por (provider_id, publisher_id);
--      as demais (e seus sync_schedules via ON DELETE CASCADE) são removidas.
--   2) Adicionar UNIQUE (provider_id, publisher_id) para impedir recorrência.
-- ============================================================

-- 1. Deduplicar: deletar todas as linhas que NÃO são a mais antiga
--    dentro do mesmo (provider_id, publisher_id).
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY provider_id, publisher_id
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.affiliate_accounts
  WHERE publisher_id <> ''
)
DELETE FROM public.affiliate_accounts a
USING ranked r
WHERE a.id = r.id AND r.rn > 1;

-- 2. Garantir constraint única para impedir novas duplicatas.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'affiliate_accounts_provider_publisher_unique'
  ) THEN
    ALTER TABLE public.affiliate_accounts
      ADD CONSTRAINT affiliate_accounts_provider_publisher_unique
      UNIQUE (provider_id, publisher_id);
  END IF;
END $$;

-- 3. Garantir que cada conta tenha no máximo 1 sync_schedule.
--    Mantém o schedule mais antigo (preserva last_run_at/state).
WITH ranked_sched AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY account_id
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.sync_schedules
)
DELETE FROM public.sync_schedules s
USING ranked_sched r
WHERE s.id = r.id AND r.rn > 1;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sync_schedules_account_unique'
  ) THEN
    ALTER TABLE public.sync_schedules
      ADD CONSTRAINT sync_schedules_account_unique
      UNIQUE (account_id);
  END IF;
END $$;
