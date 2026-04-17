import { Check, Search } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-[#FF4D00] px-4 pt-10 pb-16 text-white md:pt-14 md:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
          {heroContent.hero_title}
        </h1>
        <p className="mb-8 text-base font-medium text-white/90 md:text-xl">
          {heroContent.hero_subtitle}
        </p>

        {/* Busca Prioritária */}
        <div className="relative mx-auto mb-8 max-w-2xl">
          <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-xl">
            <div className="flex flex-1 items-center px-4">
              <Search className="h-5 w-5 text-text-gray/40" />
              <Input 
                placeholder="Qual loja você procura hoje?" 
                className="h-12 border-0 bg-transparent shadow-none text-foreground focus-visible:ring-0 placeholder:text-text-gray/40 text-base"
              />
            </div>
            <Button className="h-12 rounded-full bg-[#1A1A1A] px-8 font-bold text-white hover:bg-black transition-all min-h-[48px]">
              Buscar
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {['Verificados hoje', '100% gratuito', 'Economia real'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold md:text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white/90">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;