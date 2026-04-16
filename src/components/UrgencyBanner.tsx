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
      <div className="banner-urgency">
        <Zap className="h-4 w-4 fill-current" />
        <p>
          <span className="font-bold">{expiringTodayCount} cupons vencem hoje.</span> Não perca os melhores descontos!
        </p>
      </div>
    </div>
  );
};

export default UrgencyBanner;