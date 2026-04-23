import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-card-foreground">Acesso Negado</h1>
        <p className="text-sm text-muted-foreground">
          Você não possui permissão para acessar esta área.
        </p>
        <Button
          onClick={() => navigate({ to: '/admin/login' })}
          className="w-full"
        >
          Voltar ao Login
        </Button>
      </div>
    </div>
  );
}
