-- Adiciona Lomadee como provider de afiliados
INSERT INTO public.integration_providers (name, slug, base_url, auth_type, notes)
VALUES (
  'Lomadee',
  'lomadee',
  'https://api.lomadee.com/v3',
  'token',
  'Rede de afiliados Lomadee — usa sourceId (publisher_id) + appToken'
)
ON CONFLICT (slug) DO NOTHING;

-- Conta Lomadee (sourceId 2324685, token via secret LOMADEE_APP_TOKEN)
INSERT INTO public.affiliate_accounts (name, publisher_id, api_token, active, extra_config, provider_id)
SELECT
  'Lomadee',
  '2324685',
  '',
  true,
  '{"env_secret": "LOMADEE_APP_TOKEN"}'::jsonb,
  p.id
FROM public.integration_providers p
WHERE p.slug = 'lomadee'
ON CONFLICT DO NOTHING;

-- Agendamento padrão: a cada 6 horas
INSERT INTO public.sync_schedules (account_id, interval_hours, enabled, next_run_at)
SELECT
  a.id,
  6,
  true,
  now()
FROM public.affiliate_accounts a
JOIN public.integration_providers p ON p.id = a.provider_id
WHERE p.slug = 'lomadee'
  AND NOT EXISTS (
    SELECT 1 FROM public.sync_schedules s WHERE s.account_id = a.id
  );
