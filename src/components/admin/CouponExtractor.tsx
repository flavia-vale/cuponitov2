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
import { Sparkles, Save, Trash2, PlusCircle, Wand2 } from 'lucide-react';

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
  expiry_text: string;
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
  const [detectedLink, setDetectedLink] = useState('');

  const extractCoupons = () => {
    if (!rawText.trim()) {
      toast.error('Insira algum texto para extrair');
      return;
    }
    
    const results: ExtractedCoupon[] = [];
    let detectedStore = defaultStore;
    const lowerText = rawText.toLowerCase();
    
    for (const store of stores) {
      if (lowerText.includes(store.name.toLowerCase()) ||
          lowerText.includes(store.slug.toLowerCase())) {
        detectedStore = store.name;
        break;
      }
    }

    const discountRegex = /(?:R\$\s*\d+(?:,\d+)?|\d+%\s*)\s*OFF/gi;
    const codeRegex = /(?:cupom|🎟\s*cupom|⚠️\s*cupom):\s*([A-Z0-9]+)/i;
    const linkRegex = /https?:\/\/[^\s]+/gi;
    
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const hasMultipleTickets = (rawText.match(/🎟/g) || []).length > 1;
    const currentGlobalLink = rawText.match(linkRegex)?.[0] || '';
    setDetectedLink(currentGlobalLink);

    if (hasMultipleTickets) {
      lines.forEach(line => {
        if (line.includes('🎟') || line.includes('OFF')) {
          const discountMatch = line.match(discountRegex);
          const codeMatch = line.match(codeRegex);
          
          if (discountMatch) {
            const code = codeMatch ? codeMatch[1] : '';
            results.push({
              title: line.replace(/🎟/g, '').trim(),
              code: code,
              discount: discountMatch[0],
              description: line,
              expiry_text: '31/12/2025',
              link: currentGlobalLink,
              store: detectedStore,
              category: code ? defaultCategory : 'Ofertas no link',
            });
          }
        }
      });
    } else {
      const allDiscounts = [...rawText.matchAll(discountRegex)];
      const codeMatch = rawText.match(codeRegex);
      const linkMatch = rawText.match(linkRegex);
      
      if (allDiscounts.length > 0) {
        const mainDiscount = allDiscounts[0][0];
        let title = mainDiscount;
        const discountLineIndex = lines.findIndex(l => l.includes(mainDiscount));
        if (discountLineIndex !== -1) {
          title = lines[discountLineIndex];
        }

        const code = codeMatch ? codeMatch[1] : '';

        results.push({
          title: title,
          code: code,
          discount: mainDiscount,
          description: lines.slice(0, 4).join(' '),
          expiry_text: '31/12/2025',
          link: linkMatch ? linkMatch[0] : '',
          store: detectedStore,
          category: code ? defaultCategory : 'Ofertas no link',
        });
      }
    }

    if (results.length === 0) {
      const codeMatch = rawText.match(/\b([A-Z0-9]{5,20})\b/);
      if (codeMatch) {
        results.push({
          title: 'Cupom Extraído',
          code: codeMatch[1],
          discount: '',
          description: rawText.substring(0, 100),
          expiry_text: '31/12/2025',
          link: currentGlobalLink,
          store: detectedStore,
          category: defaultCategory,
        });
      }
    }

    if (results.length === 0) {
      toast.error('Não consegui identificar os dados. Tente colar um formato mais padrão.');
    } else {
      setExtracted(results);
      toast.success(`${results.length} cupons identificados com sucesso! ✨`);
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
      const couponsToInsert = extracted.map(c => ({
        title: c.title || 'Oferta Especial',
        code: (c.code === 'Oferta no link' || !c.code) ? null : c.code,
        discount: c.discount,
        description: c.description,
        link: c.link,
        store: c.store || 'Geral',
        category: c.category || 'Geral',
        status: true,
        is_flash: false,
        expiry_text: c.expiry_text,
        success_rate: 100
      })) as any[];

      const { error } = await supabase
        .from('coupons')
        .insert(couponsToInsert);

      if (error) throw error;
      
      toast.success(`${extracted.length} cupons publicados com sucesso!`);
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
          <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
            <p className="text-xs text-primary font-medium flex items-center gap-2 mb-2">
              <Wand2 className="h-3 w-3" /> Dica do Cuponito
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cole textos do WhatsApp ou Telegram. O sistema identifica automaticamente a loja, o valor do desconto e o código do cupom.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loja (Se não detectada)</label>
              <Select onValueChange={setDefaultStore} value={defaultStore}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.name}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select onValueChange={setDefaultCategory} value={defaultCategory}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Geral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Geral">Geral</SelectItem>
                  <SelectItem value="Moda">Moda</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Beleza">Beleza</SelectItem>
                  <SelectItem value="Ofertas no link">Ofertas no link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            placeholder="Cole o texto aqui... Ex: 'CUPOM AMAZON 10% OFF: PAISDOFUT'"
            className="min-h-[250px] rounded-2xl border-dashed border-2 focus-visible:ring-primary/20"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onCancel} className="rounded-xl">Cancelar</Button>
            <Button onClick={extractCoupons} className="gap-2 rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" /> Inteligência Artificial: Extrair
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Cupons Identificados</h3>
              <p className="text-xs text-muted-foreground">Revise os dados antes de publicar.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setExtracted([])} className="rounded-lg">Limpar</Button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-auto space-y-4 pr-2">
            {extracted.map((item, index) => (
              <Card key={index} className="overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Título</label>
                          <Input 
                            value={item.title} 
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            className="h-9 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Loja</label>
                          <Select value={item.store} onValueChange={(val) => updateItem(index, 'store', val)}>
                            <SelectTrigger className="h-9 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {stores.map((store) => (
                                <SelectItem key={store.id} value={store.name}>{store.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Código</label>
                          <Input value={item.code} onChange={(e) => updateItem(index, 'code', e.target.value)} className="h-9 rounded-lg font-mono text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Desconto</label>
                          <Input value={item.discount} onChange={(e) => updateItem(index, 'discount', e.target.value)} className="h-9 rounded-lg text-xs" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Link</label>
                          <Input value={item.link} onChange={(e) => updateItem(index, 'link', e.target.value)} className="h-9 rounded-lg text-xs" />
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-border">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setExtracted([...extracted, {
              title: '', code: '', discount: '', description: '', expiry_text: '31/12/2025', link: detectedLink, store: defaultStore, category: defaultCategory
            }])}>
              <PlusCircle className="h-4 w-4" /> Adicionar Outro
            </Button>
            <Button onClick={saveAll} disabled={loading} className="gap-2 rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
              {loading ? 'Publicando...' : (
                <>
                  <Save className="h-4 w-4" /> Publicar {extracted.length} {extracted.length === 1 ? 'Cupom' : 'Cupons'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}