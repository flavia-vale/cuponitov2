import { Link } from '@tanstack/react-router';
import { ExternalLink, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CtaConfig {
  title?: string;
  description?: string;
  button_text?: string;
  url?: string;
  store_slug?: string;
  color?: string;
  code?: string;
  store_name?: string;
}

interface Props {
  config: CtaConfig;
}

const BlogCtaBanner = ({ config }: Props) => {
  const [copied, setCopied] = useState(false);
  const {
    title = 'Confira os melhores cupons!',
    description = 'Válido por tempo limitado.',
    button_text = 'Copiar e ir',
    url,
    store_slug,
    code = 'CUPONITO',
    store_name = 'Loja Parceira'
  } = config;

  const handleAction = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Código copiado!', description: 'Use no carrinho para economizar.' });
      setTimeout(() => setCopied(false), 2000);
    }
    if (url) window.open(url, '_blank', 'nofollow sponsored noopener noreferrer');
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-[#FFCAB0] bg-[#FFF8F5] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 font-black text-primary text-[10px] uppercase shadow-sm">
          {store_name.slice(0, 3)}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase text-[#888] tracking-wider">{store_name}</p>
          <h4 className="text-sm font-black text-[#1a1a1a]">{title}</h4>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full bg-white border-2 border-dashed border-primary rounded-xl py-3 px-4 text-center font-mono text-lg font-black text-primary tracking-widest uppercase">
          {code}
        </div>
        <button 
          onClick={handleAction}
          className={cn(
            "w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs uppercase transition-all active:scale-95 shadow-lg",
            copied ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
          )}
        >
          {copied ? 'Copiado!' : button_text}
        </button>
      </div>
      
      <p className="mt-3 text-center text-[10px] font-medium text-[#aaa]">{description}</p>
    </div>
  );
};

export default BlogCtaBanner;