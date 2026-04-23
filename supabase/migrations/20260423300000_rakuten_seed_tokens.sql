-- Semeia o par access_token/refresh_token inicial do MID 43984.
-- token_expires_at = epoch → forçar renovação automática na primeira sync
-- (o access_token pode ter expirado desde a emissão).
--
-- IMPORTANTE: o token_key (Authorization: Bearer) deve estar no Supabase Secret
-- RAKUTEN_TOKEN. Esses campos são renovados automaticamente pela edge function
-- sync-rakuten a cada ciclo e nunca precisam ser atualizados manualmente.

UPDATE public.affiliate_accounts
SET extra_config = extra_config || jsonb_build_object(
  'access_token',    'MuUtdYgwGUo7tPsA7UGVEVrume8GXRwh',
  'refresh_token',   '1uibWTvr5WuvJOt79zBWsbVF4WPWdIvN',
  'token_expires_at','1970-01-01T00:00:00.000Z'
)
WHERE publisher_id = '43984'
  AND provider_id = (SELECT id FROM public.integration_providers WHERE slug = 'rakuten' LIMIT 1);
