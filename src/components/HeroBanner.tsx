import { Sparkles, ShoppingCart, Tag, Percent, Gift, Zap, Star } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { getMonthYear } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const FloatingIcon = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={`absolute text-white/10 pointer-events-none hidden md:block ${className}`} aria-hidden="true">
    {children}
  </div>
);

const HeroBanner = () => {
  const { data: settings, isLoading } = useSettings();
  const monthYear = getMonthYear();

  if (isLoading || !settings) {
    return <div className="h-[400px] w-full bg-slate-900 animate-pulse" />;
  }

  const { title, subtitle, description, button_text } = settings.hero_content;
  const whatsappLink = settings.global_links.whatsapp_group;
  const dynamicTitle = title.replace('{month_year}', monthYear);

  return (
    <section className="relative overflow-hidden py-12 md:py-20 px-4 bg-slate-950">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,90,255,0.15),transparent_70%)]" />
      
      <FloatingIcon className="top-8 left-[8%] animate-bounce [animation-duration:3s]">
        <ShoppingCart size={40} />
      </FloatingIcon>
      <FloatingIcon className="top-16 right-[10%] animate-bounce [animation-duration:4s] [animation-delay:0.5s]">
        <Tag size={36} />
      </FloatingIcon>
      <FloatingIcon className="bottom-20 left-[12%] animate-bounce [animation-duration:3.5s] [animation-delay:1s]">
        <Percent size={32} />
      </FloatingIcon>
      <FloatingIcon className="bottom-16 right-[15%] animate-bounce [animation-duration:3.2s] [animation-delay:0.7s]">
        <Zap size={34} />
      </FloatingIcon>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Cupons Verificados Hoje
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-extrabold text-white md:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
          {dynamicTitle.split(' ').map((word, i) => (
            <span key={i} className={word.includes('{') ? 'text-primary' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-white/70 md:text-xl leading-relaxed">
          {subtitle} — <span className="text-white/90">{description}</span>
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-center leading-tight">{button_text}</span>
          </a>
          
          <a 
            href="#lojas" 
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Explorar Lojas
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;