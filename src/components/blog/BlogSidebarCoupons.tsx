import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';

const BlogSidebarCoupons = () => {
  const { data: coupons } = useCoupons();

  const top3 = useMemo(() => (coupons ?? []).slice(0, 3), [coupons]);

  if (top3.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-card-foreground sm:text-base">
        <Sparkles className="h-4 w-4 text-primary" /> Top 3 Cupons
      </h3>
      <div className="space-y-3">
        {top3.map((c) => (
          <a
            key={c.id}
            href={c.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 transition hover:border-primary/30 hover:shadow-sm"
          >
            <span className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              {c.discount}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {c.title}
              </p>
              <p className="text-xs text-muted-foreground">{c.store}</p>
            </div>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>

      <Link
        to="/"
        className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
      >
        Ver todos os cupons →
      </Link>
    </aside>
  );
};

export default BlogSidebarCoupons;