import { cn } from '@/lib/utils';
import type { BlogCategory } from '@/hooks/useBlog';

interface Props {
  categories: BlogCategory[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

const BlogCategoryFilter = ({ categories, selected, onSelect }: Props) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
    <button
      onClick={() => onSelect(null)}
      className={cn(
        'shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all border',
        !selected
          ? 'bg-[#FF4D00] border-[#FF4D00] text-white shadow-md'
          : 'bg-white border-black/5 text-[#555] hover:bg-black/5'
      )}
    >
      Todos
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
        className={cn(
          'shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all border',
          selected === cat.slug
            ? 'text-white shadow-md border-transparent'
            : 'bg-white border-black/5 text-[#555] hover:bg-black/5'
        )}
        style={selected === cat.slug ? { backgroundColor: cat.color_hex } : undefined}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default BlogCategoryFilter;