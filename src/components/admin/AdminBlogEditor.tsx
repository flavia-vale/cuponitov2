import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TipTapEditor } from './TipTapEditor';
import { useAdminBlogPosts, useBlogCategories, useBlogAuthors, type BlogPost } from '@/hooks/useBlog';
import { cn } from '@/lib/utils';

interface Props {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminBlogEditor({ post, onSave, onCancel }: Props) {
  const { data: allPosts = [] } = useAdminBlogPosts();
  const { data: categories = [] } = useBlogCategories();
  const { data: authors = [] } = useBlogAuthors();

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [summary, setSummary] = useState(post?.meta_description ?? post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverUrl, setCoverUrl] = useState(post?.cover_image ?? '');
  const [categoryId, setCategoryId] = useState(post?.category_id ?? '');
  const [authorId, setAuthorId] = useState(post?.author_id ?? '');
  const [isPublished, setIsPublished] = useState(post?.status === 'published');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  const handleSave = async () => {
    if (!title || !slug) {
      toast({ title: 'Título e Slug são obrigatórios', variant: 'destructive' });
      return;
    }
    setSaving(true);
    
    const payload = {
      title,
      slug,
      meta_title: title,
      meta_description: summary,
      excerpt: summary,
      content,
      cover_image: coverUrl,
      category_id: categoryId || null,
      author_id: authorId || null,
      status: isPublished ? 'published' : 'draft',
      updated_at: new Date().toISOString(),
    };

    const { error } = post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert([payload]);

    setSaving(false);
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: post ? 'Post atualizado!' : 'Post criado!' });
    onSave();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* BARRA FIXA SUPERIOR */}
      <div className="sticky top-0 z-50 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-sm font-bold text-foreground">
            {post ? `Editando: ${title}` : 'Novo Artigo'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {post && (
            <a 
              href={`/blog/${post.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary hover:underline px-3"
            >
              Ver Post <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-1.5 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6 min-w-0">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-muted-foreground">Título do Artigo</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: 10 Melhores Cupons Amazon para Hoje"
                  className="h-12 text-lg font-bold border-none bg-muted/30 focus-visible:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Resumo / Meta Description ({summary.length}/160)
                </label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve resumo para o Google e listagens..."
                  maxLength={170}
                  className="min-h-[80px] resize-none border-none bg-muted/30 focus-visible:ring-primary/20 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Conteúdo do Post</label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="w-full shrink-0 space-y-6 lg:w-80">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">Publicar Post</span>
                  <p className="text-[10px] text-muted-foreground">{isPublished ? 'Visível no site' : 'Salvo como rascunho'}</p>
                </div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-muted-foreground">Categoria</label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-muted-foreground">Autor</label>
                  <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Imagem de Destaque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coverUrl ? (
                <div className="group relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                  <img src={coverUrl} alt="Capa" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="destructive" size="sm" onClick={() => setCoverUrl('')} className="h-8 gap-1.5">
                      <X className="h-3.5 w-3.5" /> Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="URL da imagem..."
                className="h-8 text-[10px] font-mono"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL (Slug)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
                className="h-8 font-mono text-[10px] bg-muted/30"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}