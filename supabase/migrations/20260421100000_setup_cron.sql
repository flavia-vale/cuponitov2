-- ============================================================
-- CRON: dispara sync-dispatcher a cada hora
-- Usa pg_cron + net extension do Supabase
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remover cron anterior se existir
SELECT cron.unschedule('sync-dispatcher-hourly')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'sync-dispatcher-hourly'
);

-- Agendar: todo início de hora
SELECT cron.schedule(
  'sync-dispatcher-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url    := current_setting('app.supabase_url') || '/functions/v1/sync-dispatcher',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body   := '{}'::jsonb
  );
  $$
);
