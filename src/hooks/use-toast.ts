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
    sonnerToast.success(message, { description });
  }
}
