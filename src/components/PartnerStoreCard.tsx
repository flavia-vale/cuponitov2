import { Link } from '@tanstack/react-router';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  store: StoreBrand;
  couponCount: number;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
}

const PartnerStoreCard = ({ store, couponCount }: Props) => {
  const brandColor = store.brand_color || '#94a3b8';

  return (
    <Link
      to="/desconto/$slug"
      params={{ slug: store.slug }}
      className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-[#ff5200]/20"
    >
      <div 
        className="mb-3 flex h-12 w-14 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm transition-transform group-hover:scale-110"
        style={{ backgroundColor: brandColor }}
      >
        {store.logo_url ? (
          <img src={store.logo_url} alt="" className="h-8 w-8 object-contain brightness-0 invert" />
        ) : (
          getInitials(store.display_name)
        )}
      </div>
      <p className="text-sm font-bold text-foreground text-center line-clamp-1 group-hover:text-[#ff5200] transition-colors">
        {store.display_name}
      </p>
      <span className="mt-1 text-xs font-bold text-[#ff5200]/70">
        {couponCount} cupons
      </span>
    </Link>
  );
};

export default PartnerStoreCard;
