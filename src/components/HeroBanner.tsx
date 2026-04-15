import { Sparkles, ShoppingCart, Tag, Percent, Zap } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { getMonthYear } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const HeroBanner = () => {
  const { data: settings, isLoading } = useSettings();
  const monthYear = getMonthYear();

  if (isLoading || !settings) {
    return <div className="h-[300px] w-full bg-muted animate-pulse rounded-b-[3rem]" />;
  }

  const { title, subtitle, description, button_text } = settings.hero_content;
  const whatsappLink = settings.global_links.whatsapp_group;
  const dynamicTitle = title.replace('{month_year}', monthYear);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary to-accent pt-8 pb-16 md:pt-16 md:pb-24 px-4 rounded-b-[2rem] md:rounded-b-[4rem] shadow-2xl">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 rotate-12"><ShoppingCart size={80} /></div>
        <div className="absolute bottom-10 right-10 -rotate-12"><Tag size={100} /></div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-20"><Percent size={150} /></div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center text-white">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Ofertas atualizadas em {monthYear}</span>
        </div>

        <h1 className="mb-6 text-4xl font-extrabold md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          {dynamicTitle}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl font-medium text-white/90">
          {subtitle} — <span className="opacity-80">{description}</span>
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-primary font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="h-5 w-5 fill-primary" />
            {button_text}
          </a>
          
          <a 
            href="#lojas" 
            className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-white font-bold backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Ver Lojas Parceiras
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;