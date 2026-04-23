-- Salva as credenciais Rakuten diretamente no banco.
-- O sync usa api_token como prioridade, com fallback para o Supabase Secret RAKUTEN_TOKEN.
UPDATE public.affiliate_accounts
SET
  api_token    = 'ae98474a25b9c06b7bd40e4e1a27c363138dcce6854075e2a8eabcba75304936',
  extra_config = extra_config || '{"security_token": "5c5784dd229f54ce8f23698b7f53fe3ca57be2924e28adb9451df99065e67508"}'::jsonb
WHERE provider_id = (SELECT id FROM public.integration_providers WHERE slug = 'rakuten')
  AND active = true;
