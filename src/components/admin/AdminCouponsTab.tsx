import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { CouponForm } from './CouponForm';
import { CouponExtractor } from './CouponExtractor';
import { AdminLinksDialog } from './AdminLinksDialog';
import { AwinTestPanel } from './AwinTestPanel';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export function AdminCouponsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Tables<'coupons'> | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: stores = [] } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stores').select('*').order('display_name');
      if (error) throw error;
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Cupom excluído com sucesso!');
      setDeletingCouponId(null);
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    }
  });

  const filteredCoupons = coupons.filter(coupon => 
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (coupon.code && coupon.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (coupon: Tables<'coupons'>) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    handleCloseForm();
    setIsExtractorOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Cupons</h2>
          <p className="text-muted-foreground">Adicione, edite ou remova cupons e ofertas do site.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => setIsLinksOpen(true)}
          >
            <ExternalLink className="h-4 w-4" /> Links Pré-definidos
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => setIsExtractorOpen(true)}
          >
            <Sparkles className="h-4 w-4" /> Extrator Inteligente
          </Button>
          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Cupom
          </Button>
        </div>
      </div>

      <AwinTestPanel />

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, loja ou código..."
          className="border-0 bg-transparent shadow-none focus-within:ring-0 focus-visible:ring-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Cupom / Oferta</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Relâmpago</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">Carregando...</TableCell>
              </TableRow>
            ) : filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">Nenhum cupom encontrado.</TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span className="line-clamp-1">{coupon.title}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">{coupon.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{coupon.store}</Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.code ? (
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">{coupon.code}</code>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Link Direto</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.status ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 border-0">
                        <CheckCircle2 className="h-3 w-3" /> Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 border-0">
                        <XCircle className="h-3 w-3" /> Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {coupon.is_flash ? (
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 border-0">
                          <Zap className="h-3 w-3 fill-amber-500" /> Sim
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Não</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {coupon.expiry}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={coupon.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeletingCouponId(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {editingCoupon ? 'atualizar' : 'criar'} a oferta.
            </DialogDescription>
          </DialogHeader>
          <CouponForm 
            initialData={editingCoupon || undefined} 
            stores={stores}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isExtractorOpen} onOpenChange={setIsExtractorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Extrator Inteligente
            </DialogTitle>
            <DialogDescription>
              Cole blocos de texto ou listas de ofertas para extrair múltiplos cupons rapidamente.
            </DialogDescription>
          </DialogHeader>
          <CouponExtractor
            stores={stores}
            onSuccess={handleSuccess}
            onCancel={() => setIsExtractorOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AdminLinksDialog
        open={isLinksOpen}
        onOpenChange={setIsLinksOpen}
        stores={stores}
      />

      <AlertDialog open={!!deletingCouponId} onOpenChange={(open) => !open && setDeletingCouponId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cupom será permanentemente removido dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingCouponId && deleteMutation.mutate(deletingCouponId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}