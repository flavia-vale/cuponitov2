import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Check, Search } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data: settings } = useSettings();

  const heroContent = settings?.hero_content;
  const title = heroContent?.hero_title || "Economize em cada compra";
  const subtitle = heroContent?.hero_subtitle || "+3.000 cupons verificados todos os dias";
  const badges = [
    heroContent?.trust_badge_1 || "Verificados hoje",
    heroContent?.trust_badge_2 || "100% gratuito",
    heroContent?.trust_badge_3 || "Economia real",
  ].filter(Boolean);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;

    navigate({ 
      to: '/cupons', 
      search: { q: term } 
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#FF4D00] px-4 pt-10 pb-16 text-white md:pt-14 md:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
          {title}
        </h1>
        <p className="mb-8 text-base font-medium text-white/90 md:text-xl">
          {subtitle}
        </p>

        {/* Barra de Busca Principal */}
        <div className="mx-auto mb-10 max-w-2xl">
          <form 
            onSubmit={handleSearch} 
            className="relative flex items-center rounded-2xl bg-white p-1.5 shadow-2xl shadow-black/20"
          >
            <Search className="ml-4 h-5 w-5 text-[#aaa] shrink-0" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qual loja você está procurando?"
              className="border-0 bg-transparent text-lg text-[#1a1a1a] shadow-none focus-visible:ring-0 placeholder:text-[#aaa]"
            />
            <Button 
              type="submit"
              className="hidden sm:flex rounded-xl bg-[#FF4D00] px-8 font-black text-white hover:bg-[#D83C00] h-12"
            >
              Buscar
            </Button>
            <Button 
              type="submit"
              size="icon"
              className="sm:hidden rounded-xl bg-[#FF4D00] h-12 w-12 shrink-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {badges.map((item, i) => (
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