import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import HeroBanner from '@/components/HeroBanner';
import StoreCards from '@/components/StoreCards';
import SEOHead from '@/components/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { normalizeStoreSlug } from '@/lib/storeBranding';
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
  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Cupom de Desconto ${monthYear} — Amazon, Shopee e Mercado Livre | Cuponito`}
        description={`Cupons de desconto atualizados em ${monthYear} para Amazon, Shopee e Mercado Livre. Economize nas compras online!`}
        canonical="https://cuponito.com.br/"
        jsonLdRoute={{ type: 'home', coupons: relevantCoupons }}
      />

      <Header />
      <HeroBanner />

      <Suspense fallback={null}>
        <WhatsAppCTA variant="urgency" />
      </Suspense>

      <section className="mx-auto max-w-6xl px-4 pb-8 md:pb-12">
        <div className="mb-5 md:mb-8 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground md:text-3xl">Top cupons</h2>
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>

        {isMounted ? (
          isLoading ? (
            <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : relevantCoupons.length === 0 ? (
            <EmptyState message="Nenhum cupom encontrado" />
          ) : (
            <Suspense fallback={<div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}</div>}>
              <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relevantCoupons.map((c, i) => (
                  <CouponCard key={c.id} coupon={c} index={i} storeBrand={storeBrandMap[c.store]} />
                ))}
              </div>
            </Suspense>
          )
        ) : (
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Encontre mais ofertas selecionando sua loja favorita acima. 👆
        </p>
        <div className="mt-2 text-center">
          <a href="#lojas" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todas as lojas
          </a>
        </div>
      </section>

      <Suspense fallback={null}>
        <WhatsAppCTA variant="social-proof" />
        <Footer />
      </Suspense>
    </div>
  );
}