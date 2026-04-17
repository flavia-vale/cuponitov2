import { useState, useEffect } from 'react';
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

  // Check if initial link matches any predefined link
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
        form.setValue('store', selected.store);
      }
    }
  };

  const onSubmit = async (values: CouponFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title || '',
        description: values.description || '',
        code: values.code || undefined,
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
        const { error } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Cupom atualizado!');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([payload]);

        if (error) throw error;
        toast.success('Cupom adicionado!');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20% de Desconto..." {...field} />
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
                <FormLabel>Desconto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20% OFF" {...field} />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes do cupom..." {...field} />
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
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: BEMVINDO20" {...field} />
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
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 31/12/2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Origem do Link</Label>
            <Select value={linkType} onValueChange={onLinkTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Digitar link manualmente</SelectItem>
                {predefinedLinks.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name} ({l.store})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Afiliado</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://..." 
                    {...field} 
                    readOnly={linkType !== 'manual'}
                    className={linkType !== 'manual' ? 'bg-muted opacity-70 cursor-not-allowed' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="store"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loja</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a loja" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Beleza">Beleza</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Viagens">Viagens</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Frete Grátis">Frete Grátis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 py-2 border-y border-border">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Ativo</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_flash"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Oferta Relâmpago</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}