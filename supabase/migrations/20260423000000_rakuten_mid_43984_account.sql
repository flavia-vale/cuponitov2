-- Cria a conta afiliada Rakuten para o MID 43984.
-- publisher_id = SID (Publisher Site ID) da sua conta Rakuten LinkShare.
-- api_token    = Web Service Token (lido em runtime via RAKUTEN_TOKEN se deixado vazio).
-- extra_config.mid é usado pelo sync-rakuten para filtrar apenas este MID.

INSERT INTO public.affiliate_accounts (
  name,
  publisher_id,
  api_token,
  active,
  extra_config,
  provider_id
)
SELECT
  'Rakuten MID 43984',
  '',                   -- substituir pelo SID real no admin ou via UPDATE abaixo
  '',                   -- deixar vazio: a Vercel Function lê RAKUTEN_TOKEN do env
  true,
  jsonb_build_object(
    'mid',        '43984',
    'env_secret', 'RAKUTEN_TOKEN'
  ),
  p.id
FROM public.integration_providers p
WHERE p.slug = 'rakuten'
  AND NOT EXISTS (
    SELECT 1 FROM public.affiliate_accounts a
    WHERE a.provider_id = p.id
      AND a.extra_config->>'mid' = '43984'
  );
