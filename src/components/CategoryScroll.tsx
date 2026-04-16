import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: '🔥 Tudo', slug: '/' },
  { id: 'eletronicos', name: '💻 Eletrônicos', slug: 'eletronicos' },
  { id: 'moda', name: '👕 Moda', slug: 'moda' },
  { id: 'beleza', name: '💄 Beleza', slug: 'beleza' },
  { id: 'casa', name: '🏠 Casa', slug: 'casa' },
  { id: 'viagens', name: '✈️ Viagens', slug: 'viagens' },
  { id: 'esportes', name: '⚽ Esportes', slug: 'esportes' },
  { id: 'alimentos', name: '🍕 Alimentos', slug: 'alimentos' },
];

export default function CategoryScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-4">
      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-opacity opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft size={16} />
        </button>

        <div 
          ref={scrollRef}
          className="flex w-full gap-2 overflow-x-auto scrollbar-none snap-x"
        >
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all snap-start ${
                i === 0 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border border-black/5 text-text-gray hover:border-primary/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-opacity opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
