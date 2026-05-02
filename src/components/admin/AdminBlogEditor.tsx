import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Tag } from 'lucide-react';
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
import { type InlineCouponConfig } from '@/components/blog/InlineCouponBox';

interface Props {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadToBlog(file: File, folder: 'covers' | 'content'): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('blog-images').upload(path, file, { cacheControl: '2592000', upsert: false });
  if (error) throw error;
  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}

export function AdminBlogEditor({ post, onSave, onCancel }: Props) {
  const { data: categories = [] } = useBlogCategories();
  const { data: authors = [] } = useBlogAuthors();

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '');
  const [categoryId, setCategoryId] = useState(post?.category_id ?? '');
  const [authorId, setAuthorId] = useState(post?.author_id ?? '');
  const [isPublished, setIsPublished] = useState(post?.status === 'published');
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? '');

  const rawCta = post?.cta_config;
  const initialCta: InlineCouponConfig | null =
    rawCta && typeof rawCta === 'object' && !Array.isArray(rawCta) ? (rawCta as InlineCouponConfig) : null;
  const [hasCta, setHasCta] = useState(!!initialCta);
  const [ctaConfig, setCtaConfig] = useState<InlineCouponConfig>(initialCta ?? {});

  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const url = await uploadToBlog(file, 'covers');
      setCoverImage(url);
      toast({ title: 'Capa enviada!' });
    } catch (e: any) {
      toast({ title: 'Erro no upload', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleContentImageUpload = async (file: File): Promise<string> => {
    try {
      const url = await uploadToBlog(file, 'content');
      toast({ title: 'Imagem inserida!' });
      return url;
    } catch (e: any) {
      toast({ title: 'Erro no upload', description: e.message, variant: 'destructive' });
      throw e;
    }
  };

  const setCta = (field: keyof InlineCouponConfig, value: string) =>
    setCtaConfig(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!title || !slug) {
      toast({ title: 'Título e slug são obrigatórios', variant: 'destructive' });
      return;
    }
    const plainContent = content.replace(/<[^>]*>/g, '').trim();
    if (!plainContent) {
      toast({ title: 'O conteúdo do post não pode estar vazio', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage,
      category_id: categoryId || null,
      author_id: authorId || null,
      status: isPublished ? 'published' : 'draft',
      featured,
      meta_title: metaTitle,
      meta_description: metaDescription,
      cta_config: hasCta && Object.keys(ctaConfig).some(k => (ctaConfig as any)[k]) ? ctaConfig : null,
      updated_at: new Date().toISOString(),
      published_at: isPublished && !post?.published_at ? new Date().toISOString() : post?.published_at,
    };

    const { error } = post
      ? await supabase.from('blog_posts').update(payload).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: post ? 'Post atualizado!' : 'Post criado!' });
    setTimeout(() => onSave(), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-xl font-bold">{post ? 'Editar Post' : 'Novo Post'}</h1>
        <Button onClick={handleSave} disabled={saving} className="ml-auto gap-1.5">
          <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4 min-w-0">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Título</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do artigo" className="h-11 text-lg font-semibold" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Slug</label>
                  <Input value={slug} onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }} placeholder="url-do-artigo" className="h-10 font-mono text-sm" />
                </div>
                <div className="flex items-center gap-4 h-full pt-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                    <span className="text-sm font-medium">Publicar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={featured} onCheckedChange={setFeatured} />
                    <span className="text-sm font-medium">Destaque</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Resumo (Excerpt)</label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Uma breve descrição para a listagem..." className="resize-none h-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">Conteúdo</CardTitle></CardHeader>
            <CardContent>
              <TipTapEditor content={content} onChange={setContent} onImageUpload={handleContentImageUpload} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">Classificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</label>
                <Select value={categoryId || undefined} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Autor</label>
                <Select value={authorId || undefined} onValueChange={setAuthorId}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">Imagem de Capa</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img src={coverImage} alt="Capa" className="h-full w-full object-cover" />
                  <Button variant="destructive" size="icon" className="absolute right-1 top-1 h-6 w-6" onClick={() => setCoverImage('')}><X className="h-3 w-3" /></Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition hover:border-primary/50">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{uploadingCover ? 'Enviando...' : 'Subir imagem'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] text-muted-foreground">ou cole a URL</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className="h-8 text-xs" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase text-muted-foreground">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Title</label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Título SEO" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description</label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Descrição para o Google" className="resize-none h-24 text-xs" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Banner / CTA
                </CardTitle>
                <Switch checked={hasCta} onCheckedChange={setHasCta} />
              </div>
            </CardHeader>
            {hasCta && (
              <CardContent className="space-y-2.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Loja (nome)</label>
                  <Input value={ctaConfig.store_name ?? ''} onChange={(e) => setCta('store_name', e.target.value)} placeholder="ex: Amazon" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug da loja</label>
                  <Input value={ctaConfig.store_slug ?? ''} onChange={(e) => setCta('store_slug', e.target.value)} placeholder="ex: amazon" className="font-mono text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Código do cupom</label>
                  <Input value={ctaConfig.code ?? ''} onChange={(e) => setCta('code', e.target.value)} placeholder="ex: SAVE10" className="font-mono text-sm uppercase" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Desconto</label>
                  <Input value={ctaConfig.discount ?? ''} onChange={(e) => setCta('discount', e.target.value)} placeholder="ex: 10% OFF" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Título do banner</label>
                  <Input value={ctaConfig.title ?? ''} onChange={(e) => setCta('title', e.target.value)} placeholder="ex: Cupom exclusivo" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
                  <Input value={ctaConfig.description ?? ''} onChange={(e) => setCta('description', e.target.value)} placeholder="ex: Válido até 31/12" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">URL de destino</label>
                  <Input value={ctaConfig.url ?? ''} onChange={(e) => setCta('url', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Texto do botão</label>
                  <Input value={ctaConfig.button_text ?? ''} onChange={(e) => setCta('button_text', e.target.value)} placeholder="ex: Copiar e ir" />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}