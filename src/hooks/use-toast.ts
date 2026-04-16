import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant }: ToastOptions) {
  const message = title || '';
  if (variant === 'destructive') {
    sonnerToast.error(message, { description });
  } else {
    sonnerToast.success(message, { 
      description,
      style: {
        background: '#F5F3EF',
        border: '1px solid rgba(0,0,0,0.05)',
        color: '#2E7D32', // Verde escuro conforme guia
      }
    });
  }
}