import { Flame, Shirt, Smartphone, Pizza, Plane, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'trending', label: 'Em alta', icon: Flame, active: true },
  { id: 'fashion', label: 'Moda', icon: Shirt, active: false },
  { id: 'tech', label: 'Tech', icon: Smartphone, active: false },
  { id: 'delivery', label: 'Delivery', icon: Pizza, active: false },
  { id: 'travel', label: 'Viagens', icon: Plane, active: false },
  { id: 'beauty', label: 'Beleza', icon: Sparkles, active: false },
];

const CategoryScroll = () => {
  return (
    <section id="categorias" className="mx-auto max-w-6xl px-4 py-6 scroll-mt-20">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">Categorias</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all snap-start",
              cat.active 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white border border-black/5 text-text-gray hover:bg-black/5"
            )}
          >
            <cat.icon size={18} className={cat.active ? "text-white" : "text-text-gray"} />
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryScroll;