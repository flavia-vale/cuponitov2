import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/cupons';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useDebounce } from '@/hooks/useDebounce';
import { useCouponCategories } from '@/hooks/useCouponCategories';
import CouponCard from '@/components/CouponCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, ChevronDown, AlertCircle } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { isExpired, isStale, sortCoupons, cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Footer = lazy(() => import('@/components/Footer'));

export default function CuponsPage() {
  const { q = '' } = Route.useSearch();
  const [search, setSearch] = useState(q);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: couponCategories = [] } = useCouponCategories();
  const CATEGORIES = ['Todos', ...couponCategories.map(c => c.name)];
  const debouncedSearch = useDebounce(search, 250);

  const storeBrandMap = useMemo(() => {
    const map: Record<string, any> = {};
    storeBrands?.forEach(b => { map[b.name] = b; });
    return map;
  }, [storeBrands]);

  // Lógica de filtragem e separação de cupons
  const { active, potentiallyExpired } = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    const all = (coupons ?? []).filter(c => {
      const matchesSearch = !term
        || c.title.toLowerCase().includes(term)
        || c.store.toLowerCase().includes(term)
        || (c.code?.toLowerCase().includes(term) ?? false);
      const matchesCategory = activeCategory === 'Todos' || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    const activeList = all.filter(c => !isExpired(c.expiry) && !isStale(c.updated_at, c.success_rate));
    const expiredList = all.filter(c => isExpired(c.expiry) || isStale(c.updated_at, c.success_rate));

    return {
      active: sortCoupons(activeList),
      potentiallyExpired: sortCoupons(expiredList)
    };
  }, [coupons, debouncedSearch, activeCategory]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <SEOHead
        title="Cupons de Desconto Verificados {month_year} | Cuponito"
        description="Encontre cupons e ofertas verificados das melhores lojas. Códigos atualizados hoje — Amazon, Shopee, Mercado Livre e muito mais."
        canonical="https://www.cuponito.com.br/cupons"
        jsonLdRoute={{ type: 'cupons' }}
      />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
            <ArrowLeft size={14} /> Início
          </Link>
          <h1 className="text-xl font-bold text-foreground">Todos os cupons</h1>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
          <Search className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Buscar por loja, título ou código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                activeCategory === cat
                  ? 'bg-[#ff5200] text-white'
                  : 'bg-white border border-border text-muted-foreground hover:bg-muted/50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        ) : active.length === 0 && potentiallyExpired.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-lg font-bold">Nenhum cupom encontrado</p>
            <p className="text-sm mt-1">Tente outro termo ou categoria</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Listagem Ativa */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map(c => (
                <CouponCard key={c.id} coupon={c} storeBrand={storeBrandMap[c.store]} />
              ))}
            </div>

            {/* Seção de Expirados/Duvidosos */}
            {potentiallyExpired.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="expired" className="border-none">
                  <AccordionTrigger className="flex items-center gap-2 rounded-xl bg-white border border-border px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <AlertCircle size={16} />
                      Ofertas que podem ter expirado ({potentiallyExpired.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-70 grayscale-[0.3]">
                      {potentiallyExpired.map(c => (
                        <CouponCard key={c.id} coupon={c} storeBrand={storeBrandMap[c.store]} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}