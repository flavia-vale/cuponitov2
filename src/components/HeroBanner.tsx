import { Check } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

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