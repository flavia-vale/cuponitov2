import { useState } from 'react';
import { useOffers, useDeleteOffer } from '@/hooks/useOffers';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Trash2, ExternalLink, Copy, CheckCircle2, ArrowRightLeft 
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminOffersTab() {
  const { data: offers = [], isLoading } = useOffers();
  const deleteMutation = useDeleteOffer();
  const [search, setSearch] = useState('');

  const filtered = offers.filter(o => 
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.store_name?.toLowerCase().includes(search.toLowerCase())
  );

  const convertToCoupon = async (offer: any) => {
    try {
      const { error } = await supabase.from('coupons').insert([{
        title: offer.title,
        description: offer.description || '',
        code: offer.code,
        discount: offer.discount || '',
        link: offer.link,
        store: offer.store_name || 'Geral',
        category: offer.code ? 'Geral' : 'Ofertas no link',
        status: true,
        expiry: offer.expiry ? new Date(offer.expiry).toLocaleDateString('pt-BR') : ''
      }]);

      if (error) throw error;
      toast.success('Oferta convertida em cupom com sucesso! ✨');
    } catch (error: any) {
      toast.error('Erro ao converter: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ofertas da API (Awin)</h2>
          <p className="text-muted-foreground">Visualize os dados brutos importados das integrações.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar ofertas importadas..."
          className="border-0 bg-transparent shadow-none focus-within:ring-0 focus-visible:ring-0 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Loja / Origem</TableHead>
              <TableHead className="w-[350px]">Título da Oferta</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">Carregando ofertas...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">Nenhuma oferta encontrada na API.</TableCell></TableRow>
            ) : (
              filtered.map((offer) => (
                <TableRow key={offer.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit">{offer.store_name}</Badge>
                      <span className="text-[10px] text-muted-foreground mt-1">ID: {offer.publisher_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold line-clamp-1">{offer.title}</span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{offer.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {offer.code ? (
                      <code className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-xs font-bold">{offer.code}</code>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Link Direto</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-green-600">
                    {offer.discount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Converter em Cupom"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => convertToCoupon(offer)}
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={offer.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(offer.id)}
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
    </div>
  );
}