import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';

const UrgencyBanner = () => {
  const { data: coupons } = useCoupons();

  const expiringTodayCount = useMemo(() => {
    if (!coupons) return 0;
    const today = new Date().toISOString().split('T')[0];
    return coupons.filter(c => c.expiry === today && c.status).length;
  }, [coupons]);

  if (expiringTodayCount === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 text-sm font-medium text-yellow-800">
        <Zap className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        <p>
          <span className="font-bold">{expiringTodayCount} cupons vencem hoje.</span> Não perca os melhores descontos!
        </p>
      </div>
    </div>
  );
};

export default UrgencyBanner;