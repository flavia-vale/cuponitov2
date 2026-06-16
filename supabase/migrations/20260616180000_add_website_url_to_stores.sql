ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS website_url TEXT;
