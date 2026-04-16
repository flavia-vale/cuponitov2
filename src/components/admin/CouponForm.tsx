import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

const couponSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  code: z.string().optional().or(z.literal('')),
  discount: z.string().min(1, 'Desconto é obrigatório'),
  expiry: z.string().min(1, 'Validade é obrigatória'),
  link: z.string().url('Link inválido'),
  store: z.string().min(1, 'Loja é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
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

  const onSubmit = async (values: CouponFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        code: values.code || undefined,
        discount: values.discount,
        expiry: values.expiry,
        link: values.link,
        store: values.store,
        category: values.category,
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
        toast.success('Cupom atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([payload]);

        if (error) throw error;
        toast.success('Cupom adicionado com sucesso!');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error('Erro ao salvar cupom: ' + error.message);
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
                  <Input placeholder="Ex: 20% de Desconto em todo site" {...field} />
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
                <FormLabel>Desconto (Texto)</FormLabel>
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
                <Textarea placeholder="Descreva os detalhes do cupom..." {...field} />
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
                <FormLabel>Código (Opcional)</FormLabel>
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

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de Afiliado</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="store"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loja</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                  <p className="text-xs text-muted-foreground">O cupom ficará visível no site</p>
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
                  <p className="text-xs text-muted-foreground">Destaque especial para ofertas urgentes</p>
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
            {loading ? 'Salvando...' : initialData ? 'Atualizar Cupom' : 'Criar Cupom'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
