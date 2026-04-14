import { cn } from '@/lib/utils';
import type { BlogCategory } from '@/hooks/useBlog';

interface Props {
  categories: BlogCategory[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

const BlogCategoryFilter = ({ categories, selected, onSelect }: Props) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    <button
      onClick={() => onSelect(null)}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm',
        !selected
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      )}
    >
      Todos
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
        className={cn(
          'rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm',
          selected === cat.slug
            ? 'text-white shadow-md'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        )}
        style={selected === cat.slug ? { backgroundColor: cat.color_hex } : undefined}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default BlogCategoryFilter;
