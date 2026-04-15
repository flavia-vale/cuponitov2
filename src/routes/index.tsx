import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import UrgencyBanner from '@/components/UrgencyBanner';
import CategoryScroll from '@/components/CategoryScroll';
import StoreCards from '@/components/StoreCards';
import SEOHead from '@/components/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import { getMonthYear } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));
const Footer = lazy(() => import('@/components/Footer'));
const CouponCard = lazy(() => import('@/components/CouponCard'));
const FeaturedStoreCard = lazy(() => import('@/components/FeaturedStoreCard'));

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: settings } = useSettings();
  const monthYear = getMonthYear();

  const featuredCoupons = useMemo(() => {
    if (!coupons) return [];
    // Pega os 2 primeiros para a seção "Destaques do dia"
    return coupons.slice(0, 2);
  }, [coupons]);

  const regularCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.slice(2, 8);
  }, [coupons]);

  const storeBrandMap = useMemo(() => {
    if (!storeBrands) return {};
    const map: Record<string, (typeof storeBrands)[number]> = {};
    storeBrands.forEach((b) => {
      map[b.display_name] = b;
      map[b.slug] = b;
    });
    return map;
  }, [storeBrands]);

  const seo = useMemo(() => {
    if (!settings) return { title: `Cupom de Desconto ${monthYear} | Cuponito`, description: 'Economize agora com os melhores cupons.' };
    return {
      title: settings.seo_defaults.home_title.replace('{month_year}', monthYear),
      description: settings.seo_defaults.home_description.replace('{month_year}', monthYear)
    };
  }, [settings, monthYear]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical="https://cuponito.com.br/"
        jsonLdRoute={{ type: 'home', coupons: featuredCoupons }}
      />

      <Header />
      <HeroBanner />
      <UrgencyBanner />
      
      <main className="relative z-10 pb-12">
        <CategoryScroll />

        {/* Seção Destaques do dia */}
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Destaques do dia</h2>
            <Link to="/blog" className="flex items-center gap-1 text-xs font-bold text-[#ff5200] hover:underline">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {couponsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-48 rounded-3xl" />
              <Skeleton className="h-48 rounded-3xl" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredCoupons.map((c) => (
                <Suspense key={c.id} fallback={<Skeleton className="h-48 rounded-3xl" />}>
                  <FeaturedStoreCard 
                    coupon={c} 
                    storeBrand={storeBrandMap[c.store]} 
                  />
                </Suspense>
              ))}
            </div>
          )}
        </section>

        <StoreCards />

        <Suspense fallback={null}>
          <WhatsAppCTA variant="urgency" />
        </Suspense>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-6 text-xl font-black text-foreground">Outras ofertas verificadas</h2>
          {isMounted ? (
            couponsLoading ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-3xl" />
                ))}
              </div>
            ) : regularCoupons.length === 0 ? (
              <EmptyState message="Nenhum cupom encontrado" />
            ) : (
              <Suspense fallback={null}>
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {regularCoupons.map((c, i) => (
                    <CouponCard key={c.id} coupon={c} index={i} storeBrand={storeBrandMap[c.store]} />
                  ))}
                </div>
              </Suspense>
            )
          ) : null}
        </section>

        <Suspense fallback={null}>
          <WhatsAppCTA variant="social-proof" />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}