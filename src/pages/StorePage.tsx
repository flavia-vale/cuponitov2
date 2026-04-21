import { useState, useMemo } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import SEOHead from '@/components/SEOHead';
import StoreCouponCard from '@/components/StoreCouponCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  ChevronRight, 
  Star, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { getMonthYear, cn } from '@/lib/utils';

type FilterType = 'all' | 'code' | 'offer' | 'free';

export default function StorePage() {
  const { slug } = useParams({ strict: false });
  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: settings } = useSettings();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showExpired, setShowExpired] = useState(false);
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    return storeBrands.find((b) => b.slug === slug);
  }, [storeBrands, slug]);

  const storeName = storeBrand?.name || '';
  const storeLogo = storeBrand?.logo_url;

  const storeCoupons = useMemo(() => {
    if (!coupons || !storeName) return [];
    return coupons.filter(c => c.store === storeName);
  }, [coupons, storeName]);

  const filteredCoupons = useMemo(() => {
    return storeCoupons.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'code') return !!c.code;
      if (filter === 'offer') return !c.code && c.category !== 'Frete Grátis';
      if (filter === 'free') return c.category === 'Frete Grátis';
      return true;
    });
  }, [storeCoupons, filter]);

  const handleVisit = () => {
    const link = storeCoupons[0]?.link || '/';
    window.open(link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  if (storeBrands && !storeBrand && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef] p-4 text-center">
        <Header />
        <div className="max-w-md space-y-4 py-20">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Loja não encontrada</h2>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">Voltar ao início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans antialiased text-[#1a1a1a]">
      {storeName && (
        <SEOHead
          title={`Cupom de Desconto ${storeName} | Até 80% OFF – ${monthYear} | cuponito.`}
          description={`Cupom de desconto ${storeName} válido hoje: códigos verificados e atualizados diariamente pelo cuponito. Economize agora!`}
          canonical={`https://cuponito.com.br/desconto/${slug}`}
          jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filteredCoupons }}
        />
      )}
      <Header />
      <div className="border-b border-black/5 bg-white px-4 py-3 text-[11px] md:text-xs">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 text-[#aaa]">
          <Link to="/" className="text-primary hover:underline">Início</Link>
          <ChevronRight size={10} />
          <span className="truncate">Cupom {storeName}</span>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <main className="space-y-4">
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
                {storeLogo ? <img src={storeLogo} alt={storeName} className="h-full w-full object-contain" /> : <span className="text-2xl font-black text-primary uppercase">{storeName.slice(0,3)}</span>}
              </div>
              <div className="flex-1 space-y-3">
                <h1 className="text-xl md:text-2xl font-black leading-tight">Cupom de Desconto {storeName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#888]">
                  <div className="flex items-center gap-1 text-[#2E7D32] font-semibold"><ShieldCheck size={14} /> Loja confiável</div>
                  <div>Atualizado em {monthYear}</div>
                </div>
                <p className="text-sm text-[#555] leading-relaxed max-w-2xl">Encontre os melhores cupons {storeName} verificados e atualizados diariamente.</p>
              </div>
              <button onClick={handleVisit} className="btn-primary w-full md:w-auto px-8">Visitar {storeName} <ArrowUpRight size={16} /></button>
            </section>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white p-3 shadow-sm overflow-x-auto scrollbar-none">
              <button onClick={() => setFilter('all')} className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", filter === 'all' ? "bg-primary text-white shadow-lg" : "bg-[#f5f3ef] text-[#555]")}>Todos ({storeCoupons.length})</button>
              <button onClick={() => setFilter('code')} className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", filter === 'code' ? "bg-primary text-white shadow-lg" : "bg-[#f5f3ef] text-[#555]")}>Códigos ({storeCoupons.filter(c => c.code).length})</button>
            </div>
            <div className="space-y-3">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />) : filteredCoupons.map(coupon => <StoreCouponCard key={coupon.id} coupon={coupon} />)}
            </div>
          </main>
          <aside className="space-y-4">
            <div className="rounded-2xl bg-primary p-6 text-white text-center shadow-xl">
              <h3 className="text-base font-bold mb-1">Ir para {storeName}</h3>
              <button onClick={handleVisit} className="w-full bg-white text-primary font-black py-3 rounded-xl text-sm mt-4">Visitar Loja ↗</button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}