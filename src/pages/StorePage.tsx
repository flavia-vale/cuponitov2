import { useState, useMemo, lazy, Suspense } from 'react';
import GroupJoinCTA from '@/components/GroupJoinCTA';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import FeaturedGuidesLinks from '@/components/blog/FeaturedGuidesLinks';
import { useStoreCoupons } from '@/hooks/useStoreCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import SEOHead from '@/components/SEOHead';
import StoreCouponCard from '@/components/StoreCouponCard';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonthYear, cn } from '@/lib/utils';
import StoreIcon from '@/components/StoreIcon';
import StoreQuickAccessCard from '@/components/StoreQuickAccessCard';
import { useWhatsappGroupInfo, useWhatsappGroupPages } from '@/hooks/useWhatsappGroupPages';
import { useCouponCategories } from '@/hooks/useCouponCategories';
import {
  GROUP_HUB_SLUG,
  groupCtaTitle,
  groupInfoForPage,
  groupPageForStore,
  groupPagePath,
  nicheGroupSlug,
  pagePath,
} from '@/lib/whatsappGroup';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));

type FilterType = 'all' | 'code' | 'offer' | 'free';

// Página com centenas de cartões empurrava o botão do grupo para o fim: mostra
// um lote e carrega mais a pedido.
const PAGE_SIZE = 12;

