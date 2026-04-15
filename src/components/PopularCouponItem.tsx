import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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
  
  const handleCopy = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({ title: 'Código copiado!', description: 'Use no carrinho para economizar.' });
      window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Cálculo de usos realista baseado no ID
  const usageCount = (coupon.id.charCodeAt(0) * 15).toLocaleString('pt-BR');

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 sm:p-4 transition-all hover:shadow-md">
      {/* Usando o novo componente StoreIcon */}
      <StoreIcon 
        name={coupon.store} 
        brandColor={brandColor} 
        logoUrl={storeBrand?.logo_url}
        size="md"
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-black text-foreground sm:text-base">
          {coupon.title}
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground/80 uppercase">
          {coupon.description || 'Válido hoje'} • <span className="text-orange-600">Mín. R$30</span>
        </p>
      </div>

      {/* Box de Código Tracejado com Prova Social */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleCopy}
          className={cn(
            "group relative flex h-10 w-24 items-center justify-center rounded-xl border-2 border-dashed transition-all active:scale-95",
            copied 
              ? "border-green-500 bg-green-50 text-green-600" 
              : "border-[#ff5200]/40 bg-[#ff5200]/5 text-[#ff5200] hover:bg-[#ff5200]/10"
          )}
        >
          <span className="text-[11px] font-black tracking-wider uppercase">
            {copied ? 'COPIADO!' : (coupon.code || 'VER')}
          </span>
          <div className={cn(
            "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-white transition-all",
            copied ? "scale-100 bg-green-500" : "scale-0 bg-[#ff5200] group-hover:scale-100"
          )}>
            {copied ? <Check size={8} /> : <Copy size={8} />}
          </div>
        </button>
        <span className="text-[9px] font-black text-muted-foreground/60">
          {usageCount} usos
        </span>
      </div>
    </div>
  );
};

export default PopularCouponItem;