"use client";

import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { useCoupons } from '@/hooks/useCoupons';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import SEOHead from '@/components/SEOHead';
import CouponCard from '@/components/CouponCard';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import { getMonthYear } from '@/lib/utils';

export default function StoreDetail() {
  const { slug } = useParams();
  const { data: coupons, isLoading } = useCoupons();
  const { data: storeBrands } = useStoreBrands();
  const [search, setSearch] = useState('');
  const monthYear = getMonthYear();

  const storeBrand = useMemo(() => {
    if (!storeBrands || !slug) return undefined;
    
    let found = storeBrands.find((b) => b.slug === slug);
    if (found) return found;

    const cleanSlug = slug
      .replace(/^cupom-desconto-/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    return storeBrands.find((b) => {
      const dbSlugClean = b.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dbNameClean = b.display_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return dbSlugClean === cleanSlug || dbNameClean === cleanSlug;
    });
  }, [storeBrands, slug]);

  const storeName = storeBrand?.display_name;
  const storeEmoji = storeBrand?.icon_emoji || '🏷️';
  const storeLogo = storeBrand?.logo_url;
  const brandColor = storeBrand?.brand_color || '#575ecf';

  const storeBrandMap = useMemo(() => {
    if (!storeBrands) return {};
    const map: Record<string, (typeof storeBrands)[number]> = {};
    storeBrands.forEach((b) => {
      map[b.display_name] = b;
    });
    return map;
  }, [storeBrands]);

  const filtered = useMemo(() => {
    if (!coupons || !storeName) return [];
    return coupons.filter((c) => {
      const matchStore = c.store === storeName;
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        (c.code && c.code.toLowerCase().includes(search.toLowerCase()));
      return matchStore && matchSearch;
    });
  }, [coupons, storeName, search]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (storeBrands && !storeBrand && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <Header />
        <div className="max-w-md space-y-4 py-20">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Loja não encontrada</h2>
          <p className="text-muted-foreground">Não encontramos a loja "{slug}" em nossa base de dados.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft size={18} /> Voltar ao início
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {storeName && (
        <SEOHead
          title={`Cupom de Desconto ${storeName} ${monthYear} | Cuponito`}
          description={`Cupons de desconto e códigos promocionais ${storeName} atualizados em ${monthYear}. Economize com ofertas exclusivas!`}
          canonical={`https://cuponito.com.br/desconto/${slug}`}
          jsonLdRoute={{ type: 'store', storeName, slug: slug!, coupons: filtered }}
        />
      )}

      <Header />

      <div
        className="px-4 py-8 md:py-12 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}
      >
        <Link to="/" className="mb-3 md:mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/25">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar
        </Link>
        
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 p-3 backdrop-blur-md md:h-24 md:w-24">
          {storeLogo ? (
            <img src={storeLogo} alt={storeName} className="h-full w-full object-contain brightness-0 invert" />
          ) : (
            <span className="text-4xl md:text-5xl">{storeEmoji}</span>
          )}
        </div>

        <h1 className="text-xl font-bold md:text-4xl lg:text-5xl">
          {storeName || 'Carregando...'} — Cupons de Desconto {monthYear}
        </h1>
        <p className="mx-auto mt-2 md:mt-3 max-w-lg text-sm md:text-base text-white/80">
          Todos os códigos promocionais e ofertas exclusivas para {storeName || '...'}
        </p>
      </div>

      <WhatsAppCTA variant="store" storeName={storeName} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="relative mx-auto mb-8 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Buscar cupom ${storeName || ''}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 rounded-full border-2 border-border focus-visible:border-primary focus-visible:ring-primary/20"
            aria-label={`Buscar cupons de ${storeName || ''}`}
          />
        </div>

        {!isMounted || isLoading || !storeBrands ? (
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message={`Nenhum cupom encontrado para ${storeName}`} />
        ) : (
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <CouponCard key={c.id} coupon={c} index={i} storeBrand={storeBrandMap[c.store]} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}