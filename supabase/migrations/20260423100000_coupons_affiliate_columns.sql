-- Adiciona colunas extras à tabela coupons usadas pelas integrações
-- de afiliados (Awin, Rakuten, Lomadee). Todas com IF NOT EXISTS para
-- ser idempotente em ambientes onde já foram aplicadas manualmente.

ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS awin_promotion_id  TEXT,
  ADD COLUMN IF NOT EXISTS store_id           UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS publisher_id       TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS expiry_text        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS start_date         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS type               TEXT NOT NULL DEFAULT 'deal',
  ADD COLUMN IF NOT EXISTS terms              TEXT NOT NULL DEFAULT '';

-- Índice único para deduplicação de cupons por ID de promoção do afiliado
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'coupons' AND indexname = 'coupons_awin_promotion_id_key'
  ) THEN
    CREATE UNIQUE INDEX coupons_awin_promotion_id_key
      ON public.coupons (awin_promotion_id)
      WHERE awin_promotion_id IS NOT NULL;
  END IF;
END $$;
