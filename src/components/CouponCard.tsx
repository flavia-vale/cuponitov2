import { useState, useMemo } from 'react';
import { Copy, ExternalLink, Clock, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Coupon } from '@/hooks/useCoupons';
import type { StoreBrand } from '@/lib/storeBranding';
import FlashBadge from '@/components/FlashBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const FALLBACK_COLOR = '#575ecf';
const FALLBACK_EMOJI = '🏷️';

function maskCode(code: string) {
  if (code.length <= 3) return code;
  return '•'.repeat(code.length - 3) + code.slice(-3);
}

interface CouponCardProps {
  coupon: Coupon;
  index?: number;
  storeBrand?: StoreBrand;
}

const CouponCard = ({ coupon, index = 0, storeBrand }: CouponCardProps) => {
  const brandColor = storeBrand?.brand_color || FALLBACK_COLOR;
  const emoji = storeBrand?.icon_emoji || FALLBACK_EMOJI;

  const [modalOpen, setModalOpen] = useState(false);

  const handleCopyAndGo = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: 'Código copiado!', description: coupon.code });
    }
    window.open(coupon.link, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
  };

  const handleCodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const socialProofCount = useMemo(() => Math.floor(Math.random() * 401) + 100, []);

  return (
    <>
      <a
        href={coupon.link}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        aria-label={`${coupon.discount} de desconto em ${coupon.store}: ${coupon.title}`}
        className={cn(
          'group flex flex-col rounded-2xl border-l-4 bg-card p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg opacity-0 animate-fade-in',
          coupon.is_flash && 'ring-2 ring-destructive/60'
        )}
        style={{
          borderLeftColor: brandColor,
          boxShadow: 'var(--shadow-card)',
          animationDelay: `${index * 80}ms`,
        }}
      >
        {coupon.is_flash && (
          <div className="mb-2">
            <FlashBadge />
          </div>
        )}

        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {emoji} {coupon.store}
          </span>
          <span className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary sm:text-sm">
            {coupon.discount}
          </span>
        </div>

        <h3 className="mb-1 text-base font-bold text-card-foreground leading-snug line-clamp-2 sm:text-lg">{coupon.title}</h3>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2 sm:text-sm">{coupon.description}</p>

        <div className="mt-auto flex items-center gap-2">
          {coupon.code ? (
            <button
              onClick={handleCodeClick}
              aria-label={`Mostrar código do cupom ${coupon.title}`}
              className="group/code relative flex items-center gap-1.5 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-mono font-bold text-primary transition hover:bg-primary/10 overflow-hidden sm:text-sm sm:px-3 sm:py-1.5 min-h-[36px]"
            >
              <span className="transition-opacity group-hover/code:opacity-0">
                {maskCode(coupon.code)}
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-1 text-xs font-sans opacity-0 transition-opacity group-hover/code:opacity-100">
                <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Mostrar
              </span>
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Sem código necessário</span>
          )}

          <span className="ml-auto flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition group-hover:scale-105 min-h-[36px] sm:px-4">
            Pegar Cupom <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          </span>
        </div>

        {coupon.expiry && (
          <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            Válido até {new Date(coupon.expiry).toLocaleDateString('pt-BR')}
          </div>
        )}

        <p className="mt-2 text-[11px] text-muted-foreground/70" aria-hidden="true">
          🔥 Código utilizado por {socialProofCount} pessoas nas últimas 2 horas
        </p>
      </a>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>{coupon.title}</DialogTitle>
            <DialogDescription>{coupon.discount} — {coupon.store}</DialogDescription>
          </DialogHeader>
          <div className="my-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-4 font-mono text-2xl font-bold text-primary tracking-wider">
            {coupon.code}
          </div>
          <button
            onClick={handleCopyAndGo}
            aria-label="Copiar código e ir para a loja"
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Copy className="h-4 w-4" aria-hidden="true" /> Copiar e ir para loja
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CouponCard;
