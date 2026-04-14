import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Save, Trash2, Pencil, X } from 'lucide-react';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props { stores: StoreBrand[] | undefined; refetchStores: () => void; }
interface StoreForm { display_name: string; slug: string; icon_emoji: string; brand_color: string; fallback_color: string; }
const emptyForm: StoreForm = { display_name: '', slug: '', icon_emoji: '🏷️', brand_color: '#575ecf', fallback_color: '#575ecf' };

export function AdminStoresTab({ stores, refetchStores }: Props) {
  const [form, setForm] = useState<StoreForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.display_name.trim() || !form.slug.trim()) { toast({ title: 'Preencha nome e slug', variant: 'destructive' }); return; }
    if (editingId) {
      const { error } = await supabase.from('stores').update(form).eq('id', editingId);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Loja atualizada!' });
    } else {
      const { error } = await supabase.from('stores').insert(form);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Loja cadastrada!' });
    }
    setForm(emptyForm); setEditingId(null); refetchStores();
  };

  const handleEdit = (store: StoreBrand) => { setEditingId(store.id); setForm({ display_name: store.display_name, slug: store.slug, icon_emoji: store.icon_emoji, brand_color: store.brand_color, fallback_color: store.fallback_color }); };
  const handleDelete = async (id: string) => { const { error } = await supabase.from('stores').delete().eq('id', id); if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; } toast({ title: 'Loja removida!' }); refetchStores(); };
  const cancelEdit = () => { setEditingId(null); setForm(emptyForm); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Gestão de Lojas</h1><p className="text-sm text-muted-foreground">Cadastre e edite as lojas parceiras</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base">{editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? 'Editar Loja' : 'Nova Loja'}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Nome *</label><Input value={form.display_name} onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))} placeholder="Amazon" /></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Slug *</label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="amazon" /></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Emoji</label><Input value={form.icon_emoji} onChange={(e) => setForm((p) => ({ ...p, icon_emoji: e.target.value }))} placeholder="🏷️" /></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Cor da Marca</label><div className="flex items-center gap-2"><input type="color" value={form.brand_color} onChange={(e) => setForm((p) => ({ ...p, brand_color: e.target.value }))} className="h-9 w-10 cursor-pointer rounded border-0" /><Input value={form.brand_color} onChange={(e) => setForm((p) => ({ ...p, brand_color: e.target.value }))} className="font-mono text-xs" /></div></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Cor Fallback</label><div className="flex items-center gap-2"><input type="color" value={form.fallback_color} onChange={(e) => setForm((p) => ({ ...p, fallback_color: e.target.value }))} className="h-9 w-10 cursor-pointer rounded border-0" /><Input value={form.fallback_color} onChange={(e) => setForm((p) => ({ ...p, fallback_color: e.target.value }))} className="font-mono text-xs" /></div></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> {editingId ? 'Atualizar' : 'Cadastrar'}</Button>
            {editingId && <Button variant="outline" onClick={cancelEdit} className="gap-1.5"><X className="h-4 w-4" /> Cancelar</Button>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Lojas cadastradas ({stores?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {!stores || stores.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma loja cadastrada.</p> : (
            <div className="space-y-2">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3"><span className="text-xl">{store.icon_emoji}</span><div><span className="text-sm font-medium">{store.display_name}</span><span className="ml-2 text-xs text-muted-foreground">/{store.slug}</span></div><div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded" style={{ backgroundColor: store.brand_color }} /><span className="font-mono text-[10px] text-muted-foreground">{store.brand_color}</span></div></div>
                  <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => handleEdit(store)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(store.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
