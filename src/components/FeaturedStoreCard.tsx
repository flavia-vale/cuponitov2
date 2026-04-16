import { Link } from '@tanstack/react-router';
import { ExternalLink, CheckCircle2, Zap } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  coupon: Tables<'coupons'>;
  storeBrand?: StoreBrand;
}

export default function FeaturedStoreCard({ coupon, storeBrand }: Props) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        {coupon.is_flash && (
          <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-foreground shadow-sm">
            <Zap size={12} className="fill-foreground" /> RELÂMPAGO
          </div>
        )}
        <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-green-600 backdrop-blur-sm">
          <CheckCircle2 size={12} /> VERIFICADO
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted-orange p-8 flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-4 shadow-xl ring-4 ring-white/50 transition-transform group-hover:scale-110">
          {storeBrand?.logo_url ? (
            <img src={storeBrand.logo_url} alt={coupon.store} className="h-full w-full object-contain" />
          ) : (
            <span className="text-4xl">{storeBrand?.icon_emoji || '🏷️'}</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-bold text-primary">{coupon.store}</span>
          <span className="h-1 w-1 rounded-full bg-text-gray/20" />
          <span className="text-xs font-medium text-text-gray">{coupon.category}</span>
        </div>
        
        <h3 className="mb-4 line-clamp-2 text-lg font-bold leading-tight text-foreground">
          {coupon.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray/60">DESCONTO</span>
            <span className="text-xl font-black text-primary">{coupon.discount || 'OFERTA'}</span>
          </div>
          
          <a 
            href={coupon.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-8"
          >
            Pegar cupom
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
