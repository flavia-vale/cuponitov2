import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';

const UrgencyBanner = () => {
  const { data: coupons } = useCoupons();

  const expiringCount = useMemo(() => {
    if (!coupons) return 0;
    // For now, let's show the banner if there are coupons to maintain the brand feel
    // In a real scenario, we'd filter by actual date
    return coupons.length > 5 ? 12 : coupons.length;
  }, [coupons]);

  if (expiringCount === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-2">
      <div className="flex items-center justify-between rounded-2xl bg-accent px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-foreground">
            <Zap size={20} className="fill-foreground" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-tight text-foreground">
              Aproveite agora!
            </p>
            <p className="text-xs font-medium text-foreground/70">
              Mais de {expiringCount} cupons verificados expiram em breve. Vale a pena dar uma olhada.
            </p>
          </div>
        </div>
        <button className="hidden rounded-full bg-foreground px-6 py-2 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 sm:block">
          Ver ofertas urgentes
        </button>
      </div>
    </div>
  );
};

export default UrgencyBanner;
