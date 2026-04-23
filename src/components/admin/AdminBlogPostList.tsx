import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/hooks/useBlog';

interface Props { posts: BlogPost[]; onEdit: (post: BlogPost) => void; onNew: () => void; onDelete: (id: string) => void; }

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  published: { label: 'Publicado', variant: 'default' },
  draft: { label: 'Rascunho', variant: 'secondary' },
  scheduled: { label: 'Agendado', variant: 'outline' },
};

export function AdminBlogPostList({ posts, onEdit, onNew, onDelete }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2"><CardTitle className="text-base">Posts ({posts.length})</CardTitle><Button size="sm" onClick={onNew} className="gap-1.5"><Plus className="h-4 w-4" /> Novo Post</Button></CardHeader>
      <CardContent>
        {posts.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum post criado ainda.</p> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Data</TableHead><TableHead className="w-32" /></TableRow></TableHeader>
              <TableBody>
                {posts.map((post) => {
                  const st = statusLabels[post.status] || statusLabels.draft;
                  return (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-[250px]"><div className="flex items-center gap-2">{post.featured && <span title="Destaque">⭐</span>}<span className="truncate text-sm font-medium">{post.title || 'Sem título'}</span></div></TableCell>
                      <TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                      <TableCell className="text-sm">{post.views_count}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : new Date(post.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" asChild title="Ver post publicado">
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onEdit(post)} title="Editar post"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(post.id)} title="Excluir post"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}