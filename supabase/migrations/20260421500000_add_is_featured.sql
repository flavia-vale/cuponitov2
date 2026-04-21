-- Adiciona flag de destaque para cupons e lojas
-- Controla quais aparecem nas seções da home page (editável pelo admin)
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.stores  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
