-- Adiciona coluna para armazenar metadados específicos de cada rede de afiliados
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS affiliate_metadata JSONB DEFAULT '{}'::jsonb;

-- Garante que o índice de busca por ID de promoção externa exista
CREATE INDEX IF NOT EXISTS idx_coupons_awin_promotion_id ON public.coupons(awin_promotion_id);