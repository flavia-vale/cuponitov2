import { Sparkles, ShoppingCart, Tag, Percent, Gift, Zap, Star } from 'lucide-react';

const FloatingIcon = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={`absolute text-white/10 pointer-events-none hidden md:block ${className}`} aria-hidden="true">
    {children}
  </div>
);

function getMonthYear() {
  const now = new Date();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${now.getFullYear()}`;
}

const HeroBanner = () => {
  const monthYear = getMonthYear();

  return (
    <section className="relative overflow-hidden py-12 md:py-16 px-4 bg-slate-900">
      {/* Removendo elementos do Header */}
      <FloatingIcon className="top-8 left-[8%] animate-bounce [animation-duration:3s]">
        <ShoppingCart size={40} />
      </FloatingIcon>
      <FloatingIcon className="top-16 right-[10%] animate-bounce [animation-duration:4s] [animation-delay:0.5s]">
        <Tag size={36} />
      </FloatingIcon>
      <FloatingIcon className="bottom-20 left-[12%] animate-bounce [animation-duration:3.5s] [animation-delay:1s]">
        <Percent size={32} />
      </FloatingIcon>
      <FloatingIcon className="top-1/3 left-[25%] animate-bounce [animation-duration:4.5s] [animation-delay:0.3s]">
        <Gift size={28} />
      </FloatingIcon>
      <FloatingIcon className="bottom-16 right-[15%] animate-bounce [animation-duration:3.2s] [animation-delay:0.7s]">
        <Zap size={34} />
      </FloatingIcon>
      <FloatingIcon className="top-12 left-[45%] animate-bounce [animation-duration:5s] [animation-delay:1.2s]">
        <Star size={26} />
      </FloatingIcon>

      <div className="absolute top-10 right-[20%] h-20 w-20 rounded-2xl border-2 border-white/5 rotate-12 hidden md:block" aria-hidden="true" />
      <div className="absolute bottom-12 left-[18%] h-16 w-16 rounded-full border-2 border-white/5 hidden md:block" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-3 md:mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white backdrop-blur-sm">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-amber-300" aria-hidden="true" />
          🔥 Códigos promocionais atualizados!
        </div>

        <h1 className="mb-3 md:mb-4 text-2xl font-bold text-foreground md:text-5xl lg:text-6xl leading-tight">
          Cupons de Desconto{' '}
          <span className="relative inline-block">
            <span className="relative z-10">{monthYear}</span>
            <span className="absolute -bottom-0.5 left-0 right-0 h-2.5 bg-white/15 rounded-full -rotate-1" aria-hidden="true" />
          </span>
          {' '}🎯
        </h1>

        <p className="mb-2 text-base font-medium text-white/70 md:text-xl">
          Amazon, Shopee e Mercado Livre
        </p>

        <p className="mx-auto mb-4 md:mb-6 max-w-xl text-xs text-white/60 md:text-sm leading-relaxed">
          Encontre o <strong className="text-white/80">melhor cupom de desconto</strong> e <strong className="text-white/80">código promocional</strong> válido para as maiores lojas online do Brasil.
        </p>

        <a
          href="https://chat.whatsapp.com/KxLjSgr9xBi87F4zQxaT4C"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-sm font-bold text-white transition-colors shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 md:h-6 md:w-6 shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-center leading-tight">Receba os cupons<br/>em tempo real pelo WhatsApp</span>
        </a>
      </div>
    </section>
  );
};

export default HeroBanner;