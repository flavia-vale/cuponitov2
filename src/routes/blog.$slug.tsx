import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, context: { queryClient } }) => {
    const { slug } = params;
    
    // Inicia o fetch antes da página carregar para o bot encontrar dados mais rápido
    return queryClient.ensureQueryData({
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
    });
  },
});