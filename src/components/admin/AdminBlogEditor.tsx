import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TipTapEditor } from './TipTapEditor';
import { useBlogCategories, useBlogAuthors, type BlogPost } from '@/hooks/useBlog';

interface Props { post?: BlogPost | null; onSave: () => void; onCancel: () => void; }

function slugify(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminBlogEditor({ post, onSave, onCancel }: Props) {
  const { data: categories } = useBlogCategories();
  const { data: authors } = useBlogAuthors();
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || '');
  const [status, setStatus] = useState<string>(post?.status || 'draft');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [categoryId, setCategoryId] = useState(post?.category_id || '');
  const [authorId, setAuthorId] = useState(post?.author_id || '');
  const [publishedAt, setPublishedAt] = useState(post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!slugManual && title) setSlug(slugify(title)); }, [title, slugManual]);

  const uploadCover = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    setCoverImage(urlData.publicUrl);
    setUploading(false);
    toast({ title: 'Imagem enviada!' });
  };

  const handleSave = async () => {
    if (!slug) { toast({ title: 'Slug é obrigatório', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = { title, slug, excerpt, content, cover_image: coverImage, meta_title: metaTitle, meta_description: metaDescription, status: status as 'draft' | 'published' | 'scheduled', featured, category_id: categoryId || null, author_id: authorId || null, published_at: publishedAt ? new Date(publishedAt).toISOString() : status === 'published' ? new Date().toISOString() : null };
    let error;
    if (post) { ({ error } = await supabase.from('blog_posts').update(payload).eq('id', post.id)); } else { ({ error } = await supabase.from('blog_posts').insert(payload)); }
    setSaving(false);
    if (error) { toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' }); return; }
    toast({ title: post ? 'Post atualizado!' : 'Post criado!' });
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-bold text-foreground">{post ? 'Editar Post' : 'Novo Post'}</h1>
        <Button onClick={handleSave} disabled={saving} className="ml-auto gap-1.5"><Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4 min-w-0">
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Título</label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do artigo" className="text-lg font-semibold" /></div>
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Slug {!slugManual && <span className="ml-1 text-primary">(auto)</span>}</label><Input value={slug} onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }} placeholder="url-do-artigo" className="font-mono text-sm" /></div>
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Resumo / Excerpt</label><Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Uma breve descrição do artigo..." className="min-h-[60px]" /></div>
          <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Conteúdo</label><TipTapEditor content={content} onChange={setContent} /></div>
        </div>
        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Publicação</CardTitle></CardHeader><CardContent className="space-y-3">
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Rascunho</SelectItem><SelectItem value="published">Publicado</SelectItem><SelectItem value="scheduled">Agendado</SelectItem></SelectContent></Select></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Data de publicação</label><Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} /></div>
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Destaque</span><Switch checked={featured} onCheckedChange={setFeatured} /></div>
          </CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Classificação</CardTitle></CardHeader><CardContent className="space-y-3">
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</label><Select value={categoryId || 'none'} onValueChange={(v) => setCategoryId(v === 'none' ? '' : v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Nenhuma</SelectItem>{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Autor</label><Select value={authorId || 'none'} onValueChange={(v) => setAuthorId(v === 'none' ? '' : v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Nenhum</SelectItem>{authors?.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
          </CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Imagem de Capa</CardTitle></CardHeader><CardContent className="space-y-3">
            {coverImage ? <div className="relative"><img src={coverImage} alt="Capa" className="w-full rounded-lg object-cover aspect-video" /><Button variant="destructive" size="icon" className="absolute right-1 top-1 h-6 w-6" onClick={() => setCoverImage('')}><X className="h-3 w-3" /></Button></div> : <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition hover:border-primary/50"><Upload className="h-6 w-6 text-muted-foreground" /><span className="text-xs text-muted-foreground">{uploading ? 'Enviando...' : 'Clique para enviar'}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadCover(file); }} /></label>}
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Ou cole a URL da imagem" className="text-xs" />
          </CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">SEO</CardTitle></CardHeader><CardContent className="space-y-3">
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Title ({metaTitle.length}/60)</label><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || 'Título para SEO'} maxLength={70} className="text-xs" /></div>
            <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description ({metaDescription.length}/160)</label><Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={excerpt || 'Descrição para SEO'} maxLength={170} className="min-h-[60px] text-xs" /></div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}
