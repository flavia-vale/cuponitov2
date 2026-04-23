import { useMemo } from 'react';
import { FileText, Eye, Star, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { BlogPost } from '@/hooks/useBlog';

interface Props { posts: BlogPost[]; }

export function AdminBlogDashboard({ posts }: Props) {
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;
    const totalViews = posts.reduce((acc, p) => acc + (p.views_count || 0), 0);
    const featured = posts.filter((p) => p.featured).length;
    return { total, published, drafts, totalViews, featured };
  }, [posts]);

  const topPosts = useMemo(() => [...posts].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5), [posts]);

  const cards = [
    { label: 'Total de Posts', value: stats.total, icon: FileText, color: 'text-primary' },
    { label: 'Publicados', value: stats.published, icon: Eye, color: 'text-green-500' },
    { label: 'Rascunhos', value: stats.drafts, icon: FileText, color: 'text-yellow-500' },
    { label: 'Visualizações', value: stats.totalViews.toLocaleString('pt-BR'), icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Destaques', value: stats.featured, icon: Star, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (<Card key={c.label}><CardContent className="flex items-center gap-3 p-4"><c.icon className={`h-5 w-5 shrink-0 ${c.color}`} /><div><p className="text-xs text-muted-foreground">{c.label}</p><p className="text-lg font-bold text-foreground">{c.value}</p></div></CardContent></Card>))}
      </div>
      {topPosts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">Top 5 — Mais vistos</h2>
            <div className="space-y-2">
              {topPosts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    <span className="truncate text-sm font-medium text-foreground">{p.title || 'Sem título'}</span>
                    <a 
                      href={`/blog/${p.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Ver post publicado"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">{(p.views_count || 0).toLocaleString('pt-BR')} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}