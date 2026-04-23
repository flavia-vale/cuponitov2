-- posts table (simpler blog schema with inline author/category and JSONB banners)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  cover_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  images_json JSONB NOT NULL DEFAULT '[]',
  related_post_ids UUID[] NOT NULL DEFAULT '{}',
  author TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Blog admins can insert posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );

CREATE POLICY "Blog admins can update posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );

CREATE POLICY "Blog admins can delete posts"
  ON public.posts FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );

-- Storage bucket for blog assets (covers + banners)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog files are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');

CREATE POLICY "Blog admins can upload blog files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'blog' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );

CREATE POLICY "Blog admins can update blog files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'blog' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );

CREATE POLICY "Blog admins can delete blog files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'blog' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('blog_admin', 'super_admin')
  );
