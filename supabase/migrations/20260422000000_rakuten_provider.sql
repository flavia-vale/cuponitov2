-- Registra o provider Rakuten Advertising (LinkShare) na plataforma de integrações.
-- Após aplicar esta migration, crie uma conta em affiliate_accounts via AdminIntegrationsTab
-- com provider_id = id desta linha, publisher_id = seu SID, api_token = Web Service Token.
-- Opcional: extra_config = { "sid": "<SID>", "network_id": "0", "env_secret": "RAKUTEN_TOKEN" }

INSERT INTO integration_providers (name, slug, base_url, active)
VALUES (
  'Rakuten Advertising',
  'rakuten',
  'https://api.linksynergy.com/coupon/1.0',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name     = EXCLUDED.name,
  base_url = EXCLUDED.base_url,
  active   = EXCLUDED.active;
