import { useState } from 'react';
import { Check, Eye, Clock, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn, isExpired } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';
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
  isExpired?: boolean;
}

export default function StoreCouponCard({ coupon, isExpired: isExpiredProp = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isCode = !!coupon.code;
  const expired = isExpiredProp || isExpired(coupon.expiry);
  
  const isVerified = !expired && !!coupon.expiry;
  const isExpiring = coupon.expiry && !expired && (new Date(coupon.expiry).getTime() - new Date().getTime() < 48 * 60 * 60 * 1000);
  const usageCount = Math.floor(Math.random() * 2000) + 100;

  const maskCode = (code: string | null) => {
    if (!code) return '';
    if (code.length <= 3) return code.slice(0, 1) + '***';
    return code.slice(0, 3) + '***';
  };

  const handleAction = () => {
    if (isCode) {
      navigator.clipboard.writeText(coupon.code || '');
      setCopied(true);
      toast({ title: 'Cupom copiado!', description: 'Agora é só colar no carrinho.' });
      setTimeout(() => setCopied(false), 2000);
    }
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  return (
    <>
      <div className={cn(
        "coupon-card group bg-white border border-[#e8e5e0] rounded-[14px] overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(255,77,0,0.08)] hover:border-[#FFB090]",
        expired && "opacity-55 grayscale-[0.5]"
      )}>
        <div className="coupon-card-inner flex flex-col sm:flex-row">
          <div className={cn(
            "coupon-accent w-full h-1.5 sm:w-[6px] sm:h-auto shrink-0",
            !isCode ? "bg-[#2E7D32]" : "bg-[#FF4D00]",
            coupon.category === 'Frete Grátis' && "bg-[#1565C0]",
            expired && "bg-gray-400"
          )} />

          <div className="coupon-body flex-1 p-4 sm:p-[14px_16px]">
            <div className="coupon-top flex flex-col sm:flex-row items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="coupon-badges flex flex-wrap gap-[5px] mb-1.5">
                  {expired ? (
                    <span className="coupon-type-badge bg-[#f0f0f0] text-[#999] py-0.5 px-2 rounded-lg text-[10px] font-bold">Expirado</span>
                  ) : (
                    <>
                      <span className={cn(
                        "coupon-type-badge py-0.5 px-2 rounded-lg text-[10px] font-bold",
                        isCode ? "badge-code bg-[#FFF0EB] text-[#FF4D00]" : "badge-offer bg-[#EAF3DE] text-[#2E7D32]"
                      )}>
                        {isCode ? 'Código' : 'Oferta'}
                      </span>
                      {isVerified && (
                        <span className="coupon-type-badge bg-green-100 text-green-700 py-0.5 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck size={10} /> Verificado
                        </span>
                      )}
                    </>
                  )}
                </div>
                <h3 className="coupon-title text-sm font-bold text-[#1a1a1a] leading-tight mb-1 break-words">
                  {coupon.title}
                </h3>
                <p className="coupon-desc text-xs text-[#666] line-clamp-2 leading-relaxed mb-2.5">
                  {coupon.description}
                </p>
              </div>
              
              <div className={cn(
                "coupon-discount text-xl sm:text-[22px] font-black shrink-0 leading-none",
                !isCode ? "text-[#2E7D32]" : "text-[#FF4D00]",
                expired && "text-gray-400"
              )}>
                {coupon.discount}
              </div>
            </div>

            <div className="coupon-meta flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[11px] text-[#aaa]">
              <span className="coupon-meta-item flex items-center gap-1 valid text-[#2E7D32] font-semibold">
                ✓ Verificado hoje
              </span>
              {isExpiring && (
                <span className="coupon-meta-item flex items-center gap-1 text-[#E65100] font-bold">
                  ⏰ Vence em breve
                </span>
              )}
            </div>
          </div>

          <div className="coupon-action p-4 sm:p-[12px_16px_12px_0] flex flex-col items-center sm:items-end justify-center gap-2 sm:min-w-[180px]">
            {isCode ? (
              <div className="w-full space-y-2">
                <div 
                  onClick={() => setIsOpen(true)}
                  className="code-box flex items-center justify-between gap-0 border-2 border-dashed border-[#FF4D00] rounded-xl overflow-hidden group/code transition-colors hover:border-[#FF4D00]/70 cursor-pointer"
                >
                  <span className="code-text flex-1 font-mono text-sm font-bold text-[#FF4D00] py-2 px-2 text-center bg-[#FFF0EB] uppercase tracking-widest">
                    {maskCode(coupon.code)}
                  </span>
                  <div className="bg-[#FF4D00] h-full px-3 flex items-center justify-center py-2">
                    <Eye size={16} className="text-white" />
                  </div>
                </div>
                <button 
                  onClick={handleAction}
                  className="go-btn w-full border-[1.5px] border-[#FF4D00] text-[#FF4D00] font-bold py-2.5 rounded-lg text-xs hover:bg-[#FF4D00] hover:text-white transition-all"
                >
                  Copiar e ir à loja ↗
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAction}
                className="activate-btn w-full bg-[#FF4D00] hover:bg-[#D83C00] text-white font-bold py-3rounded-lg text-xs transition-all"
              >
                Aproveitar oferta ↗
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md text-center p-6 sm:p-8">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-xl font-bold">Cupom {coupon.store}</DialogTitle>
            <DialogDescription className="text-sm font-medium pt-1">
              {coupon.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div className="relative group">
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#FF4D00] bg-[#FFF0EB] p-5">
                <span className="font-mono text-2xl font-black uppercase tracking-widest text-[#FF4D00] break-all">
                  {coupon.code}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Copie o código e cole no carrinho de compras.</p>
            </div>

            <Button 
              onClick={handleAction}
              className="w-full h-14 text-base font-bold rounded-xl bg-[#FF4D00] hover:bg-[#D83C00] text-white shadow-xl shadow-orange-500/20"
            >
              {copied ? 'Copiado!' : 'Copiar e ir à loja'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}