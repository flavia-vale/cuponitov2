import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { Skeleton } from '@/components/ui/skeleton';

const StoreCards = () => {
  const { data: stores, isLoading } = useStoreBrands();

  if (isLoading || !stores) {
    return (
      <section id="lojas" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <h2 className="mb-4 md:mb-6 text-center text-xl font-bold text-foreground md:text-3xl">
          Escolha sua loja favorita
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={`h-36 rounded-2xl ${i === 0 ? 'col-span-2' : ''}`} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="lojas" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h2 className="mb-4 md:mb-6 text-center text-xl font-bold text-foreground md:text-3xl">
        Escolha sua loja favorita
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {stores.map((store, i) => {
          const isFeatured = i === 0;
          return (
            <Link
              key={store.id}
              to="/desconto/$slug"
              params={{ slug: store.slug }}
              aria-label={`Ver cupons de desconto ${store.display_name}`}
              className={`group relative overflow-hidden rounded-2xl p-3 sm:p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-fade-in ${isFeatured ? 'col-span-2' : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${store.brand_color}, ${store.fallback_color})`,
                }}
              />
              <div className="relative z-10">
                <div className="mb-2 sm:mb-4 inline-flex rounded-xl bg-white/20 p-2 sm:p-3">
                  <span className={isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}>
                    {store.icon_emoji}
                  </span>
                </div>
                <h3 className={`mb-0.5 sm:mb-1 font-bold ${isFeatured ? 'text-base sm:text-2xl' : 'text-sm sm:text-xl'}`}>
                  {store.display_name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/90 group-hover:gap-2 transition-all">
                  Ver cupons <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StoreCards;
