"use client";

import { useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Clock, User, Share2, MessageCircle, Zap, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPost, useBlogAuthors, useIncrementBlogViews, useBlogPosts, useLogBannerClick, type BannerItem } from '@/hooks/useBlog';
import InlineCouponBox, { type InlineCouponConfig } from '@/components/blog/InlineCouponBox';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';
import { calcReadingTime } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';
import { useSettings } from '@/hooks/useSettings';

export default function BlogPost() {
  const { slug } = useParams({ strict: false });
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: authors } = useBlogAuthors();
  const { data: allPosts } = useBlogPosts();
  const { data: settings } = useSettings();
  const incrementViews = useIncrementBlogViews();
  const logBannerClick = useLogBannerClick();

  useEffect(() => { if (post?.id) incrementViews.mutate(post.id); }, [post?.id]);

  const author = authors?.find((a) => a.id === post?.author_id);
  const relatedPosts = allPosts?.filter(p => p.id !== post?.id).slice(0, 2) || [];
  const publishedDate = post?.published_at
    ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;
  const readingTime = post?.content ? calcReadingTime(post.content) : 1;
  const whatsappLink = settings?.global_links.whatsapp_group || '#';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-64 w-full rounded-3xl" />
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
        canonical={`${SITE_URL}/blog/${post.slug}`}
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

      <Header />

      {/* HEADER CLEAN: Título e Imagem Lado a Lado */}
      <section className="bg-[#fcfbf9] border-b border-black/5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  {post.category || 'Economia'}
                </span>
                <span className="text-[11px] font-bold text-[#aaa] flex items-center gap-1">
                  <Clock size={12} /> {readingTime} min
                </span>
              </div>
              
              <h1 className="text-3xl font-black leading-tight text-[#1a1a1a] md:text-4xl lg:text-5xl mb-6">
                {post.title}
              </h1>

              <div className="flex items-center justify-between border-t border-black/5 pt-6">
                <div className="flex items-center gap-3">
                  {author?.avatar_url
                    ? <img src={author.avatar_url} alt={author.name} className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-black/5 shadow-sm text-[#aaa]"><User size={18} /></div>
                  }
                  <div>
                    <p className="text-xs font-black text-[#1a1a1a]">{author?.name || 'Equipe Cuponito'}</p>
                    <p className="text-[10px] font-medium text-[#aaa] uppercase tracking-wider">{publishedDate}</p>
                  </div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-black/5 text-[#555] hover:text-primary transition-colors shadow-sm">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/10 border-4 border-white">
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

      <main className="mx-auto max-w-3xl px-4 py-12">
        <article>
          {post.excerpt && (
            <p className="mb-10 text-lg font-medium leading-relaxed text-[#444] italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-2xl">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-neutral max-w-none text-[#444] leading-[1.8] text-base md:text-lg
              prose-headings:text-[#1a1a1a] prose-headings:font-black
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-black/5 prose-h2:pb-3
              prose-strong:text-[#1a1a1a] prose-strong:font-black
              prose-a:text-primary prose-a:font-black prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:my-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.cta_config && typeof post.cta_config === 'object' && (
            <InlineCouponBox config={post.cta_config as InlineCouponConfig} />
          )}
        </article>

        {/* CTA WHATSAPP */}
        <section className="mt-16 rounded-[2.5rem] bg-gradient-to-br from-[#25D366] to-[#128C7E] p-8 md:p-12 text-center text-white shadow-2xl shadow-green-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md shadow-inner">
              <MessageCircle size={42} className="fill-white text-green-600" />
            </div>
            <h3 className="text-2xl font-black md:text-3xl mb-4">Receba cupons em tempo real!</h3>
            <p className="mx-auto mb-8 max-w-md text-base font-medium text-white/90 leading-relaxed">
              Não perca mais nenhuma oferta relâmpago. Entre no nosso grupo VIP e economize antes de todo mundo.
            </p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-lg font-black uppercase tracking-wide text-[#128C7E] shadow-xl transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
            >
              <Zap size={20} className="fill-current" /> Entrar no Grupo
            </a>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/60">100% Gratuito • Sem Spam</p>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-20 border-t border-black/5 pt-12">
            <h2 className="mb-8 text-lg font-black uppercase tracking-widest text-[#1a1a1a] text-center">Continue economizando</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map(p => <BlogPostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}