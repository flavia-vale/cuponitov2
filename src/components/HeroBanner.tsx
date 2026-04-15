import { Check } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const { data: settings } = useSettings();

  const heroContent = settings?.hero_content || {
    hero_title: "Economize em cada compra",
    hero_subtitle: "+3.000 cupons verificados todos os dias"
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ff5200] to-[#ff7e4b] px-4 pt-10 pb-16 text-white md:pt-14 md:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          {heroContent.hero_title}
        </h1>
        <p className="mb-10 text-base font-medium text-white/90 md:text-xl">
          {heroContent.hero_subtitle}
        </p>

        {/* Barra de Busca Integrada - Premium Polish */}
        <div className="relative mx-auto mb-8 max-w-2xl">
          <div className="group flex items-center gap-2 rounded-full bg-white p-1.5 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-white/20">
            <Input 
              placeholder="Buscar loja ou cupom..." 
              className="h-12 border-none bg-transparent pl-5 text-foreground focus-visible:ring-0 placeholder:text-muted-foreground/60 text-base md:text-lg"
            />
            <Button className="h-12 rounded-full bg-slate-900 px-8 font-bold text-white hover:bg-slate-800 transition-all active:scale-95">
              Buscar
            </Button>
          </div>
        </div>

        {/* Badges de Confiança */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            { label: 'Verificados', active: true },
            { label: '100% grátis', active: true },
            { label: 'Atualizados hoje', active: true }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold md:text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white/90">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;