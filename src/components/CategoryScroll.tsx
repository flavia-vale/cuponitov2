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
      <h2 className="mb-4 text-lg font-bold text-foreground">Categorias</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all",
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
      {/* Scroll indicator bar stylized from image */}
      <div className="h-2 w-full max-w-[300px] rounded-full bg-muted/30 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-muted-foreground/20" />
      </div>
    </section>
  );
};

export default CategoryScroll;