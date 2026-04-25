import { useMemo } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { useCouponCategories } from '@/hooks/useCouponCategories';
import CouponCard from '@/components/CouponCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { isExpired, isStale, sortCoupons } from '@/lib/utils';
import { getMonthYear } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Footer = lazy(() => import('@/components/Footer'));

const MIN_COUPONS_FOR_OWN_CANONICAL = 5;

export default function CategoryPage() {
  const { slug } = useParams({ strict: false });
  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const { data: couponCategories = [], isLoading: categoriesLoading } = useCouponCategories();
  const monthYear = getMonthYear();

  const matchedCategory = couponCategories.find(c => c.slug === (slug ?? ''));
  const categoryName = matchedCategory?.name;
  const description = matchedCategory?.description ?? '';

  const storeBrandMap = useMemo(() => {
    const map: Record<string, any> = {};
    storeBrands?.forEach(b => { map[b.name] = b; });
    return map;
  }, [storeBrands]);

  const { active, potentiallyExpired } = useMemo(() => {
    if (!categoryName) return { active: [], potentiallyExpired: [] };
    const all = (coupons ?? []).filter(c => c.category === categoryName);
    return {
      active: sortCoupons(all.filter(c => !isExpired(c.expiry) && !isStale(c.updated_at, c.success_rate))),
      potentiallyExpired: sortCoupons(all.filter(c => isExpired(c.expiry) || isStale(c.updated_at, c.success_rate))),
    };
  }, [coupons, categoryName]);

  // Canonical aponta para /cupons quando há poucos cupons (evita thin content)
  const canonical = active.length >= MIN_COUPONS_FOR_OWN_CANONICAL
    ? `${SITE_URL}/categoria/${slug}`
    : `${SITE_URL}/cupons`;

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        </main>
      </div>
    );
  }

  if (!categoryName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f3ef] p-4 text-center">
        <Header />
        <div className="max-w-md space-y-4 py-20">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Categoria não encontrada</h2>
          <Link to="/cupons" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            Ver todos os cupons
          </Link>
        </div>
        <Suspense fallback={null}><Footer /></Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <SEOHead
        title={`Cupons de ${categoryName} — ${monthYear} | Cuponito`}
        description={description}
        canonical={canonical}
        jsonLdRoute={{ type: 'categoria', categoryName, slug: slug!, coupons: active }}
      />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#aaa]">
          <Link to="/" className="text-[#FF4D00] hover:underline">Início</Link>
          <span>›</span>
          <Link to="/cupons" className="text-[#FF4D00] hover:underline">Cupons</Link>
          <span>›</span>
          <span>{categoryName}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cupons" className="flex items-center gap-1 text-sm font-bold text-[#ff5200] hover:underline">
            <ArrowLeft size={14} /> Cupons
          </Link>
          <h1 className="text-xl font-bold text-foreground">Cupons de {categoryName}</h1>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        ) : active.length === 0 && potentiallyExpired.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-lg font-bold">Nenhum cupom de {categoryName} no momento</p>
            <Link to="/cupons" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">
              Ver todos os cupons
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map(c => (
                <CouponCard key={c.id} coupon={c} storeBrand={storeBrandMap[c.store]} />
              ))}
            </div>

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
