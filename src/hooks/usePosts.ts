import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Post = Tables<'posts'>;

export function useAdminPosts() {
  return useQuery<Post[]>({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000,
  });
}

export function usePublishedPosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePost(slug: string) {
  return useQuery<Post | null>({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublishedPostsForSelect() {
  return useQuery<Post[]>({
    queryKey: ['posts-published-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, category, author, cover_url, status, created_at, meta_description, content, images_json, related_post_ids, keywords')
        .eq('status', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Post[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

async function fetchRelatedPosts(currentPostId: string, category: string, relatedIds: string[]): Promise<Post[]> {
  const result: Post[] = [];
  const seen = new Set<string>([currentPostId]);

  if (relatedIds.length > 0) {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .in('id', relatedIds)
      .eq('status', true);
    for (const p of (data || []) as Post[]) {
      if (!seen.has(p.id)) { result.push(p); seen.add(p.id); }
    }
  }

  if (result.length < 3 && category) {
    const exclude = Array.from(seen);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', true)
      .eq('category', category)
      .not('id', 'in', `(${exclude.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(3 - result.length);
    for (const p of (data || []) as Post[]) { result.push(p); seen.add(p.id); }
  }

  if (result.length < 3) {
    const exclude = Array.from(seen);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', true)
      .not('id', 'in', `(${exclude.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(3 - result.length);
    for (const p of (data || []) as Post[]) { result.push(p); seen.add(p.id); }
  }

  return result.slice(0, 3);
}

export function useRelatedPosts(currentPostId: string, category: string, relatedIds: string[]) {
  return useQuery<Post[]>({
    queryKey: ['related-posts', currentPostId, category, relatedIds],
    queryFn: () => fetchRelatedPosts(currentPostId, category, relatedIds),
    enabled: !!currentPostId,
    staleTime: 5 * 60 * 1000,
  });
}
