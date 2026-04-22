import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Save, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useBlogAuthors, type BlogAuthor } from '@/hooks/useBlog';

interface FormState { name: string; bio: string; avatar_url: string; }
const EMPTY: FormState = { name: '', bio: '', avatar_url: '' };

export function AdminBlogAuthorsTab() {
  const queryClient = useQueryClient();
  const { data: authors = [], isLoading } = useBlogAuthors();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (author: BlogAuthor) => {
    setEditing(author.id);
    setForm({ name: author.name, bio: author.bio || '', avatar_url: author.avatar_url || '' });
  };

  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'Nome é obrigatório', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = { name: form.name, bio: form.bio, avatar_url: form.avatar_url };
    let error;
    if (editing) {
      ({ error } = await supabase.from('blog_authors').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('blog_authors').insert(payload));
    }
    setSaving(false);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: editing ? 'Autor atualizado!' : 'Autor criado!' });
    queryClient.invalidateQueries({ queryKey: ['blog-authors'] });
    cancelEdit();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o autor "${name}"?`)) return;
    const { error } = await supabase.from('blog_authors').delete().eq('id', id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Autor excluído' });
    queryClient.invalidateQueries({ queryKey: ['blog-authors'] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
            {editing ? 'Editar Autor' : 'Novo Autor'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome</label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Maria Silva" className="h-9" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Bio</label>
            <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Uma breve descrição do autor..." className="min-h-[60px] resize-none text-xs" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">URL do Avatar</label>
            <Input value={form.avatar_url} onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))} placeholder="https://..." className="h-9 text-xs" />
          </div>
          <div className="flex justify-end gap-2">
            {editing && <Button variant="ghost" size="sm" onClick={cancelEdit}><X className="h-4 w-4 mr-1" /> Cancelar</Button>}
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save className="h-4 w-4" /> {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">Autores ({authors.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
          ) : authors.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhum autor criado ainda.</p>
          ) : (
            <div className="space-y-2">
              {authors.map(author => (
                <div key={author.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  {author.avatar_url
                    ? <img src={author.avatar_url} alt={author.name} className="h-9 w-9 shrink-0 rounded-full object-cover" loading="lazy" />
                    : <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted"><User className="h-4 w-4 text-muted-foreground" /></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{author.name}</p>
                    {author.bio && <p className="truncate text-[10px] text-muted-foreground">{author.bio}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(author)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(author.id, author.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
