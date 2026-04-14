
-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  discount TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  expiry TEXT NOT NULL DEFAULT '',
  is_flash BOOLEAN NOT NULL DEFAULT false,
  status BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT '',
  success_rate INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON public.coupons FOR SELECT
  USING (status = true);

CREATE POLICY "Authenticated users can insert coupons"
  ON public.coupons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update coupons"
  ON public.coupons FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete coupons"
  ON public.coupons FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all coupons"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  brand_color TEXT NOT NULL DEFAULT '#575ecf',
  fallback_color TEXT NOT NULL DEFAULT '#575ecf',
  icon_emoji TEXT NOT NULL DEFAULT '🏷️',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert stores" ON public.stores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update stores" ON public.stores FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete stores" ON public.stores FOR DELETE TO authenticated USING (true);

INSERT INTO public.stores (slug, display_name, brand_color, fallback_color, icon_emoji) VALUES
  ('mercado_livre', 'Mercado Livre', '#ffd400', '#575ecf', '🤝'),
  ('shopee', 'Shopee', '#fe7b02', '#575ecf', '🛍️'),
  ('amazon', 'Amazon', '#ff9900', '#575ecf', '🛒');

-- Blog post status enum
CREATE TYPE public.blog_post_status AS ENUM ('draft', 'published', 'scheduled');

-- Blog authors
CREATE TABLE public.blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blog authors" ON public.blog_authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can insert blog authors" ON public.blog_authors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog authors" ON public.blog_authors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog authors" ON public.blog_authors FOR DELETE TO authenticated USING (true);

-- Blog categories
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color_hex TEXT NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blog categories" ON public.blog_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can insert blog categories" ON public.blog_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog categories" ON public.blog_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog categories" ON public.blog_categories FOR DELETE TO authenticated USING (true);

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  status public.blog_post_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  cta_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_blog_views(post_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blog_posts SET views_count = views_count + 1 WHERE id = post_id;
$$;

-- Storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');
