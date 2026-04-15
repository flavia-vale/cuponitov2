"use client";

import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/EmptyState';
import SEOHead from '@/components/SEOHead';

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: allPosts, isLoading: postsLoading } = useBlogPosts();
  const { data: categories } = useBlogCategories();

  const filtered = useMemo(() => {
    if (!allPosts) return [];
    if (!selectedCategory || !categories) return allPosts;
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (!cat) return allPosts;
    return allPosts.filter((p) => p.category_id === cat.id);
  }, [allPosts, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Blog — Dicas e Ofertas | Cuponito" 
        description="Artigos, dicas de economia e ofertas atualizadas. Aprenda a economizar com cupons de desconto!" 
        jsonLdRoute={{ type: 'generic' }}
      />
      <Header />
      <div className="bg-gradient-to-br from-primary to-accent px-4 py-10 text-center text-white md:py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="inline-flex rounded-xl bg-white/15 p-3 backdrop-blur-sm"><BookOpen className="h-6 w-6 sm:h-8 sm:w-8" /></div>
          <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl">Blog</h1>
          <p className="max-w-lg text-sm text-white/80 md:text-base">Dicas, novidades e guias para economizar nas suas compras online</p>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {categories && categories.length > 0 && <div className="mb-6 md:mb-8"><BlogCategoryFilter categories={categories} selected={selectedCategory} onSelect={(slug) => setSelectedCategory(slug)} /></div>}
        {postsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Nenhum artigo encontrado" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((post, i) => <BlogPostCard key={post.id} post={post} index={i} />)}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}