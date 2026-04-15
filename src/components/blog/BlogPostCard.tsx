import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Eye } from 'lucide-react';
import type { BlogPost } from '@/hooks/useBlog';

interface Props {
  post: BlogPost;
  index?: number;
}

const BlogPostCard = ({ post, index = 0 }: Props) => {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, boxShadow: 'var(--shadow-card)' }}
    >
      {post.cover_image && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {post.featured && (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
            ⭐ Destaque
          </span>
        )}

        <h3 className="mb-1.5 text-base font-bold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors sm:text-lg">
          {post.title}
        </h3>

        <p className="mb-3 text-xs text-muted-foreground line-clamp-2 sm:text-sm">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {publishedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {publishedDate}
              </span>
            )}
            {post.views_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {post.views_count}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            Ler mais <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;