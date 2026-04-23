-- Salva o api_token da conta Lomadee diretamente no banco.
-- O sync usa api_token como prioridade, com fallback para o Supabase Secret LOMADEE_APP_TOKEN.
UPDATE public.affiliate_accounts
SET api_token = 'T9fn2UeRzXeFtGBB0PMbkj05Xk9XCMZJ'
WHERE id = '6ff2699e-ceaa-4fad-a58a-8b91f885485f';
