"use client";

import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
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
import HowItWorks from '@/components/HowItWorks';

const WhatsAppCTA = lazy(() => import('@/components/WhatsAppCTA'));
const Footer = lazy(() => import('@/components/Footer'));
const FeaturedStoreCard = lazy(() => import('@/components/FeaturedStoreCard'));
const PopularCouponItem = lazy(() => import('@/components/PopularCouponItem'));
const PartnerStoreCard = lazy(() => import('@/components/PartnerStoreCard'));

export default function Home() {
  const { data: coupons, isLoading: couponsLoading } = useCoupons();
  const { data: storeBrands, isLoading: storesLoading } = useStoreBrands();
  const { data: settings } = useSettings();
  const monthYear = getMonthYear();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featuredCoupons = useMemo(() => {
    const starred = (coupons ?? []).filter(c => (c as any).is_featured);
    const pool = starred.length >= 3 ? starred : (coupons ?? []);
    if (!activeCategory) return pool.slice(0, 3);
    return pool.filter(c => c.category === activeCategory).slice(0, 3);
  }, [coupons, activeCategory]);

  const popularCoupons = useMemo(() => {
    const starred = (coupons ?? []).filter(c => (c as any).is_featured);
    const pool = starred.length >= 3 ? starred : (coupons ?? []);
    if (!activeCategory) return pool.slice(3, 8);
    return pool.filter(c => c.category === activeCategory).slice(3, 8);
  }, [coupons, activeCategory]);

  const featuredStores = useMemo(() => {
    const starred = (storeBrands ?? []).filter(s => (s as any).is_featured);
    return starred.length > 0 ? starred.slice(0, 15) : (storeBrands ?? []).slice(0, 15);
  }, [storeBrands]);

  const storeBrandMap = useMemo(() => {
    const map: Record<string, any> = {};
    storeBrands?.forEach((b) => { map[b.name] = b; });
    return map;
  }, [storeBrands]);

  const couponCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    (coupons ?? []).forEach(c => { if (c.status) map[c.store] = (map[c.store] ?? 0) + 1; });
    return map;
  }, [coupons]);

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
      <SEOHead
        title={seo.title}
        description={seo.description}
        jsonLdRoute={{ type: 'home', coupons: featuredCoupons }}
      />

      <Header />
      <HeroBanner />
      <UrgencyBanner />

      <main className="relative z-10 space-y-2 pb-12">
        <CategoryScroll onSelect={setActiveCategory} />

        <section className="mx-auto max-w-6xl overflow-hidden px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Destaques do dia</h2>
            <Link to="/cupons" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
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
            <Link to="/cupons" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {couponsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />) :
              popularCoupons.map(c => <PopularCouponItem key={c.id} coupon={c} storeBrand={storeBrandMap[c.store]} />)}
          </div>
        </section>

        <section id="lojas" className="mx-auto max-w-6xl px-4 py-6 scroll-mt-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Lojas parceiras</h2>
            <Link to="/lojas" className="flex items-center gap-1 text-xs font-bold text-[#ff5200]">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {storesLoading ? [1,2,3,4,5,6,7,8,9,10].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />) :
              featuredStores.map(s => (
                <PartnerStoreCard
                  key={s.id}
                  store={s}
                  couponCount={couponCountMap[s.name] ?? 0}
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
