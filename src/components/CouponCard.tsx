import { useState, useMemo } from 'react';
import { Copy, ExternalLink, CheckCircle2, Zap, Clock, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';
import type { StoreBrand } from '@/lib/storeBranding';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  coupon: Tables<'coupons'>;
  storeBrand?: StoreBrand;
}

const CouponCard = ({ coupon, storeBrand }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const isExpiring = coupon.expiry && new Date(coupon.expiry).toDateString() === new Date().toDateString();
  const usageCount = useMemo(() => {
    const hash = coupon.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return (hash % 451) + 50;
  }, [coupon.id]);

  const maskCode = (code: string | null) => {
    if (!code) return '';
    if (code.length <= 3) return code.slice(0, 1) + '***';
    return code.slice(0, 3) + '***';
  };

  const copyAndGo = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: 'Cupom copiado!', description: 'Agora é só colar no carrinho.' });
    }
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all hover:shadow-lg">
        <div className="flex flex-col p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-black/5 p-2">
                {storeBrand?.logo_url ? (
                  <img src={storeBrand.logo_url} alt={`Logo da loja ${coupon.store}`} loading="lazy" className="h-full w-full object-contain" />
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
            {coupon.code ? (
              <div 
                className="coupon-code w-full flex items-center justify-between group/code transition-colors hover:border-primary cursor-pointer"
                onClick={handleReveal}
              >
                <span className="font-mono text-base uppercase tracking-widest">{maskCode(coupon.code)}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
                  Ver código <Eye size={12} />
                </div>
              </div>
            ) : (
              <div className="text-xs font-medium text-text-gray italic h-[46px] flex items-center">Oferta ativada pelo link</div>
            )}

            <button 
              onClick={copyAndGo}
              className="btn-primary w-full shadow-lg shadow-primary/20"
            >
              {coupon.code ? 'Copiar e ir para a loja' : 'Aproveitar oferta'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-text-gray/60">
              <Zap size={10} className="text-accent fill-accent" />
              <span>Usado {usageCount} vezes hoje</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md text-center p-6 sm:p-8">
          <DialogHeader className="flex flex-col items-center">
            <div className="h-16 w-16 mb-4 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {storeBrand?.logo_url ? (
                <img src={storeBrand.logo_url} alt={`Logo da loja ${coupon.store}`} loading="lazy" className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-3xl">{storeBrand?.icon_emoji || '🏷️'}</span>
              )}
            </div>
            <DialogTitle className="text-xl font-bold">Cupom {coupon.store}</DialogTitle>
            <DialogDescription className="text-sm font-medium pt-1">
              {coupon.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div className="relative group">
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/5 p-5">
                <span className="font-mono text-2xl font-black uppercase tracking-widest text-primary break-all">
                  {coupon.code}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Copie o código e cole no carrinho de compras.</p>
            </div>

            <Button 
              onClick={copyAndGo}
              className="w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20"
            >
              Copiar e ir à loja
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CouponCard;