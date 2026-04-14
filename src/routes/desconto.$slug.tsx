import { useState, useEffect, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCoupons } from '@/hooks/useCoupons';
import { useJsonLd } from '@/hooks/useJsonLd';
import CouponCard from '@/components/CouponCard';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';

const storeMap: Record<string, { name: string; emoji: string; gradient: string }> = {
  'cupom-desconto-amazon': { name: 'Amazon', emoji: '🛒', gradient: 'from-[oklch(0.75_0.18_70)] to-[oklch(0.65_0.18_70)]' },
  'cupom-desconto-shopee': { name: 'Shopee', emoji: '🧡', gradient: 'from-[oklch(0.7_0.2_40)] to-[oklch(0.58_0.2_40)]' },
  'cupom-desconto-mercado-livre': { name: 'Mercado Livre', emoji: '🤝', gradient: 'from-[oklch(0.88_0.18_95)] to-[oklch(0.75_0.18_95)]' },
};

function getMonthYear() {
  const now = new Date();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${now.getFullYear()}`;
}

export const Route = createFileRoute('/desconto/$slug')({
  component: StorePage,
  head: ({ params }) => {
    const storeInfo = storeMap[params.slug];
    const monthYear = getMonthYear();
    return {
      meta: storeInfo ? [
        { title: `${storeInfo.name} - Cupons de Desconto ${monthYear} | Cuponito` },
        { name: 'description', content: `Cupons de desconto e códigos promocionais ${storeInfo.name} atualizados em ${monthYear}. Economize com ofertas exclusivas!` },
      ] : [{ title: 'Loja não encontrada | Cuponito' }],
    };
  },
});

function StorePage() {
  const { slug } = Route.useParams();
  const storeInfo = storeMap[slug || ''];
  const { data: coupons, isLoading } = useCoupons();
  const [search, setSearch] = useState('');
  const monthYear = getMonthYear();

  const filtered = useMemo(() => {
    if (!coup ons || !storeInfo) return [];
    return coupons.filter((c) => {
      const matchStore = c.store === storeInfo.name;
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      return matchStore && matchSearch;
    });
  }, [coupons, storeInfo, search]);

  const jsonLd = useJsonLd(
    storeInfo
      ? { type: 'store', storeName: storeInfo.name, slug: slug!, coupons: filtered }
      : { type: 'generic' }
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!storeInfo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Loja não encontrada</p>
        <Link to="/" className="text-primary underline">Voltar ao início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className={`bg-gradient-to-br ${storeInfo.gradient} px-4 py-8 md:py-12 text-center text-white`}>
        <Link to="/" className="mb-3 md:mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/25">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar
        </Link>
        <h1 className="text-xl font-bold md:text-4xl lg:text-5xl">
          {storeInfo.emoji} {storeInfo.name} — Cupons de Desconto {monthYear}
        </h1>
        <p className="mx-auto mt-2 md:mt-3 max-w-lg text-sm md:text-base text-white/80">
          Todos os códigos promocionais e ofertas exclusivas para {storeInfo.name}
        </p>
      </div>

      <WhatsAppCTA variant="store" storeName={storeInfo.name} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="relative mx-auto mb-8 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Buscar cupom ${storeInfo.name}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 rounded-full border-2 border-border focus-visible:border-primary focus-visible:ring-primary/20"
            aria-label={`Buscar cupons de ${storeInfo.name}`}
          />
        </div>

        {isMounted ? (
          isLoading ? (
            <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState message={`Nenhum cupom encontrado para ${storeInfo.name}`} />
          ) : (
            <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => (
                <CouponCard key={c.id} coupon={c} index={i} />
              ))}
            </div>
          )
        ) : (
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}