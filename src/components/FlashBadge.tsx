import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const messages = ['🚨 CUPOM RELÂMPAGO', '⏳ ÚLTIMOS MINUTOS'];

interface FlashBadgeProps {
  className?: string;
}

const FlashBadge = ({ className }: FlashBadgeProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground animate-pulse',
        className
      )}
    >
      {messages[index]}
    </span>
  );
};

export default FlashBadge;
