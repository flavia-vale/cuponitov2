import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAdminPosts, type Post } from '@/hooks/usePosts';
import { AdminBlogEditor } from '@/components/admin/AdminBlogEditor';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<Post | null | undefined>(undefined);
  const { data: posts = [], isLoading } = useAdminPosts();

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Post excluído' });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    }
  };

  const handleSaved = () => {
    setEditingPost(undefined);
    queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/admin/login' });
  };

  if (editingPost !== undefined) {
    return (
      <RoleProtectedRoute requiredRoles={['blog_admin', 'super_admin']}>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <AdminBlogEditor
              post={editingPost}
              onSave={handleSaved}
              onCancel={() => setEditingPost(undefined)}
            />
          </div>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute requiredRoles={['blog_admin', 'super_admin']}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-card">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <span className="text-border">|</span>
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Blog</span>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel do Blog</h1>
              <p className="text-sm text-muted-foreground">Gerencie seus artigos</p>
            </div>
            <Button onClick={() => setEditingPost(null)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Novo Post
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Posts ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Carregando...</p>
              ) : posts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Nenhum post criado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="max-w-[200px]">
                            <span className="truncate block text-sm font-medium">{post.title || 'Sem título'}</span>
                            <span className="truncate block text-xs text-muted-foreground font-mono">{post.slug}</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{post.category || '—'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{post.author || '—'}</TableCell>
                          <TableCell>
                            <Badge variant={post.status ? 'default' : 'secondary'} className="text-xs">
                              {post.status ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setEditingPost(post)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
