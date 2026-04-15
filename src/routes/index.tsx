import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import UrgencyBanner from '@/components/UrgencyBanner';
import StoreCards from '@/components/StoreCards';
import SEOHead from '@/components/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useSettings } from '@/hooks/useSettings';
import { getMonthYear } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));
const Footer = lazy(() => import('@/components/Footer'));
const CouponCard = lazy(() => import('@/components/CouponCard'));

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: settings } = useSettings();
  const monthYear = getMonthYear();

  const relevantCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.slice(0, 3);
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
        jsonLdRoute={{ type: 'home', coupons: relevantCoupons }}
      />

      <Header />
      <HeroBanner />
      <UrgencyBanner />
      
      <main className="relative z-10">
        <StoreCards />

        <Suspense fallback={null}>
          <WhatsAppCTA variant="urgency" />
        </Suspense>

        <section className="mx-auto max-w-6xl px-4 pb-8 md:pb-12">
          <div className="mb-6 md:mb-10 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-foreground md:text-4xl">Ofertas em Destaque</h2>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          {isMounted ? (
            couponsLoading ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-3xl" />
                ))}
              </div>
            ) : relevantCoupons.length === 0 ? (
              <EmptyState message="Nenhum cupom encontrado" />
            ) : (
              <Suspense fallback={null}>
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relevantCoupons.map((c, i) => (
                    <CouponCard key={c.id} coupon={c} index={i} storeBrand={storeBrandMap[c.store]} />
                  ))}
                </div>
              </Suspense>
            )
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-3xl" />
              ))}
            </div>
          )}
        </section>

        <Suspense fallback={null}>
          <WhatsAppCTA variant="social-proof" />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}