import { Link } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlog';

interface Props {
  title?: string;
  limit?: number;
  className?: string;
}

/**
 * Bloco de links para os guias em destaque do blog.
 *
 * Existe para cumprir a regra "página nova nunca nasce órfã": um post sem link
 * interno não é descoberto nem pelo Google nem pelos robôs das IAs. Os posts
 * vêm do banco (`featured`), nunca hardcoded — marcar em destaque no painel é
 * o que coloca o post aqui.
 */
export default function FeaturedGuidesLinks({
  title = 'Guias do Cuponito',
  limit = 3,
  className = '',
}: Props) {
  const { data: posts = [] } = useBlogPosts();
  const featured = posts.filter(post => post.featured).slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 ${className}`}
      aria-labelledby="guias-cuponito"
    >
      <h2
        id="guias-cuponito"
        className="mb-3 flex items-center gap-1.5 text-sm font-black uppercase tracking-wide text-[#666]"
      >
        <BookOpen size={14} className="text-[#ff5200]" /> {title}
      </h2>
      <ul className="space-y-2">
        {featured.map(post => (
          <li key={post.id}>
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="text-sm font-semibold text-[#1a1a1a] hover:text-[#ff5200] hover:underline"
            >
              {post.title}
            </Link>
            {post.excerpt && (
              <p className="mt-0.5 text-xs text-muted-foreground">{post.excerpt}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
