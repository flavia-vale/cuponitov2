import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface InlineCouponConfig {
  code?: string;
  title?: string;
  description?: string;
  button_text?: string;
  url?: string;
  store_slug?: string;
  store_name?: string;
  discount?: string;
  logo_url?: string;
}

interface Props {
  config: InlineCouponConfig;
}

export function InlineCouponBox({ config }: Props) {
  const [copied, setCopied] = useState(false);
  const {
    code,
    title = 'Cupom exclusivo',
    description,
    button_text = 'Copiar e ir',
    url,
    store_slug,
    store_name = 'Loja Parceira',
    discount,
    logo_url,
  } = config;

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Código copiado!', description: 'Cole no carrinho para economizar.' });
      setTimeout(() => setCopied(false), 2500);
    }
    if (url) window.open(url, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  const initials = store_name.slice(0, 3).toUpperCase();

  return (
    <aside
      aria-label={`Cupom de desconto ${store_name}`}
      className="not-prose my-8 overflow-hidden rounded-2xl border-2 border-[#FFCAB0] bg-gradient-to-br from-[#FFF8F5] to-white shadow-md"
    >
      {/* header */}
      <div className="flex items-center gap-3 border-b border-[#FFCAB0]/60 bg-[#FFF3EE] px-5 py-3">
        {logo_url ? (
          <img src={logo_url} alt={store_name} className="h-9 w-9 rounded-xl object-contain border border-black/10 bg-white shadow-sm p-0.5" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/10 font-black text-primary text-[10px] uppercase shadow-sm tracking-wider">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#888]">{store_name}</p>
          <p className="truncate text-sm font-black text-[#1a1a1a]">{title}</p>
        </div>
        {discount && (
          <span className="shrink-0 rounded-lg bg-primary px-2.5 py-1 text-xs font-black text-white">
            {discount}
          </span>
        )}
      </div>

      {/* body */}
      <div className="space-y-4 p-5">
        {code ? (
          <div
            onClick={handleCopy}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed border-primary bg-white py-3 px-4 transition hover:bg-[#FFF0EB]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
          >
            <span className="font-mono text-lg font-black tracking-widest text-primary uppercase">
              {code}
            </span>
            <span className={cn('flex items-center gap-1 text-xs font-bold transition-colors', copied ? 'text-green-600' : 'text-primary/60 group-hover:text-primary')}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </span>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-white py-3 px-4 text-center">
            <span className="text-sm font-bold text-[#999]">Desconto aplicado automaticamente</span>
          </div>
        )}

        <button
          onClick={handleCopy}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black uppercase transition-all active:scale-95 shadow-lg shadow-primary/20',
            copied ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-primary text-white hover:bg-[#D83C00]'
          )}
        >
          <ExternalLink size={15} />
          {copied ? 'Abrindo...' : button_text}
        </button>

        {description && (
          <p className="text-center text-[11px] font-medium text-[#aaa]">{description}</p>
        )}
      </div>

      {/* footer link to store */}
      {store_slug && (
        <div className="border-t border-[#FFCAB0]/60 bg-[#FFF3EE] px-5 py-2.5 text-center">
          <Link
            to="/desconto/$slug"
            params={{ slug: store_slug }}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Ver todos os cupons de {store_name} →
          </Link>
        </div>
      )}
    </aside>
  );
}

export default InlineCouponBox;
