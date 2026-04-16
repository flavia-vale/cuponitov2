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
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">Categorias</h2>
      {/* Container com Scroll Snap */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all snap-start",
              cat.active 
                ? "bg-[#ff5200] text-white shadow-lg shadow-orange-500/20" 
                : "bg-white border border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            <cat.icon size={18} className={cat.active ? "fill-white/20" : "text-muted-foreground"} />
            {cat.label}
          </button>
        ))}
      </div>
      {/* Indicador de scroll visualmente refinado */}
      <div className="h-1.5 w-full max-w-[120px] rounded-full bg-muted/30 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-[#ff5200]/40" />
      </div>
    </section>
  );
};

export default CategoryScroll;