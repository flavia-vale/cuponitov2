import { useState } from 'react';
import { Copy, ExternalLink, CheckCircle2, Zap, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props {
  coupon: Tables<'coupons'>;
  storeBrand?: StoreBrand;
}

const CouponCard = ({ coupon, storeBrand }: Props) => {
  const isExpiring = coupon.expiry && new Date(coupon.expiry).toDateString() === new Date().toDateString();
  const usageCount = Math.floor(Math.random() * 500) + 50;

  const copyAndGo = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: 'Cupom copiado!', description: 'Agora é só colar no carrinho.' });
    }
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all hover:shadow-lg">
      <div className="flex flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-black/5 p-2">
              {storeBrand?.logo_url ? (
                <img src={storeBrand.logo_url} alt={coupon.store} className="h-full w-full object-contain" />
              ) : (
                <span className="text-2xl">{storeBrand?.icon_emoji || '🏷️'}</span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-primary tracking-wider">{coupon.store}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-green-600 flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> verificado hoje
                </span>
              </div>
            </div>
          </div>
          
          {isExpiring && (
            <span className="flex items-center gap-1 rounded-full bg-alert-bg px-2 py-1 text-[10px] font-bold text-alert-text border border-alert-border">
              <Clock size={10} /> Vence hoje
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
          {coupon.title}
        </h3>

        <div className="mt-4 space-y-3">
          {/* Código Visível (Princípio UI/UX) */}
          {coupon.code ? (
            <button 
              onClick={copyAndGo}
              className="coupon-code w-full flex items-center justify-between group/code transition-colors hover:border-primary"
            >
              <span className="font-mono text-base uppercase tracking-widest">{coupon.code}</span>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                Copiar <Copy size={12} />
              </div>
            </button>
          ) : (
            <div className="text-xs font-medium text-text-gray italic">Oferta ativada pelo link</div>
          )}

          <button 
            onClick={copyAndGo}
            className="btn-primary w-full shadow-lg shadow-primary/10"
          >
            Pegar cupom
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-text-gray/60">
            <Zap size={10} className="text-accent fill-accent" />
            <span>Usado {usageCount} vezes hoje</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;