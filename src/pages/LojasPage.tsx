import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useCoupons } from '@/hooks/useCoupons';
import PartnerStoreCard from '@/components/PartnerStoreCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';

const Footer = lazy(() => import('@/components/Footer'));

export default function LojasPage() {
  const [search, setSearch] = useState('');
  const { data: storeBrands, isLoading } = useStoreBrands();
  const { data: coupons } = useCoupons();

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return storeBrands ?? [];
    return (storeBrands ?? []).filter(s => s.name.toLowerCase().includes(term));
  }, [storeBrands, search]);

  const couponCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    (coupons ?? []).forEach(c => { if (c.status) map[c.store] = (map[c.store] ?? 0) + 1; });
    return map;
  }, [coupons]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <SEOHead
        title="Lojas com Cupom de Desconto — {month_year} | Cuponito"
        description="Encontre cupons de desconto das melhores lojas do Brasil. Amazon, Shopee, Mercado Livre e centenas de outras lojas verificadas."
        canonical="https://www.cuponito.com.br/lojas"
        jsonLdRoute={{ type: 'lojas' }}
      />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
            <ArrowLeft size={14} /> Início
          </Link>
          <h1 className="text-xl font-bold text-foreground">Todas as lojas</h1>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
          <Search className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Buscar loja..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-10"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {[1,2,3,4,5,6,7,8,9,10].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-lg font-bold">Nenhuma loja encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {filtered.map(s => (
              <PartnerStoreCard
                key={s.id}
                store={s}
                couponCount={couponCountMap[s.name] ?? 0}
              />
            ))}
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
