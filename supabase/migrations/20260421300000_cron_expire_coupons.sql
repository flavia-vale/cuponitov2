-- Cron diário: desativa cupons com validade vencida
-- Roda todo dia às 03:00 horário de Brasília (06:00 UTC)
SELECT cron.unschedule('expire-coupons-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-coupons-daily');

SELECT cron.schedule(
  'expire-coupons-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url    := current_setting('app.supabase_url') || '/functions/v1/expire-coupons',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body   := '{}'::jsonb
  );
  $$
);
