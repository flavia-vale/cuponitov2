"use client";

import { useState, useMemo } from 'react';
import { Search, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';
import BlogNewsletter from '@/components/blog/BlogNewsletter';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import SEOHead from '@/components/SEOHead';

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { data: allPosts, isLoading: postsLoading } = useBlogPosts();
  const { data: categories } = useBlogCategories();

  const filtered = useMemo(() => {
    if (!allPosts) return [];
    let result = allPosts;

    if (selectedCategory && categories) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
    }

    return result;
  }, [allPosts, selectedCategory, categories, search]);

  const featuredPost = useMemo(() => filtered.find(p => p.featured) || filtered[0], [filtered]);
  const latestPosts = useMemo(() => filtered.filter(p => p.id !== featuredPost?.id).slice(0, 4), [filtered, featuredPost]);
  const mostRead = useMemo(() => [...(allPosts || [])].sort((a, b) => b.views_count - a.views_count).slice(0, 3), [allPosts]);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <SEOHead
        title="Blog Cuponito — Guias e Dicas para Economizar | Cuponito"
        description="Guias, comparativos e cupons embutidos para você comprar mais barato. Atualizado diariamente pela equipe Cuponito."
        canonical="https://www.cuponito.com.br/blog"
        jsonLdRoute={{ type: 'blog-list' }}
      />
      <Header />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#FF4D00] via-[#FF7A38] to-[#FFB347] px-4 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white">Blog do Cuponito</span>
          <h1 className="mb-4 text-3xl font-black leading-tight md:text-5xl text-white">Guias, comparativos e dicas para economizar</h1>
          <p className="mb-8 text-sm font-medium text-white md:text-lg">Conteúdo com cupons embutidos para você já sair comprando mais barato.</p>

          <div className="relative flex items-center rounded-full bg-white p-1.5 shadow-2xl">
            <Search className="ml-4 h-5 w-5 text-[#aaa]" />
            <Input
              placeholder="Buscar no blog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent shadow-none text-[#1a1a1a] focus-visible:ring-0 placeholder:text-[#aaa]"
            />
            <Button className="rounded-full bg-[#FF4D00] px-8 font-bold text-white hover:bg-[#D83C00]">Buscar</Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* CATEGORIES */}
        {categories && <BlogCategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />}

        {postsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Nenhum artigo encontrado" />
        ) : (
          <>
            {/* FEATURED */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#1a1a1a]">
                <Sparkles className="h-4 w-4 text-primary" /> Destaque da semana
              </h2>
              {featuredPost && <BlogPostCard post={featuredPost} variant="featured" />}
            </section>

            {/* LATEST & MOST READ */}
            <div className="grid gap-10 lg:grid-cols-[1fr_350px]">
              <section>
                <h2 className="mb-4 flex items-center justify-between text-sm font-black uppercase tracking-wider text-[#1a1a1a]">
                  Últimos posts
                  <span className="text-[11px] font-bold text-primary cursor-pointer hover:underline">Ver todos →</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {latestPosts.length > 0
                    ? latestPosts.map(post => <BlogPostCard key={post.id} post={post} />)
                    : <p className="col-span-2 text-sm text-[#aaa]">Sem posts recentes.</p>
                  }
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#1a1a1a]">
                    <TrendingUp className="h-4 w-4 text-primary" /> Mais lidos
                  </h2>
                  <div className="space-y-3">
                    {mostRead.map(post => <BlogPostCard key={post.id} post={post} variant="row" />)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-black/5 p-6 shadow-sm">
                  <h3 className="text-sm font-black mb-2">Precisa de ajuda?</h3>
                  <p className="text-xs text-[#888] leading-relaxed mb-4">Nossos especialistas selecionam os melhores cupons todos os dias.</p>
                  <Button variant="outline" className="w-full rounded-xl border-primary text-primary font-bold hover:bg-primary/5">Falar com o time</Button>
                </div>
              </section>
            </div>

            {/* NEWSLETTER */}
            <BlogNewsletter />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}