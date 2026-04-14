import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/EmptyState';

export const Route = createFileRoute('/blog')({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: 'Blog — Dicas e Ofertas | Cuponito' },
      { name: 'description', content: 'Artigos, dicas de economia e ofertas atualizadas. Aprenda a economizar com cupons de desconto!' },
    ],
  }),
});

const ITEMS_PER_PAGE = 12;

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: allPosts, isLoading: postsLoading } = useBlogPosts();
  const { data: categories } = useBlogCategories();

  const filtered = useMemo(() => {
    if (!allPosts) return [];
    if (!selectedCategory || !categories) return allPosts;
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (!cat) return allPosts;
    return allPosts.filter((p) => p.category_id === cat.id);
  }, [allPosts, selectedCategory, categories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-br from-primary to-accent px-4 py-10 text-center text-white md:py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="inline-flex rounded-xl bg-white/15 p-3 backdrop-blur-sm"><BookOpen className="h-6 w-6 sm:h-8 sm:w-8" /></div>
          <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl">Blog</h1>
          <p className="max-w-lg text-sm text-white/80 md:text-base">Dicas, novidades e guias para economizar nas suas compras online</p>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {categories && categories.length > 0 && <div className="mb-6 md:mb-8"><BlogCategoryFilter categories={categories} selected={selectedCategory} onSelect={(slug) => { setSelectedCategory(slug); setPage(1); }} /></div>}
        {postsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>
        ) : paginated.length === 0 ? (
          <EmptyState message="Nenhum artigo encontrado" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{paginated.map((post, i) => <BlogPostCard key={post.id} post={post} index={i} />)}</div>
        )}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`h-9 min-w-[36px] rounded-full px-3 text-sm font-semibold transition ${page === i + 1 ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
