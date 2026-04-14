import { cn } from '@/lib/utils';

const stores = [
  { key: 'all', label: 'Todos', color: 'bg-primary text-primary-foreground' },
  { key: 'Amazon', label: 'Amazon', color: 'bg-amazon text-amazon-foreground' },
  { key: 'Shopee', label: 'Shopee', color: 'bg-shopee text-shopee-foreground' },
  { key: 'Mercado Livre', label: 'Mercado Livre', color: 'bg-mercadolivre text-mercadolivre-foreground' },
];

interface StoreFilterProps {
  active: string;
  onChange: (store: string) => void;
}

const StoreFilter = ({ active, onChange }: StoreFilterProps) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:gap-3">
    {stores.map((s) => (
      <button
        key={s.key}
        onClick={() => onChange(s.key)}
        className={cn(
          'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm min-h-[40px]',
          active === s.key
            ? `${s.color} scale-105 shadow-md`
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        {s.label}
      </button>
    ))}
  </div>
);

export default StoreFilter;
