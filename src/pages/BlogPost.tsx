"use client";

import { useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPost, useBlogAuthors, useIncrementBlogViews, useBlogPosts } from '@/hooks/useBlog';
import BlogCtaBanner, { type CtaConfig } from '@/components/blog/BlogCtaBanner';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/SEOHead';

export default function BlogPost() {
  const { slug } = useParams({ strict: false });
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: authors } = useBlogAuthors();
  const { data: allPosts } = useBlogPosts();
  const incrementViews = useIncrementBlogViews();

  useEffect(() => { if (post?.id) incrementViews.mutate(post.id); }, [post?.id]);

  const author = authors?.find((a) => a.id === post?.author_id);
  const relatedPosts = allPosts?.filter(p => p.id !== post?.id).slice(0, 2) || [];
  const publishedDate = post?.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

  if (isLoading) {
    return (<div className="min-h-screen bg-white"><Header /><div className="mx-auto max-w-3xl px-4 py-12"><Skeleton className="mb-4 h-10 w-full rounded-xl" /><Skeleton className="mb-8 h-4 w-1/2 rounded-lg" /><Skeleton className="h-96 w-full rounded-3xl" /></div></div>);
  }

  if (!post) {
    return (<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef]"><Header /><p className="text-lg font-bold text-[#1a1a1a]">Artigo não encontrado 😕</p><Link to="/blog" className="text-primary font-bold underline">Voltar ao blog</Link></div>);
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={`${post.meta_title || post.title} | Blog Cuponito`} 
        description={post.meta_description || post.excerpt} 
        jsonLdRoute={{ 
          type: 'blog', 
          article: {
            title: post.title,
            slug: post.slug,
            description: post.excerpt,
            datePublished: post.published_at || post.created_at,
            authorName: author?.name,
            imageUrl: post.cover_image
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
          <button className="text-white/90 hover:text-white"><Share2 size={18} /></button>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div className="aspect-[21/9] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-soft to-accent flex items-center justify-center text-7xl md:text-9xl">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        ) : '📱'}
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <article>
          <span className="mb-4 inline-block rounded-lg bg-[#FFF0EB] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">Artigo</span>
          <h1 className="mb-4 text-2xl font-black leading-tight text-[#1a1a1a] md:text-4xl">{post.title}</h1>
          
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-black/5 pb-6 text-[11px] font-medium text-[#aaa]">
            <div className="flex items-center gap-2">
              {author?.avatar_url ? <img src={author.avatar_url} className="h-6 w-6 rounded-full object-cover" /> : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f3ef]"><User size={12} /></div>}
              <span className="text-[#1a1a1a] font-bold">{author?.name || 'Equipe Cuponito'}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-[#ddd]" />
            <span className="flex items-center gap-1"><Clock size={12} /> 8 min de leitura</span>
            <span className="h-1 w-1 rounded-full bg-[#ddd]" />
            <span className="flex items-center gap-1"><Calendar size={12} /> {publishedDate}</span>
          </div>

          {post.excerpt && (
            <p className="mb-8 text-base font-medium leading-relaxed text-[#444] italic">
              {post.excerpt}
            </p>
          )}

          <div 
            className="prose prose-neutral max-w-none text-[#555] leading-[1.8] text-sm md:text-base
              prose-headings:text-[#1a1a1a] prose-headings:font-black prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4
              prose-p:mb-6 prose-strong:text-[#1a1a1a] prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* CTA FINAL */}
          {post.cta_config && typeof post.cta_config === 'object' && (
            <BlogCtaBanner config={post.cta_config as CtaConfig} />
          )}
        </article>

        {/* RELATED */}
        <section className="mt-16 border-t border-black/5 pt-10">
          <h2 className="mb-6 text-sm font-black uppercase tracking-wider text-[#1a1a1a]">Artigos relacionados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedPosts.map(p => <BlogPostCard key={p.id} post={p} />)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}