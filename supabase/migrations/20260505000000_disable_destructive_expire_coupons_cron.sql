-- Stop the legacy daily job that called the destructive expire-coupons function.
-- Re-enable only after the non-destructive Edge Function version is deployed.
SELECT cron.unschedule('expire-coupons-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-coupons-daily');
