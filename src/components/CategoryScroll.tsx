import { useState } from 'react';
import { Flame, Shirt, Smartphone, Pizza, Plane, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, any> = {
  'Moda': Shirt,
  'Tech': Smartphone,
  'Delivery': Pizza,
  'Viagens': Plane,
  'Beleza': Sparkles,
};

interface Props {
  onSelect?: (category: string | null) => void;
  availableCategories?: string[];
}

const CategoryScroll = ({ onSelect, availableCategories }: Props) => {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string | null) => {
    const next = active === id ? null : id;
    setActive(next);
    onSelect?.(next);
  };

  const categories = [
    { id: null, label: 'Em alta', icon: Flame },
    ...(availableCategories || []).map(cat => ({
      id: cat,
      label: cat,
      icon: CATEGORY_ICONS[cat] || Sparkles
    }))
  ];

  return (
    <section id="categorias" className="mx-auto max-w-6xl px-4 py-6 scroll-mt-20">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">Categorias</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={String(cat.id)}
              onClick={() => handleClick(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all snap-start",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-black/5 text-text-gray hover:bg-black/5"
              )}
            >
              <cat.icon size={18} className={isActive ? "text-white" : "text-text-gray"} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryScroll;