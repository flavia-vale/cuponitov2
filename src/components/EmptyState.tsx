import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'Nenhum cupom encontrado' }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <SearchX className="h-7 w-7 text-muted-foreground" />
    </div>
    <p className="text-base font-medium text-muted-foreground">{message} 😕</p>
    <p className="text-sm text-muted-foreground/70">Tente outra busca ou volte mais tarde.</p>
  </div>
);

export default EmptyState;
