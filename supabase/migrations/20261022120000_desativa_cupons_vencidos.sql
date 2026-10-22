-- Cupons vencidos saem do site (docs/diagnostico-funil-grupo-2026-10-22.md).
--
-- Em 22/10/2026: 16.626 cupons com status = true, 16.419 deles com `expiry` no
-- passado. O job 'expire-coupons-daily' foi desligado em 05/05 (a versão antiga
-- da Edge Function apagava cupons) e nunca voltou. As páginas listavam milhares
-- de cupons vencidos — só a KaBuM tinha ~14 mil — e o botão do grupo ficava
-- no fim de uma lista enorme.
--
-- Desativa (status = false), não apaga: dá para reverter, e o histórico continua
-- para o painel. O site já filtra o vencido na leitura (src/lib/couponValidity.ts);
-- isto limpa o banco e mantém limpo.
--
-- O job novo é SQL puro: não depende de qual versão da Edge Function está no ar.

UPDATE public.coupons
SET status = false
WHERE status = true
  AND expiry IS NOT NULL
  AND expiry < now();

SELECT cron.unschedule('expire-coupons-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-coupons-daily');

SELECT cron.unschedule('deactivate-expired-coupons')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'deactivate-expired-coupons');

-- Todo dia às 03:10 de Brasília (06:10 UTC).
SELECT cron.schedule(
  'deactivate-expired-coupons',
  '10 6 * * *',
  $$
  UPDATE public.coupons
  SET status = false
  WHERE status = true
    AND expiry IS NOT NULL
    AND expiry < now();
  $$
);
