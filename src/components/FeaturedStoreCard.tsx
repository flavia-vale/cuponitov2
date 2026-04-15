import StoreIcon from './StoreIcon';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';

interface FeaturedStoreCardProps {
  coupon: Coupon;
  storeBrand?: StoreBrand;
}

const FeaturedStoreCard = ({ coupon, storeBrand }: FeaturedStoreCardProps) => {
  const brandColor = storeBrand?.brand_color || '#94a3b8';

  const handleOpen = () => {
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  return (
    <div 
      onClick={handleOpen}
      className="group relative flex cursor-pointer flex-col rounded-3xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        {/* Usando o novo componente StoreIcon */}
        <StoreIcon 
          name={coupon.store} 
          brandColor={brandColor} 
          logoUrl={storeBrand?.logo_url} 
        />

        {/* Badge Desconto Flutuante - Visual Pêssego/Laranja */}
        <div className="rounded-full bg-orange-100/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600">
          {coupon.discount || 'Oferta'}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-black text-foreground group-hover:text-[#ff5200] transition-colors">
          {coupon.store}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground line-clamp-2">
          {coupon.title}
        </p>
      </div>

      <button 
        className="mt-auto h-12 w-full rounded-2xl border-2 border-border font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
      >
        Pegar cupom
      </button>
    </div>
  );
};

export default FeaturedStoreCard;