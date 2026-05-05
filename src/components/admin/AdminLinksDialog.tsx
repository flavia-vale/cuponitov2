import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { usePredefinedLinks, useUpdatePredefinedLinks, type PredefinedLink } from '@/hooks/usePredefinedLinks';
import { Trash2, Plus, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { getErrorMessage } from '@/lib/errors';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stores: Tables<'stores'>[];
}

export function AdminLinksDialog({ open, onOpenChange, stores }: Props) {
  const { data: links = [] } = usePredefinedLinks();
  const updateMutation = useUpdatePredefinedLinks();
  const [newLink, setNewLink] = useState<Partial<PredefinedLink>>({
    name: '',
    url: '',
    store: ''
  });

  const handleAdd = async () => {
    if (!newLink.name || !newLink.url || !newLink.store) {
      toast.error('Preencha todos os campos do link');
      return;
    }

    const updatedLinks = [
      ...links,
      { ...newLink, id: crypto.randomUUID() } as PredefinedLink
    ];

    try {
      await updateMutation.mutateAsync(updatedLinks);
      setNewLink({ name: '', url: '', store: '' });
      toast.success('Link adicionado!');
    } catch (error) {
      toast.error(`Erro ao adicionar link: ${getErrorMessage(error)}`);
    }
  };

  const handleDelete = async (id: string) => {
    const updatedLinks = links.filter(l => l.id !== id);
    try {
      await updateMutation.mutateAsync(updatedLinks);
      toast.success('Link removido!');
    } catch (error) {
      toast.error(`Erro ao remover link: ${getErrorMessage(error)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" /> Links Pré-definidos
          </DialogTitle>
          <DialogDescription>
            Configure links de afiliados que podem ser reutilizados rapidamente ao criar novos cupons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-xl border border-border">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Nome do Link</label>
              <Input 
                placeholder="Ex: Geral Shopee" 
                value={newLink.name}
                onChange={e => setNewLink(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Loja</label>
              <Select 
                value={newLink.store} 
                onValueChange={val => setNewLink(p => ({ ...p, store: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">URL de Afiliado</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://..." 
                  value={newLink.url}
                  onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))}
                />
                <Button size="icon" onClick={handleAdd} disabled={updateMutation.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {links.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground italic">Nenhum link pré-definido cadastrado.</p>
            ) : (
              links.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{link.name}</span>
                    <span className="text-[10px] text-primary font-bold uppercase">{link.store}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[300px]">{link.url}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}