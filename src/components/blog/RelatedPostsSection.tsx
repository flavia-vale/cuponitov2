import { Link } from '@tanstack/react-router';
import { useRelatedPosts, type Post } from '@/hooks/usePosts';

interface Props {
  currentPostId: string;
  category: string;
  relatedIds: string[];
}

function RelatedPostCard({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-video w-full shrink-0 overflow-hidden bg-[#f5f3ef]">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">📄</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {post.category && (
          <span className="mb-2 inline-block self-start rounded-full bg-[#FFF0EB] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
            {post.category}
          </span>
        )}
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-[#1a1a1a] transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        {post.author && (
          <p className="mt-auto text-[11px] font-medium text-[#aaa]">por {post.author}</p>
        )}
      </div>
    </Link>
  );
}

export function RelatedPostsSection({ currentPostId, category, relatedIds }: Props) {
  const { data: posts = [], isLoading } = useRelatedPosts(currentPostId, category, relatedIds);

  if (isLoading || posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-black/5 pt-10">
      <h2 className="mb-6 text-sm font-black uppercase tracking-wider text-[#1a1a1a]">
        Artigos relacionados
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <RelatedPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
