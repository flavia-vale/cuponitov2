import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  coupon: Coupon;
  storeBrand?: StoreBrand;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
}

const PopularCouponItem = ({ coupon, storeBrand }: Props) => {
  const brandColor = storeBrand?.brand_color || '#94a3b8'; // Fallback cinza padrão
  
  const handleCopy = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: 'Código copiado!', description: 'Use no carrinho para economizar.' });
      window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
    }
  };

  const usageCount = (coupon.id.charCodeAt(0) * 15).toLocaleString('pt-BR');

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-all hover:shadow-md">
      {/* Logo da Loja com Cor Dinâmica */}
      <div 
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
        style={{ backgroundColor: brandColor }}
      >
        {storeBrand?.logo_url ? (
          <img src={storeBrand.logo_url} alt="" className="h-8 w-8 object-contain brightness-0 invert" />
        ) : (
          getInitials(coupon.store)
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{coupon.store}</p>
        <h3 className="truncate text-base font-bold text-foreground">{coupon.title}</h3>
        <p className="text-[10px] text-muted-foreground font-medium">
          {coupon.description || 'Válido em toda a loja'} • Vence hoje
        </p>
      </div>

      {/* Box de Código */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleCopy}
          className="group relative flex h-10 w-24 items-center justify-center rounded-lg border-2 border-dashed border-[#ff5200]/40 bg-[#ff5200]/5 px-2 text-xs font-black tracking-wider text-[#ff5200] transition-colors hover:bg-[#ff5200]/10"
        >
          {coupon.code || 'OFERTA'}
          <div className="absolute -right-2 -top-2 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-[#ff5200] text-white transition-transform group-hover:scale-100">
            <Copy size={10} />
          </div>
        </button>
        <span className="text-[10px] font-medium text-muted-foreground/70">
          {usageCount} usos
        </span>
      </div>
    </div>
  );
};

export default PopularCouponItem;