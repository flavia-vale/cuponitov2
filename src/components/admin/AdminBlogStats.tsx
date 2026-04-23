import { useMemo } from 'react';
import { MousePointerClick, TrendingUp, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useBannerStats } from '@/hooks/useBlog';
import type { BlogPost } from '@/hooks/useBlog';

interface Props { posts: BlogPost[]; }

interface PostStat {
  postId: string;
  title: string;
  totalClicks: number;
  banners: { linkUrl: string; bannerUrl: string; clicks: number }[];
}

export function AdminBlogStats({ posts }: Props) {
  const { data: clicks = [], isLoading } = useBannerStats();

  const postMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of posts) m[p.id] = p.title;
    return m;
  }, [posts]);

  const totalClicks = clicks.length;

  const postStats = useMemo<PostStat[]>(() => {
    const byPost: Record<string, PostStat> = {};

    for (const c of clicks) {
      if (!byPost[c.post_id]) {
        byPost[c.post_id] = {
          postId: c.post_id,
          title: postMap[c.post_id] || 'Post removido',
          totalClicks: 0,
          banners: [],
        };
      }
      const stat = byPost[c.post_id];
      stat.totalClicks += 1;

      const existing = stat.banners.find(b => b.linkUrl === c.link_url);
      if (existing) {
        existing.clicks += 1;
      } else {
        stat.banners.push({ linkUrl: c.link_url, bannerUrl: c.banner_url, clicks: 1 });
      }
    }

    return Object.values(byPost).sort((a, b) => b.totalClicks - a.totalClicks);
  }, [clicks, postMap]);

  const maxClicks = postStats[0]?.totalClicks || 1;

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Carregando estatísticas...</p>;
  }

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MousePointerClick className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total de cliques</p>
              <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-5 w-5 shrink-0 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Posts com cliques</p>
              <p className="text-2xl font-bold text-foreground">{postStats.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <BarChart2 className="h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Média por post</p>
              <p className="text-2xl font-bold text-foreground">
                {postStats.length ? (totalClicks / postStats.length).toFixed(1) : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {postStats.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <MousePointerClick className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhum clique em banners registrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Ranking por post */}
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-4 text-sm font-bold text-foreground">Ranking por Post</h2>
              <div className="space-y-3">
                {postStats.map((stat, i) => (
                  <div key={stat.postId}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                        <span className="truncate text-sm font-medium text-foreground">{stat.title}</span>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                        {stat.totalClicks.toLocaleString('pt-BR')} cliques
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(stat.totalClicks / maxClicks) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento por banner */}
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-4 text-sm font-bold text-foreground">Detalhamento de Conversão por Banner</h2>
              <div className="space-y-6">
                {postStats.map((stat) => {
                  const maxBannerClicks = stat.banners[0]?.clicks || 1;
                  return (
                    <div key={stat.postId}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                        {stat.title}
                      </p>
                      <div className="space-y-2">
                        {[...stat.banners]
                          .sort((a, b) => b.clicks - a.clicks)
                          .map((banner, bi) => (
                            <div key={bi} className="rounded-lg border border-border p-2">
                              <div className="mb-1.5 flex items-center justify-between gap-2">
                                <a
                                  href={banner.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="truncate text-xs font-medium text-primary hover:underline"
                                >
                                  {banner.linkUrl}
                                </a>
                                <span className="shrink-0 text-xs font-bold text-foreground">
                                  {banner.clicks}×
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary/60"
                                  style={{ width: `${(banner.clicks / maxBannerClicks) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
