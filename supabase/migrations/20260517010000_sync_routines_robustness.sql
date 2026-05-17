-- ============================================================
-- Robustez das rotinas de sync + correção do Lomadee
--
-- Problemas corrigidos:
--   1) Contas criadas via AdminIntegrationsTab não recebiam um
--      sync_schedule automaticamente, então o cron-dispatcher nunca
--      as enxergava. Solução: trigger AFTER INSERT que cria o
--      schedule padrão (6h), + backfill para contas órfãs existentes.
--   2) integration_providers.base_url do Lomadee apontava para a
--      API v3 antiga, mas o código usa api-beta.lomadee.com.br.
--      Alinhamos a base_url para a URL real (e o código passa a
--      lê-la do DB — ver api/sync-lomadee.ts).
--   3) sync_schedules.interval_hours sem validação. Adicionamos
--      CHECK (interval_hours > 0) para evitar loops/dispatch quebrado.
-- ============================================================

-- 1. Trigger para auto-criar sync_schedule ao inserir affiliate_account
CREATE OR REPLACE FUNCTION public.ensure_sync_schedule_for_account()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.sync_schedules (account_id, interval_hours, enabled, next_run_at)
  VALUES (NEW.id, 6, true, now())
  ON CONFLICT (account_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_affiliate_accounts_ensure_schedule ON public.affiliate_accounts;
CREATE TRIGGER trg_affiliate_accounts_ensure_schedule
  AFTER INSERT ON public.affiliate_accounts
  FOR EACH ROW EXECUTE FUNCTION public.ensure_sync_schedule_for_account();

-- 2. Backfill: cria schedule para qualquer conta existente sem um
INSERT INTO public.sync_schedules (account_id, interval_hours, enabled, next_run_at)
SELECT a.id, 6, true, now()
FROM public.affiliate_accounts a
WHERE NOT EXISTS (
  SELECT 1 FROM public.sync_schedules s WHERE s.account_id = a.id
)
ON CONFLICT (account_id) DO NOTHING;

-- 3. Alinhar base_url do Lomadee com a URL realmente usada pelo código
UPDATE public.integration_providers
SET base_url = 'https://api-beta.lomadee.com.br',
    notes    = 'Rede de afiliados Lomadee — usa x-api-key + LOMADEE_APP_TOKEN. API beta (2024+).'
WHERE slug = 'lomadee'
  AND base_url <> 'https://api-beta.lomadee.com.br';

-- 4. CHECK em interval_hours para impedir valores inválidos
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sync_schedules_interval_positive'
  ) THEN
    ALTER TABLE public.sync_schedules
      ADD CONSTRAINT sync_schedules_interval_positive
      CHECK (interval_hours > 0);
  END IF;
END $$;
