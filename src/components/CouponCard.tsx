import { useState } from 'react';
import { Copy, ExternalLink, Clock, Scissors } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const FALLBACK_COLOR = '#575ecf';

interface CouponCardProps {
  coupon: Coupon;
  index?: number;
  storeBrand?: StoreBrand;
}

const CouponCard = ({ coupon, index = 0, storeBrand }: CouponCardProps) => {
  const brandColor = storeBrand?.brand_color || FALLBACK_COLOR;
  const fallbackColor = storeBrand?.fallback_color || brandColor;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopyAndGo = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: 'Código copiado!', description: coupon.code });
    }
    // Implementação do item 2 do Plano: Segurança e Atributos de Afiliado
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
    setModalOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={cn(
          "group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-fade-in",
          coupon.is_flash && "ring-2 ring-destructive"
        )}
        style={{ 
          animationDelay: `${index * 50}ms`, 
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' 
        }}
      >
        {/* Header do Card com Cores Dinâmicas (Plano Item 4) */}
        <div 
          className="flex h-16 items-center justify-between px-4 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${brandColor}, ${fallbackColor})` 
          }}
        >
          <div className="flex items-center gap-2">
            {storeBrand?.logo_url ? (
              <img 
                src={storeBrand.logo_url} 
                alt={coupon.store} 
                className="h-8 w-8 rounded-lg bg-white p-1 object-contain" 
              />
            ) : (
              <span className="text-xl" role="img" aria-label="store icon">
                {storeBrand?.icon_emoji || '🏷️'}
              </span>
            )}
            <span className="text-xs font-bold uppercase tracking-wider">{coupon.store}</span>
          </div>
          <div className="text-lg font-black">{coupon.discount}</div>
        </div>

        {/* Divisor Visual Estilo Ticket */}
        <div className="relative flex items-center px-4">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-background" />
          <div className="w-full border-t-2 border-dashed border-border" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-background" />
        </div>

        {/* Conteúdo Principal */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 text-base font-bold text-foreground leading-tight line-clamp-2">
            {coupon.title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between gap-3">
            {coupon.code ? (
              <div className="flex-1 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 py-2 text-center font-mono text-sm font-bold text-primary">
                {coupon.code.slice(0, 3)}***
              </div>
            ) : (
              <div className="flex-1 text-xs font-semibold text-muted-foreground italic">Oferta Ativada</div>
            )}
            
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:scale-110"
              aria-label="Ver oferta"
            >
              <ExternalLink size={18} />
            </button>
          </div>
          
          {coupon.expiry && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <Clock size={10} /> Expira em: {new Date(coupon.expiry).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <DialogHeader className="items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black">{coupon.title}</DialogTitle>
            <DialogDescription className="text-base font-medium">
              Aproveite {coupon.discount} de desconto na {coupon.store}
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            {coupon.code ? (
              <div className="rounded-2xl border-2 border-dashed border-primary bg-primary/5 p-6 text-center font-mono text-3xl font-black tracking-[0.2em] text-primary">
                {coupon.code}
              </div>
            ) : (
              <div className="rounded-2xl bg-primary/10 p-6 text-center text-lg font-bold text-primary">
                🎉 Desconto aplicado automaticamente!
              </div>
            )}

            <Button
              onClick={handleCopyAndGo}
              className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            >
              <Copy className="mr-2 h-5 w-5" />
              {coupon.code ? 'Copiar e Ir para Loja' : 'Pegar Desconto'}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Você será redirecionado para a loja parceira com segurança.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CouponCard;