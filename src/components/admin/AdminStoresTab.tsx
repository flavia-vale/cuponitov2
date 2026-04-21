import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Save, Trash2, Pencil, X, Upload, Star } from 'lucide-react';
import type { StoreBrand } from '@/lib/storeBranding';

interface Props { stores: StoreBrand[] | undefined; refetchStores: () => void; }
interface StoreForm { name: string; slug: string; icon_emoji: string; brand_color: string; fallback_color: string; logo_url: string; store_id?: number; }
const emptyForm: StoreForm = { name: '', slug: '', icon_emoji: '🏷️', brand_color: '#575ecf', fallback_color: '#575ecf', logo_url: '' };

export function AdminStoresTab({ stores, refetchStores }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<StoreForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `store-logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    setForm(p => ({ ...p, logo_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: 'Logo enviada!' });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) { toast({ title: 'Preencha nome e slug', variant: 'destructive' }); return; }
    
    const payload = {
      name: form.name,
      slug: form.slug,
      icon_emoji: form.icon_emoji,
      brand_color: form.brand_color,
      fallback_color: form.fallback_color,
      logo_url: form.logo_url || null,
      store_id: form.store_id || floor(random() * 8999999 + 1000000)
    };

    if (editingId) {
      const { error } = await supabase.from('stores').update(payload).eq('id', editingId);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Loja atualizada!' });
    } else {
      const { error } = await supabase.from('stores').insert([payload]);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Loja cadastrada!' });
    }
    setForm(emptyForm); setEditingId(null); refetchStores(); queryClient.invalidateQueries({ queryKey: ['store-brands'] });
  };

  const handleEdit = (store: StoreBrand) => { 
    setEditingId(store.id); 
    setForm({ 
      name: store.name, 
      slug: store.slug, 
      icon_emoji: store.icon_emoji, 
      brand_color: store.brand_color, 
      fallback_color: store.fallback_color,
      logo_url: store.logo_url || '',
      store_id: store.store_id
    }); 
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta loja?')) return;
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Loja removida!' });
    refetchStores();
    queryClient.invalidateQueries({ queryKey: ['store-brands'] });
  };

  const handleToggleFeatured = async (store: StoreBrand) => {
    const newVal = !(store as any).is_featured;
    const { error } = await supabase.from('stores').update({ is_featured: newVal } as any).eq('id', store.id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    refetchStores();
    queryClient.invalidateQueries({ queryKey: ['store-brands'] });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Gestão de Lojas</h1><p className="text-sm text-muted-foreground">Cadastre e edite as lojas parceiras</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base">{editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? 'Editar Loja' : 'Nova Loja'}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Nome *</label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Amazon" /></div>
                <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Slug *</label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="amazon" /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><label className="mb-1 block text-xs font-medium text-muted-foreground">ID da Loja</label><Input value={form.store_id || ''} readOnly className="bg-muted" /></div>
                <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Cor da Marca</label><div className="flex items-center gap-2"><input type="color" value={form.brand_color} onChange={(e) => setForm((p) => ({ ...p, brand_color: e.target.value }))} className="h-9 w-10 cursor-pointer rounded border-0" /><Input value={form.brand_color} onChange={(e) => setForm((p) => ({ ...p, brand_color: e.target.value }))} className="font-mono text-xs" /></div></div>
                <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Emoji</label><Input value={form.icon_emoji} onChange={(e) => setForm((p) => ({ ...p, icon_emoji: e.target.value }))} /></div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">Logo</label>
              {form.logo_url ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/50">
                  <img src={form.logo_url} alt="Preview" className="h-full w-full object-contain p-4" />
                  <Button variant="destructive" size="icon" className="absolute right-1 top-1 h-6 w-6" onClick={() => setForm(p => ({ ...p, logo_url: '' }))}><X className="h-3 w-3" /></Button>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition hover:border-primary/50">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{uploading ? 'Enviando...' : 'Subir Logo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadLogo(file); }} />
                </label>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> {editingId ? 'Atualizar' : 'Cadastrar'}</Button>
            {editingId && <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar</Button>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Lojas ({stores?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {stores?.map((store) => (
              <div key={store.id} className="flex items-center justify-between rounded-xl border border-border p-3 bg-card shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/30 overflow-hidden">
                    {store.logo_url ? <img src={store.logo_url} alt={store.name} className="h-full w-full object-contain p-1" /> : <span className="text-xl">{store.icon_emoji}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{store.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {store.store_id}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleToggleFeatured(store)}
                    className="h-8 w-8"
                    title={(store as any).is_featured ? 'Remover destaque' : 'Marcar como destaque'}
                  >
                    <Star
                      className="h-3.5 w-3.5"
                      fill={(store as any).is_featured ? '#f59e0b' : 'none'}
                      stroke={(store as any).is_featured ? '#f59e0b' : 'currentColor'}
                    />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(store)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(store.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}