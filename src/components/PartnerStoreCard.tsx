import { Link } from '@tanstack/react-router';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  store: StoreBrand;
  couponCount: number;
}

const PartnerStoreCard = ({ store, couponCount }: Props) => {
  return (
    <Link
      to="/desconto/$slug"
      params={{ slug: store.slug }}
      className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-[#ff5200]/20"
    >
      <div
        className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-black/5 p-2 overflow-hidden transition-transform group-hover:scale-110"
      >
        {store.logo_url ? (
          <img
            src={store.logo_url}
            alt={`Logo oficial da loja ${store.name}`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-3xl" style={{ color: store.brand_color }}>{store.icon_emoji}</span>
        )}
      </div>

      <p className="text-sm font-bold text-foreground text-center line-clamp-1 group-hover:text-[#ff5200] transition-colors">
        {store.name}
      </p>
      <span className="mt-1 text-xs font-bold text-[#ff5200]/70">
        {couponCount} cupons
      </span>
    </Link>
  );
};

export default PartnerStoreCard;