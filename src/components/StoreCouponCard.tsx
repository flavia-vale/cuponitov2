import { useState } from 'react';
import { Copy, ExternalLink, CheckCircle2, Clock, Users, ShieldCheck, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

export default function StoreCouponCard({ coupon, isExpired = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isCode = !!coupon.code;
  const isExpiring = coupon.expiry && new Date(coupon.expiry).toDateString() === new Date().toDateString();
  const usageCount = Math.floor(Math.random() * 2000) + 100;

  const maskCode = (code: string | null) => {
    if (!code) return '';
    if (code.length <= 3) return code.slice(0, 1) + '***';
    return code.slice(0, 3) + '***';
  };

  const handleAction = () => {
    if (isCode) {
      navigator.clipboard.writeText(coupon.code || '');
      toast({ title: 'Cupom copiado!', description: 'Agora é só colar no carrinho.' });
    }
    window.open(coupon.link, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const handleReveal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className={cn(
        "coupon-card group",
        isExpired && "opacity-60 grayscale-[0.5]"
      )}>
        <div className="coupon-card-inner flex flex-col sm:flex-row">
          {/* Faixa lateral colorida */}
          <div className={cn(
            "coupon-accent w-full h-1.5 sm:w-1.5 sm:h-auto shrink-0",
            !isCode ? "bg-[#2E7D32]" : "bg-[#FF4D00]",
            coupon.category === 'Frete Grátis' && "bg-[#1565C0]",
            isExpired && "bg-gray-400"
          )} />

          <div className="coupon-body flex-1 p-4 sm:p-5">
            <div className="coupon-top flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="coupon-badges flex flex-wrap gap-2 mb-2">
                  {isExpired ? (
                    <span className="coupon-type-badge bg-gray-100 text-gray-500 py-0.5 px-2 rounded-lg text-[10px] font-bold">Expirado</span>
                  ) : (
                    <>
                      <span className={cn(
                        "coupon-type-badge py-0.5 px-2 rounded-lg text-[10px] font-bold",
                        isCode ? "bg-[#FFF0EB] text-[#FF4D00]" : "bg-[#EAF3DE] text-[#2E7D32]"
                      )}>
                        {isCode ? 'Código' : 'Oferta'}
                      </span>
                      {coupon.is_flash && (
                        <span className="coupon-type-badge bg-[#FFF8E1] text-[#F57F17] py-0.5 px-2 rounded-lg text-[10px] font-bold uppercase">
                          Relâmpago
                        </span>
                      )}
                    </>
                  )}
                </div>
                <h3 className="coupon-title text-[15px] font-bold text-[#1a1a1a] leading-tight mb-1 group-hover:text-[#FF4D00] transition-colors">
                  {coupon.title}
                </h3>
                <p className="coupon-desc text-xs text-[#555] line-clamp-2 leading-relaxed">
                  {coupon.description}
                </p>
              </div>
              
              <div className={cn(
                "coupon-discount text-xl sm:text-2xl font-black shrink-0",
                !isCode ? "text-[#2E7D32]" : "text-[#FF4D00]",
                coupon.category === 'Frete Grátis' && "text-[#1565C0]",
                isExpired && "text-gray-400"
              )}>
                {coupon.discount}
              </div>
            </div>

            <div className="coupon-meta flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#aaa]">
              <span className="coupon-meta-item flex items-center gap-1 valid text-[#2E7D32] font-semibold">
                <CheckCircle2 size={12} /> Verificado hoje
              </span>
              {isExpiring && (
                <span className="coupon-meta-item flex items-center gap-1 text-[#E65100] font-bold uppercase">
                  <Clock size={12} /> Vence hoje
                </span>
              )}
              <span className="coupon-meta-item flex items-center gap-1">
                <Users size={12} /> {usageCount} usos
              </span>
              {coupon.category && (
                <span className="coupon-meta-item flex items-center gap-1 uppercase font-bold tracking-wider">
                  {coupon.category}
                </span>
              )}
            </div>
          </div>

          {/* Área de ação lateral */}
          <div className="coupon-action p-4 sm:p-5 sm:pl-0 flex flex-col items-center sm:items-end justify-center gap-3 sm:min-w-[200px] border-t sm:border-t-0 border-black/5">
            {isCode ? (
              <div className="w-full space-y-2">
                <div 
                  onClick={handleReveal}
                  className="code-box flex items-center justify-between gap-0 border-2 border-dashed border-[#FF4D00] rounded-xl overflow-hidden group/code transition-colors hover:border-[#FF4D00]/70 cursor-pointer"
                >
                  <span className="code-text flex-1 font-mono text-sm font-bold text-[#FF4D00] py-2.5 px-3 text-center bg-[#FFF0EB] uppercase tracking-widest">
                    {maskCode(coupon.code)}
                  </span>
                  <div className="bg-[#FF4D00] h-full px-3 flex items-center justify-center">
                    <Eye size={16} className="text-white" />
                  </div>
                </div>
                <button 
                  onClick={handleReveal}
                  className="go-btn w-full border-2 border-[#FF4D00] text-[#FF4D00] font-bold py-2 rounded-xl text-xs hover:bg-[#FF4D00] hover:text-white transition-all"
                >
                  Ver código e ir à loja ↗
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <button 
                  onClick={handleAction}
                  className="activate-btn w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-[#2E7D32]/10"
                >
                  Aproveitar oferta ↗
                </button>
                <div className="text-[10px] text-center text-[#aaa] font-medium">
                  Desconto aplicado no link
                </div>
              </div>
            )}
            <div className="uses-count text-[10px] text-[#aaa] text-center w-full">
              {usageCount} pessoas usaram hoje
            </div>
          </div>
        </div>
        
        {/* Como funciona (expansível no hover em desktop) */}
        <div className="coupon-how bg-[#f9f7f4] border-t border-[#e8e5e0] p-3 hidden sm:group-hover:block transition-all animate-in slide-in-from-top-1 duration-200">
          <p className="text-[11px] text-[#888] leading-relaxed flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#2E7D32]" />
            Como usar: {isCode ? "Clique em 'Ver código' para revelar o cupom, copiar e ser redirecionado para a loja." : "Clique no botão para ativar a oferta e ser redirecionado para a página com o desconto já aplicado."}
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-xl font-bold">Cupom {coupon.store}</DialogTitle>
            <DialogDescription className="text-sm font-medium pt-1">
              {coupon.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <div className="relative group">
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#FF4D00] bg-[#FFF0EB] p-5">
                <span className="font-mono text-2xl font-black uppercase tracking-widest text-[#FF4D00]">
                  {coupon.code}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Copie o código e cole no carrinho de compras.</p>
            </div>

            <Button 
              onClick={handleAction}
              className="w-full h-14 text-base font-bold rounded-xl bg-[#FF4D00] hover:bg-[#D83C00] text-white shadow-xl shadow-orange-500/20"
            >
              Copiar e ir à loja
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}