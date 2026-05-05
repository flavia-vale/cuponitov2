import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useBlogCategories, type BlogCategory } from '@/hooks/useBlog';
import { slugify } from '@/lib/slugify';

interface FormState { name: string; slug: string; description: string; color_hex: string; }
const EMPTY: FormState = { name: '', slug: '', description: '', color_hex: '#FF4D00' };

export function AdminBlogCategoriesTab() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useBlogCategories();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (cat: BlogCategory) => {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color_hex: cat.color_hex || '#FF4D00' });
  };

  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast({ title: 'Nome e slug são obrigatórios', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = { name: form.name, slug: form.slug, description: form.description, color_hex: form.color_hex };
    let error;
    if (editing) {
      ({ error } = await supabase.from('blog_categories').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('blog_categories').insert(payload));
    }
    setSaving(false);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: editing ? 'Categoria atualizada!' : 'Categoria criada!' });
    queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    cancelEdit();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a categoria "${name}"?`)) return;
    const { error } = await supabase.from('blog_categories').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Categoria excluída' });
    queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
            {editing ? 'Editar Categoria' : 'Nova Categoria'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome</label>
              <Input value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Ex: Moda" className="h-9" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug</label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="ex: moda" className="h-9 font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição curta da categoria..." className="min-h-[60px] resize-none text-xs" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Cor</label>
              <input type="color" value={form.color_hex} onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))} className="h-9 w-16 cursor-pointer rounded-lg border border-border p-1" />
            </div>
            <div className="ml-auto flex gap-2">
              {editing && <Button variant="ghost" size="sm" onClick={cancelEdit}><X className="h-4 w-4 mr-1" /> Cancelar</Button>}
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-4 w-4" /> {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">Categorias ({categories.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
          ) : categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma categoria criada ainda.</p>
          ) : (
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: cat.color_hex || '#FF4D00' }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{cat.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{cat.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(cat)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(cat.id, cat.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
