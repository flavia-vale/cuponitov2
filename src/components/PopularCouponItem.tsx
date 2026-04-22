import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';
import StoreIcon from './StoreIcon';

interface Props {
  coupon: Coupon;
  storeBrand?: StoreBrand;
}

const PopularCouponItem = ({ coupon, storeBrand }: Props) => {
  const [copied, setCopied] = useState(false);
  const brandColor = storeBrand?.brand_color || '#94a3b8';

  const handleAction = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({ title: 'Código copiado!', description: 'Use no carrinho para economizar.' });
      setTimeout(() => setCopied(false), 2000);
    }
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const hasCode = Boolean(coupon.code);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 sm:p-4 transition-all hover:shadow-md">
      <StoreIcon
        name={coupon.store}
        brandColor={brandColor}
        logoUrl={storeBrand?.logo_url}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-black text-foreground sm:text-base">
          {coupon.title}
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground/80 uppercase">
          {coupon.store}
        </p>
      </div>

      <button
        onClick={handleAction}
        className={cn(
          "flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl w-14 h-14 sm:w-16 sm:h-16 text-[10px] font-black uppercase transition-all active:scale-95",
          copied
            ? "bg-green-50 text-green-600 border border-green-300"
            : "bg-[#ff5200] text-white hover:bg-[#e04a00]"
        )}
      >
        {copied ? (
          <>
            <Check size={16} />
            <span>OK!</span>
          </>
        ) : (
          <>
            <ArrowRight size={16} />
            <span>{hasCode ? 'Copiar' : 'Ir'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PopularCouponItem;