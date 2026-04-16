import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Save, Trash2, PlusCircle } from 'lucide-react';

interface CouponExtractorProps {
  stores: Tables<'stores'>[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface ExtractedCoupon {
  title: string;
  description: string;
  code: string;
  discount: string;
  expiry: string;
  link: string;
  store: string;
  category: string;
}

export function CouponExtractor({ stores, onSuccess, onCancel }: CouponExtractorProps) {
  const [rawText, setRawText] = useState('');
  const [extracted, setExtracted] = useState<ExtractedCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [defaultStore, setDefaultStore] = useState('');
  const [defaultCategory, setDefaultCategory] = useState('Geral');

  const extractCoupons = () => {
    if (!rawText.trim()) {
      toast.error('Insira algum texto para extrair');
      return;
    }

    // Simple extraction logic:
    // Try to find lines that look like a coupon.
    // Pattern example: "NOME DO CUPOM | CODIGO | DESCONTO | LINK"
    // Or just try to find lines with words like "CUPOM", "DESCONTO", "OFF"
    
    const lines = rawText.split('\n').filter(line => line.trim().length > 5);
    const results: ExtractedCoupon[] = [];

    lines.forEach(line => {
      // Very basic parser: Title (Code) Discount
      // If the line has a pipe or semicolon, split it
      const parts = line.split(/[|;]/).map(p => p.trim());
      
      if (parts.length >= 2) {
        results.push({
          title: parts[0],
          code: parts[1] || '',
          discount: parts[2] || 'Ver Oferta',
          description: parts[3] || parts[0],
          expiry: '31/12/2024',
          link: parts[4] || '',
          store: defaultStore,
          category: defaultCategory,
        });
      } else {
        // Try to find a code inside the text (uppercase words 3-15 chars)
        const codeMatch = line.match(/\b([A-Z0-0]{4,15})\b/);
        const discountMatch = line.match(/(\d+%\s*OFF|\d+\s*REAIS|R\$\s*\d+)/i);
        
        results.push({
          title: line.substring(0, 50),
          code: codeMatch ? codeMatch[1] : '',
          discount: discountMatch ? discountMatch[1] : 'Oferta',
          description: line,
          expiry: '31/12/2024',
          link: '',
          store: defaultStore,
          category: defaultCategory,
        });
      }
    });

    setExtracted(results);
    if (results.length > 0) {
      toast.success(`Extraídos ${results.length} potenciais cupons!`);
    } else {
      toast.info('Nenhum padrão claro encontrado, mas as linhas foram separadas.');
    }
  };

  const updateItem = (index: number, field: keyof ExtractedCoupon, value: string) => {
    const updated = [...extracted];
    updated[index] = { ...updated[index], [field]: value };
    setExtracted(updated);
  };

  const removeItem = (index: number) => {
    setExtracted(extracted.filter((_, i) => i !== index));
  };

  const saveAll = async () => {
    if (extracted.length === 0) return;
    
    setLoading(true);
    try {
      const validCoupons = extracted.filter(c => c.title && c.store);
      
      if (validCoupons.length === 0) {
        toast.error('Todos os cupons precisam de Título e Loja selecionada.');
        return;
      }

      const { error } = await supabase
        .from('coupons')
        .insert(validCoupons.map(c => ({
          ...c,
          status: true,
          is_flash: false,
          success_rate: 100
        })));

      if (error) throw error;
      
      toast.success(`${validCoupons.length} cupons salvos com sucesso!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving extracted coupons:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!extracted.length ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/5 p-4 text-sm text-primary">
            <p className="font-semibold">Como usar o Extrator:</p>
            <p>Cole uma lista de ofertas ou cupons. O sistema tentará identificar o título, código e desconto.</p>
            <p className="mt-2 opacity-70">Dica: Use o formato "Título | Código | Desconto" para melhores resultados.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loja Padrão</label>
              <Select onValueChange={setDefaultStore} value={defaultStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a loja" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.display_name}>
                      {store.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria Padrão</label>
              <Select onValueChange={setDefaultCategory} value={defaultCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Geral">Geral</SelectItem>
                  <SelectItem value="Moda">Moda</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Beleza">Beleza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            placeholder="Cole seu texto aqui..."
            className="min-h-[200px]"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button onClick={extractCoupons} className="gap-2">
              <Sparkles className="h-4 w-4" /> Extrair Cupons
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Cupons Extraídos ({extracted.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setExtracted([])}>
                Limpar e Voltar
              </Button>
              <Button size="sm" onClick={saveAll} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Todos'}
              </Button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-auto space-y-4 pr-2">
            {extracted.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Título</label>
                      <Input 
                        value={item.title} 
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        placeholder="Título do cupom"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Loja</label>
                      <Select
                        value={item.store}
                        onValueChange={(val) => updateItem(index, 'store', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Loja" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.display_name}>
                              {store.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Código</label>
                      <Input 
                        value={item.code} 
                        onChange={(e) => updateItem(index, 'code', e.target.value)}
                        placeholder="Cupom"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Desconto</label>
                      <Input 
                        value={item.discount} 
                        onChange={(e) => updateItem(index, 'discount', e.target.value)}
                        placeholder="Ex: 20% OFF"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Link</label>
                      <Input 
                        value={item.link} 
                        onChange={(e) => updateItem(index, 'link', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button variant="ghost" className="gap-2" onClick={() => setExtracted([...extracted, {
              title: '', code: '', discount: '', description: '', expiry: '31/12/2024', link: '', store: defaultStore, category: defaultCategory
            }])}>
              <PlusCircle className="h-4 w-4" /> Adicionar Manualmente
            </Button>
            <Button onClick={saveAll} disabled={loading} className="gap-2 min-w-[150px]">
              <Save className="h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Todos'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
