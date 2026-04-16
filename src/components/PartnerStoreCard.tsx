import { Link } from '@tanstack/react-router';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  store: StoreBrand;
  couponCount: number;
}

export default function PartnerStoreCard({ store, couponCount }: Props) {
  return (
    <Link 
      to="/desconto/$slug" 
      params={{ slug: store.slug }}
      className="group flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white p-6 transition-all hover:border-primary/20 hover:shadow-sm"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-black/5 p-3 transition-transform group-hover:scale-110">
        {store.logo_url ? (
          <img src={store.logo_url} alt={store.display_name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-3xl">{store.icon_emoji}</span>
        )}
      </div>
      
      <h3 className="text-center text-sm font-bold text-foreground">
        {store.display_name}
      </h3>
      
      <p className="mt-1 text-[10px] font-bold text-primary uppercase">
        {couponCount} {couponCount === 1 ? 'cupom' : 'cupons'}
      </p>
    </Link>
  );
}
