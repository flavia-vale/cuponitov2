import { Link } from '@tanstack/react-router';
import { Calendar, Clock, Tag } from 'lucide-react';
import type { BlogPost } from '@/hooks/useBlog';

interface Props {
  post: BlogPost;
  index?: number;
  variant?: 'grid' | 'featured' | 'row';
}

const BlogPostCard = ({ post, index = 0, variant = 'grid' }: Props) => {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Recente';

  if (variant === 'featured') {
    return (
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="group relative block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-xl"
      >
        <div className="aspect-[21/9] w-full overflow-hidden bg-gradient-to-br from-primary to-accent">
          {post.cover_image ? (
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">✍️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="mb-2 inline-block rounded-lg bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wider">Destaque</span>
            <h3 className="text-xl font-black leading-tight md:text-2xl">{post.title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-[#666] line-clamp-2 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#aaa]">{publishedDate} • 5 min de leitura</span>
            <div className="flex gap-2">
              <span className="rounded-md border-2 border-dashed border-primary bg-[#FFF0EB] px-2 py-1 font-mono text-[10px] font-black text-primary">CUPOM10</span>
            </div>
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
          {post.cover_image ? <img src={post.cover_image} alt="" className="h-full w-full object-cover" /> : '📄'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-[#1a1a1a] group-hover:text-primary transition-colors">{post.title}</h4>
          <p className="text-[10px] font-medium text-[#aaa] mt-0.5">{publishedDate} • {post.views_count} leituras</p>
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
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : '💡'}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-[#1a1a1a] group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center justify-between text-[10px] font-medium text-[#aaa]">
          <span>{publishedDate}</span>
          <span className="flex items-center gap-1 rounded-md bg-[#FFF0EB] border-2 border-dashed border-primary px-2 py-0.5 font-black text-primary">
            <Tag size={10} /> Cupons
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;