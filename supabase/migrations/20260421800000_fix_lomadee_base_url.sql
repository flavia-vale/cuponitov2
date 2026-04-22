-- Corrige URL da API Lomadee: domínio correto é .com.br, não .com
UPDATE public.integration_providers
SET base_url = 'https://api.lomadee.com.br/v3'
WHERE slug = 'lomadee'
  AND base_url = 'https://api.lomadee.com/v3';
