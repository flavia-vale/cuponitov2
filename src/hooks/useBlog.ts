import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type BlogPost = Tables<'blog_posts'>;
export type BlogCategory = Tables<'blog_categories'>;
export type BlogAuthor = Tables<'blog_authors'>;

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useBlogAuthors() {
  return useQuery<BlogAuthor[]>({
    queryKey: ['blog-authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useBlogPosts(categorySlug?: string) {
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts', categorySlug ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (categorySlug) {
        const { data: cat } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('slug', categorySlug)
          .maybeSingle();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost | null>({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });
}

export function useRelatedBlogPosts(postId: string, category?: string | null) {
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts-related', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, cover_image, excerpt, published_at, category, content, views_count')
        .eq('status', 'published')
        .neq('id', postId)
        .order('published_at', { ascending: false })
        .limit(2);
      if (error) throw error;
      return data || [];
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIncrementBlogViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: { postId: string; slug: string }) => {
      const { error } = await supabase.rpc('increment_blog_views', { post_id: postId });
      if (error) throw error;
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
    },
  });
}

export interface BannerClickRow {
  id: string;
  post_id: string;
  banner_url: string;
  link_url: string;
  created_at: string;
}

export interface BannerItem {
  banner_url: string;
  link_url: string;
}

export function useLogBannerClick() {
  return useMutation({
    mutationFn: async ({ postId, bannerUrl, linkUrl }: { postId: string; bannerUrl: string; linkUrl: string }) => {
      const { error } = await supabase
        .from('banner_clicks')
        .insert({ post_id: postId, banner_url: bannerUrl, link_url: linkUrl });
      if (error) throw error;
    },
  });
}

export function useBannerStats() {
  return useQuery<BannerClickRow[]>({
    queryKey: ['banner-clicks-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banner_clicks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as BannerClickRow[];
    },
    staleTime: 60 * 1000,
  });
}
