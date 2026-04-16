import { cn } from '@/lib/utils';

interface StoreIconProps {
  name: string;
  brandColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  logoUrl?: string | null;
}

export function getStoreInitials(name: string) {
  if (name.toLowerCase().includes('amazon')) return 'AMZ';
  if (name.toLowerCase().includes('shopee')) return 'SHP';
  if (name.toLowerCase().includes('mercado livre') || name.toLowerCase().includes('mercadolivre')) return 'ML';
  
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

const StoreIcon = ({ name, brandColor = '#94a3b8', size = 'md', className, logoUrl }: StoreIconProps) => {
  const initials = getStoreInitials(name);
  
  const sizeClasses = {
    sm: 'h-8 w-10 text-[10px]',
    md: 'h-10 w-14 text-xs',
    lg: 'h-14 w-20 text-base',
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-black shadow-sm transition-transform overflow-hidden",
        logoUrl ? "bg-white border border-black/5" : "text-white",
        sizeClasses[size],
        className
      )}
      style={!logoUrl ? { backgroundColor: brandColor } : undefined}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="h-full w-full object-contain p-1.5" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

};

export default StoreIcon;