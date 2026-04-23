"use client";

import { useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPost, useBlogAuthors, useIncrementBlogViews, useBlogPosts, useLogBannerClick, type BannerItem } from '@/hooks/useBlog';
import InlineCouponBox, { type InlineCouponConfig } from '@/components/blog/InlineCouponBox';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';
import { calcReadingTime } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

export default function BlogPost() {
  const { slug } = useParams({ strict: false });
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: authors } = useBlogAuthors();
  const { data: allPosts } = useBlogPosts();
  const incrementViews = useIncrementBlogViews();
  const logBannerClick = useLogBannerClick();

  useEffect(() => { if (post?.id) incrementViews.mutate(post.id); }, [post?.id]);

  const author = authors?.find((a) => a.id === post?.author_id);
  const relatedPosts = allPosts?.filter(p => p.id !== post?.id).slice(0, 2) || [];
  const publishedDate = post?.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;
  const readingTime = post?.content ? calcReadingTime(post.content) : 1;
  const canonical = post?.slug ? `${SITE_URL}/blog/${post.slug}` : undefined;

  const banners: BannerItem[] = Array.isArray(post?.images_json) ? (post.images_json as unknown as BannerItem[]) : [];

  const handleBannerClick = (postId: string, linkUrl: string, bannerUrl: string) => {
    logBannerClick.mutate({ postId, bannerUrl, linkUrl });
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="mb-4 h-10 w-full rounded-xl" />
          <Skeleton className="mb-8 h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef]">
        <Header />
        <p className="text-lg font-bold text-[#1a1a1a]">Artigo não encontrado 😕</p>
        <Link to="/blog" className="text-primary font-bold underline">Voltar ao blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${post.meta_title || post.title} | Blog Cuponito`}
        description={post.meta_description || post.excerpt || ''}
        canonical={canonical}
        ogType="article"
        ogImage={post.cover_image || undefined}
        jsonLdRoute={{
          type: 'blog',
          article: {
            title: post.title,
            slug: post.slug,
            description: post.excerpt,
            datePublished: post.published_at || post.created_at,
            authorName: author?.name,
            imageUrl: post.cover_image,
          }
        }}
      />

      {/* TOP BAR */}
      <div className="bg-[#FF4D00] px-4 py-3 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white">
            <ArrowLeft size={18} /> Voltar
          </Link>
          <span className="text-sm font-black">cuponito<span className="text-accent">.</span> blog</span>
          <button onClick={handleShare} aria-label="Compartilhar" className="text-white/90 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* HERO SECTION WITH TITLE */}
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-soft to-accent">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" loading="eager" />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl md:text-9xl">📱</div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 inline-block rounded-lg bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Artigo</span>
          <h1 className="max-w-4xl text-2xl font-black leading-tight text-white md:text-4xl lg:text-5xl">{post.title}</h1>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <article>
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-black/5 pb-6 text-[11px] font-medium text-[#aaa]">
            <div className="flex items-center gap-2">
              {author?.avatar_url
                ? <img src={author.avatar_url} alt={author.name} className="h-6 w-6 rounded-full object-cover" loading="lazy" />
                : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f3ef]"><User size={12} /></div>
              }
              <span className="text-[#1a1a1a] font-bold">{author?.name || 'Equipe Cuponito'}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-[#ddd]" />
            <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} min de leitura</span>
            <span className="h-1 w-1 rounded-full bg-[#ddd]" />
            <span className="flex items-center gap-1"><Calendar size={12} /> {publishedDate}</span>
          </div>

          {post.excerpt && (
            <p className="mb-8 text-base font-medium leading-relaxed text-[#444] italic border-l-4 border-primary/30 pl-4">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-neutral max-w-none text-[#555] leading-[1.8] text-sm md:text-base
              prose-headings:text-[#1a1a1a] prose-headings:font-black
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-black/5 prose-h2:pb-2
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
              prose-p:mb-6 prose-p:leading-[1.9]
              prose-strong:text-[#1a1a1a]
              prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-[#FFF8F5] prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-[#444]
              prose-table:text-sm prose-table:w-full
              prose-thead:bg-[#FFF0EB] prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-black prose-th:text-[#1a1a1a] prose-th:text-xs prose-th:uppercase prose-th:tracking-wider
              prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-black/5
              prose-tr:even:bg-[#FAFAFA]
              prose-img:rounded-2xl prose-img:shadow-md
              prose-code:bg-[#FFF0EB] prose-code:text-primary prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-ul:space-y-1 prose-ol:space-y-1
              prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA FINAL */}
          {post.cta_config && typeof post.cta_config === 'object' && (
            <InlineCouponBox config={post.cta_config as InlineCouponConfig} />
          )}

          {/* BANNERS */}
          {banners.length > 0 && (
            <div className="mt-10 space-y-4">
              {banners.map((banner, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBannerClick(post.id, banner.link_url, banner.banner_url)}
                  className="block w-full overflow-hidden rounded-2xl shadow-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Abrir oferta ${idx + 1}`}
                >
                  <img
                    src={banner.banner_url}
                    alt={`Banner ${idx + 1}`}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </article>

        {/* RELATED */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-black/5 pt-10">
            <h2 className="mb-6 text-sm font-black uppercase tracking-wider text-[#1a1a1a]">Artigos relacionados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map(p => <BlogPostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}