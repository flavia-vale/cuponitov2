-- Add initial opt-in coupon intelligence sources for Amazon Brasil and Shopee Brasil.
-- Sources stay disabled by default until an admin reviews compliance/robots/terms and enables them.

INSERT INTO public.coupon_sources (
  marketplace_slug,
  name,
  source_type,
  source_url,
  allowed_paths,
  selectors,
  keywords,
  scan_interval_minutes,
  risk_level,
  enabled,
  metadata
) VALUES
  (
    'amazon',
    'Amazon Brasil - página pública de cupons',
    'public_page',
    'https://www.amazon.com.br/coupons',
    ARRAY['/coupons']::TEXT[],
    '{"coupon_card":"[data-testid*=coupon], [class*=coupon], [id*=coupon], [class*=cupom]","title":"h2, h3, [class*=title], [class*=headline]","description":"[class*=description], [class*=subtitle], [class*=terms]"}'::jsonb,
    ARRAY['cupom', 'cupon', 'coupon', 'desconto', 'oferta', 'promoção', 'amazon']::TEXT[],
    60,
    7,
    false,
    '{"compliance_status":"pending_review","notes":"Seed operacional desligado por padrão. Confirmar disponibilidade pública da rota /coupons, termos, robots e elegibilidade antes de habilitar."}'::jsonb
  ),
  (
    'shopee',
    'Shopee Brasil - Cupons Diários',
    'public_page',
    'https://shopee.com.br/m/cupom-de-desconto-v37',
    ARRAY['/m/cupom-de-desconto-v37']::TEXT[],
    '{"coupon_card":"[data-testid*=coupon], [class*=coupon], [class*=voucher], [class*=cupom]","title":"h2, h3, [class*=title], [class*=shop-name]","description":"[class*=description], [class*=subtitle], [class*=voucher], [class*=discount]"}'::jsonb,
    ARRAY['cupom', 'cupon', 'coupon', 'voucher', 'desconto', 'oferta', 'frete grátis', 'shopee']::TEXT[],
    30,
    6,
    false,
    '{"compliance_status":"pending_review","notes":"Seed operacional desligado por padrão. Página pública identificada em resultados indexados; confirmar termos/robots antes de habilitar."}'::jsonb
  )
ON CONFLICT (marketplace_slug, source_url) DO UPDATE SET
  name = EXCLUDED.name,
  allowed_paths = EXCLUDED.allowed_paths,
  selectors = EXCLUDED.selectors,
  keywords = EXCLUDED.keywords,
  scan_interval_minutes = EXCLUDED.scan_interval_minutes,
  risk_level = EXCLUDED.risk_level,
  enabled = false,
  metadata = public.coupon_sources.metadata || EXCLUDED.metadata,
  updated_at = now();
