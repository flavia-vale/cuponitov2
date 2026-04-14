import { useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPost, useBlogAuthors, useIncrementBlogViews } from '@/hooks/useBlog';
import BlogCtaBanner, { type CtaConfig } from '@/components/blog/BlogCtaBanner';
import BlogSidebarCoupons from '@/components/blog/BlogSidebarCoupons';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: authors } = useBlogAuthors();
  const incrementViews = useIncrementBlogViews();

  useEffect(() => { if (post?.id) incrementViews.mutate(post.id); }, [post?.id]);

  const author = authors?.find((a) => a.id === post?.author_id);

  const ctaConfig: CtaConfig | null = post?.cta_config && typeof post.cta_config === 'object' && Object.keys(post.cta_config).length > 0 ? (post.cta_config as CtaConfig) : null;

  const publishedDate = post?.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

  if (isLoading) {
    return (<div className="min-h-screen bg-background"><Header /><div className="mx-auto max-w-5xl px-4 py-12"><Skeleton className="mb-4 h-8 w-3/4 rounded-xl" /><Skeleton className="mb-2 h-4 w-1/2 rounded-lg" /><Skeleton className="mt-8 h-64 w-full rounded-2xl" /></div></div>);
  }

  if (!post) {
    return (<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"><Header /><p className="text-lg text-muted-foreground">Artigo não encontrado</p><Link to="/blog" className="text-primary underline">Voltar ao blog</Link></div>);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {post.cover_image && <div className="h-48 w-full overflow-hidden bg-muted sm:h-64 md:h-80"><img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" /></div>}
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <Link to="/blog" className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Blog</Link>
        <div className="flex flex-col gap-8 lg:flex-row">
          <article className="min-w-0 flex-1 max-w-3xl">
            <h1 className="mb-3 text-2xl font-bold text-foreground leading-tight md:text-3xl lg:text-4xl">{post.title}</h1>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {author && <span className="flex items-center gap-1.5">{author.avatar_url ? <img src={author.avatar_url} alt={author.name} className="h-5 w-5 rounded-full object-cover" /> : <User className="h-4 w-4" />}{author.name}</span>}
              {publishedDate && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {publishedDate}</span>}
              {post.views_count > 0 && <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views_count} visualizações</span>}
            </div>
            {post.excerpt && <p className="mb-6 text-base text-muted-foreground italic border-l-4 border-primary/30 pl-4">{post.excerpt}</p>}
            {ctaConfig && <BlogCtaBanner config={ctaConfig} />}
            <div className="prose prose-neutral max-w-none text-foreground leading-relaxed whitespace-pre-line">{post.content}</div>
            {ctaConfig && <BlogCtaBanner config={ctaConfig} />}
          </article>
          <div className="w-full shrink-0 lg:w-72 xl:w-80"><div className="sticky top-20 space-y-5"><BlogSidebarCoupons /></div></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
