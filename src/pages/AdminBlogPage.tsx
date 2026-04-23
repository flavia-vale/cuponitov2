import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Menu, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAdminBlogPosts, type BlogPost } from '@/hooks/useBlog';
import { AdminBlogDashboard } from '@/components/admin/AdminBlogDashboard';
import { AdminBlogPostList } from '@/components/admin/AdminBlogPostList';
import { AdminBlogEditor } from '@/components/admin/AdminBlogEditor';
import { AdminBlogCategoriesTab } from '@/components/admin/AdminBlogCategoriesTab';
import { AdminBlogAuthorsTab } from '@/components/admin/AdminBlogAuthorsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'posts', label: 'Posts' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'autores', label: 'Autores' },
] as const;

type BlogTab = typeof NAV_TABS[number]['id'];

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null | undefined>(undefined);
  const { data: posts = [], isLoading: postsLoading } = useAdminBlogPosts();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate({ to: '/admin/login' }); return; }
      setLoading(false);
    });
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Post excluído' }); queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); }
  };

  const handleSaved = () => {
    setEditingPost(undefined);
    queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (editingPost !== undefined) {
    return (
      <RoleProtectedRoute requiredRoles={['blog_admin', 'super_admin']}>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <AdminBlogEditor post={editingPost} onSave={handleSaved} onCancel={() => setEditingPost(undefined)} />
          </div>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute requiredRoles={['blog_admin', 'super_admin']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
            <Link to="/admin" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <span className="text-border">|</span>
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Blog</span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Painel do Blog</h1>
            <p className="text-sm text-muted-foreground">Gerencie posts, categorias e autores</p>
          </div>

          <Tabs defaultValue="dashboard">
            <TabsList className="mb-4">
              {NAV_TABS.map(t => (
                <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dashboard">
              <AdminBlogDashboard posts={posts} />
            </TabsContent>

            <TabsContent value="posts">
              {postsLoading
                ? <p className="py-8 text-center text-sm text-muted-foreground">Carregando posts...</p>
                : <AdminBlogPostList
                    posts={posts}
                    onEdit={(p) => setEditingPost(p)}
                    onNew={() => setEditingPost(null)}
                    onDelete={handleDelete}
                  />
              }
            </TabsContent>

            <TabsContent value="categorias">
              <AdminBlogCategoriesTab />
            </TabsContent>

            <TabsContent value="autores">
              <AdminBlogAuthorsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
