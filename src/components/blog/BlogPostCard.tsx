import { Link } from '@tanstack/react-router';
import { Tag } from 'lucide-react';
import type { BlogPost } from '@/hooks/useBlog';
import { calcReadingTime } from '@/lib/blog';

interface Props {
  post: BlogPost;
  index?: number;
  variant?: 'grid' | 'featured' | 'row';
}

const BlogPostCard = ({ post, index = 0, variant = 'grid' }: Props) => {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Recente';

  const readingTime = post.content ? calcReadingTime(post.content) : 1;

  if (variant === 'featured') {
    return (
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group block overflow-hidden rounded-3xl border border-black/5 shadow-sm transition-all hover:shadow-xl"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-primary to-accent">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">✍️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
              ⭐ Destaque da semana
            </span>
            <h3 className="mb-2 text-xl font-black leading-tight text-white drop-shadow-md md:text-2xl">{post.title}</h3>
            {post.excerpt && (
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/80">{post.excerpt}</p>
            )}
            <span className="text-[11px] font-medium text-white/60">{publishedDate} · {readingTime} min de leitura</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'row') {
    return (
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-3 transition-all hover:border-primary/20 hover:shadow-md"
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f3ef] flex items-center justify-center text-2xl">
          {post.cover_image ? <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover" /> : '📄'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-[#1a1a1a] group-hover:text-primary transition-colors">{post.title}</h4>
          <p className="text-[10px] font-medium text-[#aaa] mt-0.5">{publishedDate} · {readingTime} min · {post.views_count} leituras</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all hover:shadow-lg"
    >
      <div className="aspect-video w-full overflow-hidden bg-[#f5f3ef] flex items-center justify-center text-4xl">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : '💡'}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-[#1a1a1a] group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-[11px] text-[#888] leading-relaxed">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between text-[10px] font-medium text-[#aaa]">
          <span>{publishedDate} · {readingTime} min de leitura</span>
          <span className="flex items-center gap-1 rounded-md bg-[#FFF0EB] border-2 border-dashed border-primary px-2 py-0.5 font-black text-primary">
            <Tag size={10} /> Cupons
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
