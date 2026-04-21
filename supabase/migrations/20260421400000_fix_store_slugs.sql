-- Corrige slugs de lojas criadas pelo Awin para o padrão cupom-desconto-*
UPDATE stores
SET slug = 'cupom-desconto-' || slug
WHERE awin_advertiser_id IS NOT NULL
  AND slug NOT LIKE 'cupom-desconto-%';
