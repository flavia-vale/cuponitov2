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
  return (
    <Link
      to="/desconto/$slug"
      params={{ slug: store.slug }}
      className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div 
        className="mb-3 flex h-12 w-14 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm"
        style={{ backgroundColor: store.brand_color }}
      >
        {getInitials(store.display_name)}
      </div>
      <p className="text-sm font-bold text-foreground text-center line-clamp-1">
        {store.display_name}
      </p>
      <span className="mt-1 text-xs font-bold text-[#ff5200]">
        {couponCount} cupons
      </span>
    </Link>
  );
};

export default PartnerStoreCard;