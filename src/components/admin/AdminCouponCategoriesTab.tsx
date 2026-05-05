import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCouponCategories, type CouponCategory } from '@/hooks/useCouponCategories';
import { getErrorMessage } from '@/lib/errors';
import { slugify } from '@/lib/slugify';

interface FormState {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color_hex: string;
  sort_order: string;
}

const EMPTY: FormState = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color_hex: '#FF4D00',
  sort_order: '0',
};

export function AdminCouponCategoriesTab() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useCouponCategories();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingOldName, setEditingOldName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (cat: CouponCategory) => {
    setEditing(cat.id);
    setEditingOldName(cat.name);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '',
      color_hex: cat.color_hex || '#FF4D00',
      sort_order: String(cat.sort_order ?? 0),
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditingOldName(null);
    setForm(EMPTY);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ title: 'Nome e slug são obrigatórios', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        icon: form.icon.trim() || null,
        color_hex: form.color_hex,
        sort_order: parseInt(form.sort_order, 10) || 0,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase
          .from('coupon_categories')
          .update(payload)
          .eq('id', editing);
        if (error) throw error;

        // Se o nome mudou, atualiza todos os cupons vinculados
        if (editingOldName && editingOldName !== payload.name) {
          const { error: couponsError } = await supabase
            .from('coupons')
            .update({ category: payload.name })
            .eq('category', editingOldName);
          if (couponsError) throw couponsError;
        }

        toast({ title: 'Categoria atualizada!' });
        queryClient.invalidateQueries({ queryKey: ['coupon-categories'] });
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      } else {
        const { error } = await supabase.from('coupon_categories').insert(payload);
        if (error) throw error;
        toast({ title: 'Categoria criada!' });
        queryClient.invalidateQueries({ queryKey: ['coupon-categories'] });
      }

      cancelEdit();
    } catch (error) {
      toast({ title: 'Erro', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const couponsWithCategory = (categories.find(c => c.id === id) ? 1 : 0);
    if (!confirm(`Excluir a categoria "${name}"?\n\nOs cupons vinculados a ela ficarão sem categoria definida.`)) return;

    const { error } = await supabase.from('coupon_categories').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Categoria excluída' });
    queryClient.invalidateQueries({ queryKey: ['coupon-categories'] });
  };

  return (
    <div className="space-y-4">
      {/* Formulário de criação / edição */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
            {editing ? 'Editar Categoria' : 'Nova Categoria'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome *</label>
              <Input
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Ex: Moda"
                className="h-9"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug *</label>
              <Input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="ex: moda"
                className="h-9 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descrição curta da categoria..."
              className="min-h-[56px] resize-none text-xs"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Ícone (emoji)</label>
              <Input
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="Ex: 👗"
                className="h-9"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Cor</label>
              <input
                type="color"
                value={form.color_hex}
                onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))}
                className="h-9 w-full cursor-pointer rounded-lg border border-border p-1"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Ordem</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                placeholder="0"
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            {editing && (
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="mr-1 h-4 w-4" /> Cancelar
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>

          {editing && editingOldName !== form.name && form.name.trim() && (
            <p className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              ⚠️ Renomear de <strong>"{editingOldName}"</strong> para <strong>"{form.name}"</strong> irá atualizar
              automaticamente todos os cupons vinculados.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
            Categorias ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
          ) : categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma categoria criada ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  <span className="text-lg leading-none">{cat.icon || '🏷️'}</span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: cat.color_hex || '#FF4D00' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{cat.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      /{cat.slug} · ordem {cat.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(cat.id, cat.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
