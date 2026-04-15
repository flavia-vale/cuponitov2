import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';

interface FeaturedStoreCardProps {
  coupon: Coupon;
  storeBrand?: StoreBrand;
}

// Helper para pegar a sigla da loja
function getStoreInitials(name: string) {
  if (name.toLowerCase().includes('amazon')) return 'AMZ';
  if (name.toLowerCase().includes('shopee')) return 'SHP';
  if (name.toLowerCase().includes('mercado livre')) return 'ML';
  return name.slice(0, 3).toUpperCase();
}

const FeaturedStoreCard = ({ coupon, storeBrand }: FeaturedStoreCardProps) => {
  const brandColor = storeBrand?.brand_color || '#94a3b8'; // Fallback cinza padrão
  const initials = getStoreInitials(coupon.store);

  const handleOpen = () => {
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  return (
    <div className="group relative flex flex-col rounded-3xl border border-border bg-white p-5 transition-all hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        {/* Badge Sigla Loja */}
        <div 
          className="flex h-10 w-14 items-center justify-center rounded-xl font-black text-white"
          style={{ backgroundColor: brandColor }}
        >
          {initials}
        </div>

        {/* Badge Desconto Flutuante */}
        <div className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ff5200]">
          {coupon.discount || 'Oferta'}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-black text-foreground">{coupon.store}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {coupon.title}
        </p>
      </div>

      <Button 
        variant="outline" 
        onClick={handleOpen}
        className="mt-auto h-12 w-full rounded-2xl border-2 border-border font-bold text-foreground transition-all hover:bg-muted hover:text-foreground"
      >
        Pegar cupom
      </Button>
    </div>
  );
};

export default FeaturedStoreCard;