import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import UrgencyBanner from '@/components/UrgencyBanner';
import CategoryScroll from '@/components/CategoryScroll';
import SEOHead from '@/components/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import { getMonthYear } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import HowItWorks from '@/components/HowItWorks';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));
const Footer = lazy(() => import('@/components/Footer'));
const FeaturedStoreCard = lazy(() => import('@/components/FeaturedStoreCard'));
const PopularCouponItem = lazy(() => import('@/components/PopularCouponItem'));
const PartnerStoreCard = lazy(() => import('@/components/PartnerStoreCard'));

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands, isLoading: storesLoading } = useStoreBrands();
  const { data: settings } = useSettings();
  const monthYear = getMonthYear();

  const featuredCoupons = useMemo(() => coupons?.slice(0, 3) || [], [coupons]);
  const popularCoupons = useMemo(() => coupons?.slice(3, 8) || [], [coupons]);

  const storeBrandMap = useMemo(() => {
    const map: Record<string, any> = {};
    storeBrands?.forEach((b) => { map[b.display_name] = b; });
    return map;
  }, [storeBrands]);

  const seo = useMemo(() => {
    if (!settings) return { title: `Cupom de Desconto ${monthYear}`, description: 'Economize agora.' };
    return {
      title: settings.seo_defaults.home_title.replace('{month_year}', monthYear),
      description: settings.seo_defaults.home_description.replace('{month_year}', monthYear)
    };
  }, [settings, monthYear]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* Agora passando featuredCoupons para gerar o Schema ItemList no Google */}
      <SEOHead 
        title={seo.title} 
        description={seo.description} 
        jsonLdRoute={{ type: 'home', coupons: featuredCoupons }} 
      />
      
      <Header />
      <HeroBanner />
      <UrgencyBanner />
      
      <main className="relative z-10 space-y-2 pb-12">
        <CategoryScroll />

        <section className="mx-auto max-w-6xl overflow-hidden px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Destaques do dia</h2>
            <Link to="/blog" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {couponsLoading ? [1,2].map(i => <Skeleton key={i} className="h-48 min-w-[85vw] rounded-3xl sm:min-w-full" />) : 
              featuredCoupons.map(c => (
                <div key={c.id} className="min-w-[85vw] snap-center sm:min-w-full">
                  <FeaturedStoreCard coupon={c} storeBrand={storeBrandMap[c.store]} />
                </div>
              ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Cupons populares</h2>
            <Link to="/" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {couponsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />) : 
              popularCoupons.map(c => <PopularCouponItem key={c.id} coupon={c} storeBrand={storeBrandMap[c.store]} />)}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Lojas parceiras</h2>
            <Link to="/" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {storesLoading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />) : 
              storeBrands?.slice(0, 4).map(s => (
                <PartnerStoreCard 
                  key={s.id} 
                  store={s} 
                  couponCount={coupons?.filter(c => c.store === s.display_name && c.status).length || 0} 
                />
              ))}
          </div>
        </section>

        <HowItWorks />
        
        <Suspense fallback={null}>
          <WhatsAppCTA variant="urgency" />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}