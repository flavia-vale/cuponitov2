-- Add images_json column to blog_posts for banner tracking
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS images_json JSONB DEFAULT '[]'::jsonb;

-- Banner clicks tracking table
CREATE TABLE IF NOT EXISTS public.banner_clicks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  banner_url TEXT NOT NULL,
  link_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS banner_clicks_post_id_idx ON public.banner_clicks(post_id);
CREATE INDEX IF NOT EXISTS banner_clicks_created_at_idx ON public.banner_clicks(created_at);

-- RLS
ALTER TABLE public.banner_clicks ENABLE ROW LEVEL SECURITY;

-- 1. Limpa as políticas se elas já existirem para evitar erro SQLSTATE 42710
DROP POLICY IF EXISTS "public_insert_banner_clicks" ON public.banner_clicks;
DROP POLICY IF EXISTS "admin_select_banner_clicks" ON public.banner_clicks;

-- 2. Criação da política de INSERT (Público)
-- Any visitor can log a click (fire-and-forget tracking)
CREATE POLICY "public_insert_banner_clicks"
  ON public.banner_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Criação da política de SELECT (Admin)
-- Only blog_admin / super_admin can read analytics
CREATE POLICY "admin_select_banner_clicks"
  ON public.banner_clicks FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_role') IN ('blog_admin', 'super_admin')
  );