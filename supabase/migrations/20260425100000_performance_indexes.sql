-- Performance indexes for coupons table
-- The most frequent query is: status=true ORDER BY is_flash DESC, updated_at DESC
CREATE INDEX IF NOT EXISTS idx_coupons_status_flash_updated
  ON public.coupons(status, is_flash DESC, updated_at DESC);

-- Used by category filtering on home/category pages
CREATE INDEX IF NOT EXISTS idx_coupons_category
  ON public.coupons(category)
  WHERE status = true;

-- Used by store page filtering
CREATE INDEX IF NOT EXISTS idx_coupons_store
  ON public.coupons(store)
  WHERE status = true;

-- CORRIGIDO: Removido o comparison com string vazia
-- Used by expiry filtering (exclude expired)
CREATE INDEX IF NOT EXISTS idx_coupons_expiry
  ON public.coupons(expiry)
  WHERE status = true AND expiry IS NOT NULL;

-- Covering index for the main home page coupon list query
CREATE INDEX IF NOT EXISTS idx_stores_featured
  ON public.stores(is_featured)
  WHERE is_featured = true;