export default function StorePage() {
  const { slug } = useParams({ strict: false });
  const { data: storeBrands, isLoading: storesLoading } = useStoreBrands();
  const [filter, setFilter] = useState<FilterType>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    return storeBrands.find((b) => b.slug === slug);
  }, [storeBrands, slug]);

  const { data: storeCouponsData, isLoading: couponsLoading } = useStoreCoupons(storeBrand?.id, storeBrand?.name);
  const storeName = storeBrand?.name || slug?.replace(/cupom-desconto-/g, '').replace(/-/g, ' ') || '';
  const brandColor = storeBrand?.brand_color || '#FF4D00';
  const { data: groupPages } = useWhatsappGroupPages();
  const { data: categories } = useCouponCategories();
  const groupInfo = useWhatsappGroupInfo();

  const storeCoupons = useMemo(() => storeCouponsData ?? [], [storeCouponsData]);

  // Grupo da loja: o ligado a ela no painel, senão o do nicho dos cupons dela (mesma regra do HTML do servidor).
  const groupPage = useMemo(
    () => (slug ? groupPageForStore(groupPages ?? [], slug, nicheGroupSlug(storeCoupons, categories ?? [])) : null),
    [groupPages, slug, storeCoupons, categories]
  );

  const lastUpdated = useMemo(() => {
    if (!storeCoupons.length) return null;
    const max = storeCoupons.reduce((latest, c) => {
      const t = c.updated_at ? new Date(c.updated_at).getTime() : 0;
      return t > latest ? t : latest;
    }, 0);
    if (!max) return null;
    const d = new Date(max);
    return d.toLocaleString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }).replace('.', '').replace(',', ',');
  }, [storeCoupons]);

  // useStoreCoupons já traz só os ativos e dentro da validade.
  const activeCoupons = storeCoupons;

  const filteredCoupons = useMemo(() => {
    return activeCoupons.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'code') return !!c.code;
      if (filter === 'offer') return !c.code && c.category !== 'Frete Grátis';
      if (filter === 'free') return c.category === 'Frete Grátis';
      return true;
    });
  }, [activeCoupons, filter]);

  const handleVisit = () => {
    const link = storeBrand?.website_url || storeCoupons[0]?.link || '/';
    window.open(link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const isLoading = couponsLoading || storesLoading;

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans antialiased text-[#1a1a1a] text-sm">
      <SEOHead
        title={`Cupom de Desconto ${storeName} | Até 80% OFF – ${monthYear} | Cuponito`}
        description={storeBrand?.meta_description || `Cupom de desconto ${storeName} válido hoje: até 80% OFF. Códigos verificados e atualizados diariamente pelo Cuponito.`}
        canonical={`https://www.cuponito.com.br/desconto/${slug}`}
        ogImage={storeBrand?.logo_url || undefined}
        jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filteredCoupons }}
      />
      
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
        {!isLoading && !storeBrand ? (
          <div className="max-w-md mx-auto space-y-4 py-20 text-center">
            <div className="text-6xl">😕</div>
            <h2 className="text-2xl font-bold">Loja não encontrada</h2>
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">Voltar ao início</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[22px] py-[22px] pb-10">
            <main className="space-y-4">
              {isLoading ? <Skeleton className="h-48 w-full rounded-2xl" /> : (
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
                      {activeCoupons.length > 0 && (
                        <span className="bg-[#EAF3DE] text-[#2E7D32] text-[10px] font-bold px-[9px] py-0.5 rounded-[9px]">Verificado hoje</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#888] mb-2.5">
                      <span>Atualizado em {lastUpdated ?? monthYear}</span>
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
              )}

              <GroupJoinCTA
                compact
                title={groupCtaTitle(
                  groupPage,
                  groupInfoForPage(groupInfo, groupPage),
                  !isLoading && activeCoupons.length === 0
                    ? `Sem cupom da ${storeName} agora? Receba as ofertas no WhatsApp`
                    : 'Receba cupons e achadinhos no WhatsApp'
                )}
                groupSlug={groupPage?.slug}
                source="store_top"
                context={storeName || null}
              />

              <div className="bg-white border border-[#e8e5e0] rounded-xl p-[12px_14px] flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#888] mr-1">Filtrar:</span>
                <button onClick={() => { setFilter('all'); setVisibleCount(PAGE_SIZE); }} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'all' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Todos ({activeCoupons.length})</button>
                <button onClick={() => { setFilter('code'); setVisibleCount(PAGE_SIZE); }} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'code' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Códigos ({activeCoupons.filter(c => c.code).length})</button>
                <button onClick={() => { setFilter('offer'); setVisibleCount(PAGE_SIZE); }} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'offer' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Ofertas ({activeCoupons.filter(c => !c.code && c.category !== 'Frete Grátis').length})</button>
                <button onClick={() => { setFilter('free'); setVisibleCount(PAGE_SIZE); }} className={cn("border border-[#ddd] rounded-[20px] p-[5px_13px] text-xs cursor-pointer transition-all", filter === 'free' ? "bg-[#FF4D00] border-[#FF4D00] text-white" : "bg-white text-[#555] hover:border-[#FF4D00] hover:text-[#FF4D00]")}>Frete grátis ({activeCoupons.filter(c => c.category === 'Frete Grátis').length})</button>
              </div>

              <div className="space-y-2.5">
                {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />) :
                  filteredCoupons.slice(0, visibleCount).map(coupon => <StoreCouponCard key={coupon.id} coupon={coupon} />)}
              </div>

              {!isLoading && filteredCoupons.length > visibleCount && (
                <button
                  onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                  className="w-full rounded-xl border border-[#ddd] bg-white p-3 text-[13px] font-bold text-[#555] transition-colors hover:border-[#FF4D00] hover:text-[#FF4D00]"
                >
                  Ver mais cupons ({filteredCoupons.length - visibleCount})
                </button>
              )}

              <Suspense fallback={null}>
                <WhatsAppCTA
                  variant="store"
                  storeName={storeName}
                  groupSlug={groupPage?.slug}
                  learnMoreHref={groupPage ? pagePath(groupPage) : groupPagePath(GROUP_HUB_SLUG)}
                />
              </Suspense>

              <FeaturedGuidesLinks className="mt-2" />

            </main>

            <aside className="space-y-3.5">
              <div className="sticky top-[72px] space-y-3.5">
                <StoreQuickAccessCard 
                  storeName={storeName} 
                  brandColor={brandColor} 
                  logoUrl={storeBrand?.logo_url} 
                  onVisit={handleVisit} 
                />
                
                {/* ... Rest of aside */}
              </div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}