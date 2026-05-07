import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAdminBlogPosts, type BlogPost } from '@/hooks/useBlog';
import { AdminBlogDashboard } from './AdminBlogDashboard';
import { AdminBlogPostList } from './AdminBlogPostList';
import { AdminBlogEditor } from './AdminBlogEditor';
import { AdminBlogStats } from './AdminBlogStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminBlogTab() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useAdminBlogPosts();
  const [editingPost, setEditingPost] = useState<BlogPost | null | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); } else { toast({ title: 'Post excluído' }); queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); }
  };

  const handleSaved = () => { setEditingPost(undefined); queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); };

  if (editingPost !== undefined) {
    return <AdminBlogEditor post={editingPost} onSave={handleSaved} onCancel={() => setEditingPost(undefined)} />;
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Blog</h1><p className="text-sm text-muted-foreground">Gerencie artigos, categorias e autores</p></div>
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4"><AdminBlogDashboard posts={posts} /></TabsContent>
        <TabsContent value="posts" className="mt-4">
          {isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Carregando posts...</p> : <AdminBlogPostList posts={posts} onEdit={(p) => setEditingPost(p)} onNew={() => setEditingPost(null)} onDelete={handleDelete} />}
        </TabsContent>
        <TabsContent value="banners" className="mt-4">
          <AdminBlogStats posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
