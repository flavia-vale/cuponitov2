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
    
    const lines = rawText.split('\n').filter(line => line.trim().length > 1);
    const results: ExtractedCoupon[] = [];

    lines.forEach(line => {
      const parts = line.split(/[|;]/).map(p => p.trim());
      
      if (parts.length >= 2) {
        results.push({
          title: parts[0] || '',
          code: parts[1] || '',
          discount: parts[2] || '',
          description: parts[3] || parts[0] || '',
          expiry: '31/12/2024',
          link: parts[4] || '',
          store: defaultStore,
          category: defaultCategory,
        });
      } else {
        const codeMatch = line.match(/\b([A-Z0-0]{4,15})\b/);
        const discountMatch = line.match(/(\d+%\s*OFF|\d+\s*REAIS|R\$\s*\d+)/i);
        
        results.push({
          title: line.substring(0, 50),
          code: codeMatch ? codeMatch[1] : '',
          discount: discountMatch ? discountMatch[1] : '',
          description: line,
          expiry: '31/12/2024',
          link: '',
          store: defaultStore,
          category: defaultCategory,
        });
      }
    });

    setExtracted(results);
    toast.success(`Extraídos ${results.length} potenciais cupons!`);
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
      const { error } = await supabase
        .from('coupons')
        .insert(extracted.map(c => ({
          ...c,
          title: c.title || 'Sem título',
          store: c.store || 'Geral',
          status: true,
          is_flash: false,
          success_rate: 100
        })));

      if (error) throw error;
      
      toast.success(`${extracted.length} cupons salvos!`);
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loja Padrão</label>
              <Select onValueChange={setDefaultStore} value={defaultStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Opcional" />
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
                  <SelectValue placeholder="Geral" />
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
              <Sparkles className="h-4 w-4" /> Extrair
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Revisar ({extracted.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setExtracted([])}>Voltar</Button>
              <Button size="sm" onClick={saveAll} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Todos'}</Button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-auto space-y-4 pr-2">
            {extracted.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      value={item.title} 
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Título"
                    />
                    <Select value={item.store} onValueChange={(val) => updateItem(index, 'store', val)}>
                      <SelectTrigger><SelectValue placeholder="Loja" /></SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.display_name}>{store.display_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input value={item.code} onChange={(e) => updateItem(index, 'code', e.target.value)} placeholder="Código" />
                    <Input value={item.discount} onChange={(e) => updateItem(index, 'discount', e.target.value)} placeholder="Desconto" />
                    <Input value={item.link} onChange={(e) => updateItem(index, 'link', e.target.value)} placeholder="Link" />
                    <Button variant="ghost" size="icon" className="ml-auto text-destructive" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4" /></Button>
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
              <Save className="h-4 w-4" /> Salvar Todos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}