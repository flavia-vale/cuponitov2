import { useState, useMemo, lazy, Suspense } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import SEOHead from '@/components/SEOHead';
import StoreCouponCard from '@/components/StoreCouponCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight, 
  ChevronDown,
  MessageCircle
} from 'lucide-react';
import { getMonthYear, cn } from '@/lib/utils';
import StoreIcon from '@/components/StoreIcon';
import StoreQuickAccessCard from '@/components/StoreQuickAccessCard';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));

type FilterType = 'all' | 'code' | 'offer' | 'free';

export default function StorePage() {
  const { slug } = useParams({ strict: false });
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands, isLoading: storesLoading } = useStoreBrands();
  const { data: settings } = useSettings();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showExpired, setShowExpired] = useState(false);
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    return storeBrands.find((b) => b.slug === slug);
  }, [storeBrands, slug]);

  const storeName = storeBrand?.name || '';
  const brandColor = storeBrand?.brand_color || '#FF4D00';
  const whatsappLink = settings?.global_links.whatsapp_group || '#';

  const storeCoupons = useMemo(() => {
    if (!coupons || !storeName) return [];
    return coupons.filter(c => c.store === storeName);
  }, [coupons, storeName]);

  const activeCoupons = useMemo(() => {
    return storeCoupons.filter(c => c.status);
  }, [storeCoupons]);

  const expiredCoupons = useMemo(() => {
    return storeCoupons.filter(c => !c.status);
  }, [storeCoupons]);

  const filteredCoupons = useMemo(() => {
    return activeCoupons.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'code') return !!c.code;
      if (filter === 'offer') return !c.code && c.category !== 'Frete Grátis';
      if (filter === 'free') return c.category === 'Frete Grátis';
      return true;
    });
  }, [activeCoupons, filter]);

  const popularStores = useMemo(() => {
    if (!storeBrands) return [];
    return storeBrands
      .filter(s => s.slug !== slug && s.is_featured)
      .slice(0, 5);
  }, [storeBrands, slug]);

  const relatedStores = useMemo(() => {
    if (!storeBrands || !storeBrand) return [];
    // Tenta buscar lojas da mesma categoria baseada no primeiro cupom
    const category = storeCoupons[0]?.category;
    return storeBrands
      .filter(s => s.slug !== slug && !s.is_featured)
      .slice(0, 4);
  }, [storeBrands, storeBrand, slug, storeCoupons]);

  const handleVisit = () => {
    const link = storeCoupons[0]?.link || '/';
    window.open(link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  if (storeBrands && !storeBrand && !storesLoading) {
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

  const isLoading = couponsLoading || storesLoading;

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans antialiased text-[#1a1a1a] text-sm">
      {storeName && (
        <SEOHead
          title={`Cupom de Desconto ${storeName} | Até 80% OFF – ${monthYear} | Cuponito`}
          description={storeBrand?.meta_description || `Cupom de desconto ${storeName} válido hoje: até 80% OFF. Códigos verificados e atualizados diariamente pelo Cuponito.`}
          canonical={`https://www.cuponito.com.br/desconto/${slug}`}
          ogImage={storeBrand?.logo_url || undefined}
          jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filteredCoupons }}
        />
      )}
      
      <Header />

      <div className="bg-white border-b border-[#e8e5e0] py-2.5 px-5">
        <div className="max-w-[1100px] mx-auto flex items-center gap-1.5 text-xs text-[#aaa]">
          <Link to="/" className="text-[#FF4D00] hover:underline">Início</Link>
          <span>›</span>
          <Link to="/lojas" className="text-[#FF4D00] hover:underline">Lojas</Link>
          <span>›</span>
          <span className="truncate">Cupom {storeName}</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[22px] py-[22px] pb-10">
          
          <main className="space-y-4">
            <section className="bg-white border border-[#e8e5e0] rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5">
              <div className="shrink-0">
                <StoreIcon
                  name={storeName}
                  brandColor={brandColor}
                  logoUrl={storeBrand?.logo_url}
                  size="xl"
                  className="border border-[#e8e5e0]"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-[22px] font-bold text-[#1a1a1a]">Cupom de Desconto {storeName}</h1>
                  <span className="bg-[#EAF3DE] text-[#2E7D32] text-[10px] font-bold px-[9px] py-0.5 rounded-[9px]">Verificado hoje</span>
                </div>
                <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#888] mb-2.5">
                  <span>Atualizado em {monthYear}</span>
                </div>
                <p className="text-[13px] text-[#555] leading-relaxed max-w-[580px]">
                  {storeBrand?.description || `A ${storeName} é uma das maiores lojas do Brasil. Aqui você encontra os melhores cupons ${storeName} verificados, atualizados várias vezes ao dia pela equipe do Cuponito.`}
                </p>
                <div className="flex gap-4 mt-3.5">
                  <div className="bg-[#f5f3ef] rounded-xl p-[9px_14px] text-center min-w-[80px]">
                    <span className="block text-lg font-bold text-[#FF4D00]">{activeCoupons.length}</span>
                    <span className="text-[10px] text-[#888]">cupons ativos</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleVisit}
                className="bg-[#FF4D00] text-white border-none rounded-xl p-[10px_20px] text-[13px] font-bold cursor-pointer whitespace-nowrap mt-1 hover:bg-[#D83C00] transition-colors w-full md:w-auto"
              >
                Visitar {storeName} ↗
              </button>
            </section>

            <div className="bg-white border border-[#e8e5e0] rounded-xl p-[12px_14px] flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#888] mr-1">Filtrar:</span>
              <button onClick={() => setFilter('all')} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'all' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Todos ({activeCoupons.length})</button>
              <button onClick={() => setFilter('code')} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'code' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Códigos ({activeCoupons.filter(c => c.code).length})</button>
              <button onClick={() => setFilter('offer')} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'offer' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Ofertas ({activeCoupons.filter(c => !c.code && c.category !== 'Frete Grátis').length})</button>
              <button onClick={() => setFilter('free')} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'free' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Frete grátis ({activeCoupons.filter(c => c.category === 'Frete Grátis').length})</button>
            </div>

            <div className="space-y-2.5">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />) :
                filteredCoupons.map(coupon => <StoreCouponCard key={coupon.id} coupon={coupon} />)}
            </div>

            {expiredCoupons.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 cursor-pointer mb-3 group" onClick={() => setShowExpired(!showExpired)}>
                  <ChevronRight size={16} className={cn("transition-transform text-[#888]", showExpired && "rotate-90")} />
                  <span className="text-[13px] text-[#888]">Mostrar <strong>{expiredCoupons.length} cupons expirados</strong></span>
                </div>
                {showExpired && <div className="space-y-2.5">{expiredCoupons.map(coupon => <StoreCouponCard key={coupon.id} coupon={coupon} isExpired />)}</div>}
              </div>
            )}
          </main>

          <aside className="space-y-3.5">
            <div className="sticky top-[72px] space-y-3.5">
              <StoreQuickAccessCard 
                storeName={storeName} 
                brandColor={brandColor} 
                logoUrl={storeBrand?.logo_url} 
                onVisit={handleVisit} 
              />

              <div className="bg-[#25D366] rounded-2xl p-[18px] text-center text-white shadow-lg">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-black mb-1.5 text-white">Receba cupons em tempo real</h3>
                <p className="text-xs text-white mb-4 leading-relaxed">Participe do nosso grupo e economize antes de todo mundo!</p>
                <a href={whatsappLink} target="_blank" rel="nofollow noopener noreferrer">
                  <button className="bg-white text-[#25D366] border-none rounded-xl p-[12px] text-[13px] font-black cursor-pointer w-full hover:bg-gray-50 transition-all active:scale-95">
                    Entrar no WhatsApp
                  </button>
                </a>
              </div>

              <div className="bg-white border border-[#e8e5e0] rounded-2xl p-4">
                <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-3">Lojas populares agora</h4>
                <div className="divide-y divide-[#f0ede8]">
                  {popularStores.map(s => (
                    <Link key={s.id} to="/desconto/$slug" params={{ slug: s.slug }} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0 group">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#e8e5e0] shrink-0">
                        <StoreIcon name={s.name} brandColor={s.brand_color} logoUrl={s.logo_url} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#1a1a1a] truncate group-hover:text-[#FF4D00] transition-colors">{s.name}</div>
                      </div>
                      <ChevronRight size={14} className="text-[#FF4D00]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#e8e5e0] rounded-2xl p-4">
                <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-3">Lojas relacionadas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {relatedStores.map(s => (
                    <Link 
                      key={s.id} 
                      to="/desconto/$slug" 
                      params={{ slug: s.slug }} 
                      className="border border-[#e8e5e0] rounded-xl p-2.5 flex flex-col items-center gap-1.5 hover:border-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <StoreIcon name={s.name} brandColor={s.brand_color} logoUrl={s.logo_url} size="sm" />
                      </div>
                      <div className="text-[10px] font-bold text-[#555] text-center truncate w-full">{s.name}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-[#f9f7f4] border border-[#e8e5e0] rounded-xl p-3 text-center">
                <p className="text-[11px] text-[#999] leading-relaxed">
                  Utilizamos links de afiliados. Ao comprar pelos nossos links, podemos receber comissão — sem custo extra para você.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}