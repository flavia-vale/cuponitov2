import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { usePredefinedLinks } from '@/hooks/usePredefinedLinks';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

const couponSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  code: z.string().optional().or(z.literal('')),
  discount: z.string().optional().or(z.literal('')),
  expiry: z.string().optional().or(z.literal('')),
  link: z.string().optional().or(z.literal('')),
  store: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  status: z.boolean(),
  is_flash: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  initialData?: Tables<'coupons'>;
  stores: Tables<'stores'>[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function CouponForm({ initialData, stores, onSuccess, onCancel }: CouponFormProps) {
  const [loading, setLoading] = useState(false);
  const { data: predefinedLinks = [] } = usePredefinedLinks();
  const [linkType, setLinkType] = useState<'manual' | string>('manual');

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      code: initialData?.code || '',
      discount: initialData?.discount || '',
      expiry: initialData?.expiry || '',
      link: initialData?.link || '',
      store: initialData?.store || '',
      category: initialData?.category || '',
      status: initialData?.status ?? true,
      is_flash: initialData?.is_flash ?? false,
    },
  });

  const selectedStore = form.watch('store');

  // Filtra os links pré-definidos com base na loja selecionada
  const filteredLinks = useMemo(() => {
    if (!selectedStore) return [];
    return predefinedLinks.filter(l => l.store === selectedStore);
  }, [predefinedLinks, selectedStore]);

  useEffect(() => {
    if (initialData?.link) {
      const match = predefinedLinks.find(l => l.url === initialData.link);
      if (match) setLinkType(match.id);
    }
  }, [initialData, predefinedLinks]);

  const onLinkTypeChange = (val: string) => {
    setLinkType(val);
    if (val === 'manual') {
      if (linkType !== 'manual') form.setValue('link', '');
    } else {
      const selected = predefinedLinks.find(l => l.id === val);
      if (selected) {
        form.setValue('link', selected.url);
        // Não alteramos a loja aqui pois o filtro já garante que é a mesma
      }
    }
  };

  const onSubmit = async (values: CouponFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title || '',
        description: values.description || '',
        code: (values.code || null) as any,
        discount: values.discount || '',
        expiry: values.expiry || '',
        link: values.link || '',
        store: values.store || 'Geral',
        category: values.category || 'Geral',
        status: values.status,
        is_flash: values.is_flash,
        updated_at: new Date().toISOString(),
      };

      if (initialData) {
        const { error } = await supabase.from('coupons').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast.success('Cupom atualizado!');
      } else {
        const { error } = await supabase.from('coupons').insert([payload]);
        if (error) throw error;
        toast.success('Cupom adicionado!');
      }
      onSuccess();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20% de Desconto..." {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Desconto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20% OFF" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes do cupom..." {...field} className="min-h-[80px] resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: BEMVINDO20" {...field} className="h-11 font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Validade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 31/12/2024" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Loja e Categoria agora vêm antes dos links */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="store"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Loja</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Selecione a loja" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border-border shadow-xl z-50">
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.display_name}>
                        {store.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border-border shadow-xl z-50">
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Beleza">Beleza</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Viagens">Viagens</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Frete Grátis">Frete Grátis</SelectItem>
                    <SelectItem value="Ofertas no link">Ofertas no link</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Origem do Link</Label>
            <Select 
              value={linkType} 
              onValueChange={onLinkTypeChange}
              disabled={!selectedStore}
            >
              <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder={selectedStore ? "Selecione a origem" : "Selecione uma loja primeiro"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-border shadow-xl z-50">
                <SelectItem value="manual">Digitar link manualmente</SelectItem>
                {filteredLinks.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Link de Afiliado</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://..." 
                    {...field} 
                    readOnly={linkType !== 'manual'}
                    className={`h-11 ${linkType !== 'manual' ? 'bg-muted/50 cursor-not-allowed' : 'bg-white'}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 py-4 border-y border-border/50">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <FormLabel className="text-sm font-semibold">Cupom Ativo</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_flash"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <FormLabel className="text-sm font-semibold">Oferta Relâmpago</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="h-11 px-8">
            {loading ? 'Salvando...' : initialData ? 'Atualizar Cupom' : 'Criar Cupom'}
          </Button>
        </div>
      </form>
    </Form>
  );
}