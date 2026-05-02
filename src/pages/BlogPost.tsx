"use client";

import { useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Clock, User, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPost, useBlogAuthors, useBlogCategories, useIncrementBlogViews, useRelatedBlogPosts } from '@/hooks/useBlog';
import InlineCouponBox, { type InlineCouponConfig } from '@/components/blog/InlineCouponBox';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogWhatsAppCTA from '@/components/blog/BlogWhatsAppCTA';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';
import { calcReadingTime } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

export default function BlogPost() {
  const { slug } = useParams({ strict: false });
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: authors } = useBlogAuthors();
  const { data: categories = [] } = useBlogCategories();
  const { data: relatedPosts = [] } = useRelatedBlogPosts(post?.id ?? '', post?.category_id);
  const incrementViews = useIncrementBlogViews();

  useEffect(() => {
    if (post?.id && slug) incrementViews.mutate({ postId: post.id, slug });
  }, [post?.id, slug]);

  const author = authors?.find((a) => a.id === post?.author_id);
  const category = categories.find((c) => c.id === post?.category_id);
  const publishedDate = post?.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;
  const readingTime = post?.content ? calcReadingTime(post.content) : 1;

  // SEO sempre presente para o Googlebot, mesmo durante o loading
  const seoTitle = post
    ? (post.meta_title || `${post.title} | Blog Cuponito`)
    : `${slug?.replace(/-/g, ' ')} | Blog Cuponito`;
  const seoDesc = post?.meta_description || post?.excerpt || 'Confira este artigo no blog do Cuponito.';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`${SITE_URL}/blog/${slug}`}
        ogType="article"
        ogImage={post?.cover_image || undefined}
        jsonLdRoute={post ? {
          type: 'blog',
          article: {
            title: post.title,
            slug: post.slug,
            description: post.excerpt,
            datePublished: post.published_at || post.created_at,
            authorName: author?.name,
            imageUrl: post.cover_image,
          }
        } : { type: 'generic' }}
      />

      <Header />

      {isLoading ? (
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : !post ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f5f3ef] text-center px-4">
          <p className="text-lg font-bold text-[#1a1a1a]">Artigo não encontrado 😕</p>
          <Link to="/blog" className="text-primary font-bold underline">Voltar ao blog</Link>
        </div>
      ) : (
        <>
          <section className="bg-[#fcfbf9] border-b border-black/5 py-6 sm:py-10 md:py-16">
            <div className="mx-auto max-w-6xl px-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 md:items-center">
                <div className="order-2 md:order-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                      {category?.name || 'Economia'}
                    </span>
                    <span className="text-[11px] font-bold text-[#aaa] flex items-center gap-1">
                      <Clock size={12} /> {readingTime} min
                    </span>
                  </div>
                  <h1 className="mb-4 text-xl font-black leading-tight text-[#1a1a1a] sm:text-2xl md:text-4xl lg:text-5xl sm:mb-6">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-between border-t border-black/5 pt-4 sm:pt-6">
                    <div className="flex items-center gap-3">
                      {author?.avatar_url
                        ? <img src={author.avatar_url} alt={author.name} className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm sm:h-10 sm:w-10" />
                        : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-black/5 shadow-sm text-[#aaa] sm:h-10 sm:w-10"><User size={16} /></div>
                      }
                      <div>
                        <p className="text-xs font-black text-[#1a1a1a]">{author?.name || 'Equipe Cuponito'}</p>
                        <p className="text-[10px] font-medium text-[#aaa] uppercase tracking-wide">{publishedDate}</p>
                      </div>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-black/5 text-[#555] hover:text-primary transition-colors shadow-sm sm:h-10 sm:w-10">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg shadow-primary/10 border-2 border-white sm:rounded-2xl sm:border-4 sm:shadow-2xl">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" loading="eager" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted text-4xl">✍️</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 overflow-x-hidden">
            <article>
              {post.excerpt && (
                <p className="mb-6 border-l-4 border-primary bg-primary/5 py-2 pl-4 pr-3 text-sm font-medium italic leading-relaxed text-[#444] rounded-r-xl sm:mb-10 sm:pl-6 sm:text-base sm:rounded-r-2xl">
                  {post.excerpt}
                </p>
              )}
              <div
                className="prose prose-neutral max-w-none text-[#444] leading-[1.8] text-sm sm:text-base md:text-lg
                  prose-headings:text-[#1a1a1a] prose-headings:font-black
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-black/5 prose-h2:pb-3
                  md:prose-h2:text-2xl md:prose-h2:mt-12 md:prose-h2:mb-6
                  prose-strong:text-[#1a1a1a] prose-strong:font-black
                  prose-a:text-primary prose-a:font-black prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8 md:prose-img:rounded-[2rem] md:prose-img:my-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {post.cta_config && typeof post.cta_config === 'object' && (
                <InlineCouponBox config={post.cta_config as InlineCouponConfig} />
              )}
            </article>
            <div className="mt-10 sm:mt-16">
              <BlogWhatsAppCTA />
            </div>
            {relatedPosts.length > 0 && (
              <section className="mt-12 border-t border-black/5 pt-8 sm:mt-20 sm:pt-12">
                <h2 className="mb-6 text-sm font-black uppercase tracking-wide text-[#1a1a1a] text-center sm:mb-8 sm:text-base sm:tracking-widest">Continue economizando</h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {relatedPosts.map(p => <BlogPostCard key={p.id} post={p} />)}
                </div>
              </section>
            )}
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}