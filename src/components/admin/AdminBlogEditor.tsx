import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Plus, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TipTapEditor } from './TipTapEditor';
import { useAdminPosts, type Post } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';

interface BannerItem { url: string; link: string }

interface Props {
  post?: Post | null;
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

async function uploadToBlog(file: File, folder: 'covers' | 'banners'): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('blog').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl;
}

export function AdminBlogEditor({ post, onSave, onCancel }: Props) {
  const { data: allPosts = [] } = useAdminPosts();

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? '');
  const [keywords, setKeywords] = useState(post?.keywords ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? '');
  const [category, setCategory] = useState(post?.category ?? '');
  const [author, setAuthor] = useState(post?.author ?? '');
  const [status, setStatus] = useState(post?.status ?? false);
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    const raw = post?.images_json;
    if (Array.isArray(raw)) return raw as BannerItem[];
    return [];
  });
  const [relatedIds, setRelatedIds] = useState<string[]>(post?.related_post_ids ?? []);
  const [relatedSearch, setRelatedSearch] = useState('');

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBannerIdx, setUploadingBannerIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const url = await uploadToBlog(file, 'covers');
      setCoverUrl(url);
      toast({ title: 'Capa enviada!' });
    } catch (e: any) {
      toast({ title: 'Erro no upload', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingCover(false);
    }
  };

  const addBanner = () => setBanners((prev) => [...prev, { url: '', link: '' }]);
  const removeBanner = (idx: number) => setBanners((prev) => prev.filter((_, i) => i !== idx));
  const updateBanner = (idx: number, field: keyof BannerItem, value: string) =>
    setBanners((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)));

  const handleBannerUpload = async (idx: number, file: File) => {
    setUploadingBannerIdx(idx);
    try {
      const url = await uploadToBlog(file, 'banners');
      updateBanner(idx, 'url', url);
      toast({ title: 'Banner enviado!' });
    } catch (e: any) {
      toast({ title: 'Erro no upload', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingBannerIdx(null);
    }
  };

  const toggleRelated = (id: string) =>
    setRelatedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredPosts = allPosts.filter(
    (p) => p.id !== post?.id && p.title.toLowerCase().includes(relatedSearch.toLowerCase()),
  );

  const handleSave = async () => {
    if (!slug) {
      toast({ title: 'Slug é obrigatório', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title,
      slug,
      meta_description: metaDescription,
      keywords,
      content,
      cover_url: coverUrl,
      category,
      author,
      status,
      images_json: banners,
      related_post_ids: relatedIds,
    };
    const { error } = post
      ? await supabase.from('posts').update(payload).eq('id', post.id)
      : await supabase.from('posts').insert(payload);
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
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-sm font-bold text-foreground">
            {post ? `Editando: ${title}` : 'Novo Post'}
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
        {/* Coluna Principal */}
        <div className="flex-1 space-y-6 min-w-0">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Título Único */}
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-muted-foreground">Título do Artigo</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: 10 Melhores Cupons Amazon para Hoje"
                  className="h-12 text-lg font-bold border-none bg-muted/30 focus-visible:ring-primary/20"
                />
              </div>

              {/* Resumo / Meta Description Único */}
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Resumo / Meta Description ({metaDescription.length}/160)
                </label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Breve resumo para o Google e listagens..."
                  maxLength={170}
                  className="min-h-[80px] resize-none border-none bg-muted/30 focus-visible:ring-primary/20 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Editor de Conteúdo */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Conteúdo do Post</label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>

          {/* Seletor Visual de Relacionados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Posts Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={relatedSearch}
                  onChange={(e) => setRelatedSearch(e.target.value)}
                  placeholder="Buscar posts para relacionar..."
                  className="h-10 pl-9 text-sm bg-muted/20"
                />
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {filteredPosts.map((p) => {
                  const isSelected = relatedIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleRelated(p.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:border-primary/40",
                        isSelected ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" : "bg-card border-border"
                      )}
                    >
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span className={cn("truncate text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                        {p.title || 'Sem título'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 space-y-6 lg:w-80">
          {/* Configurações Rápidas */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">Status do Post</span>
                  <p className="text-[10px] text-muted-foreground">{status ? 'Publicado e visível' : 'Salvo como rascunho'}</p>
                </div>
                <Switch checked={status} onCheckedChange={setStatus} />
              </div>
              
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-muted-foreground">Categoria</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Tecnologia" className="h-9 text-xs" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-muted-foreground">Autor</label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome do autor" className="h-9 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagem de Capa */}
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
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 transition hover:border-primary/40 hover:bg-primary/5">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    {uploadingCover ? 'Enviando...' : 'Upload da Capa'}
                  </span>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }}
                  />
                </label>
              )}
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Ou cole a URL da imagem"
                className="h-8 text-[10px] font-mono"
              />
            </CardContent>
          </Card>

          {/* Slug e SEO */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL e SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold text-muted-foreground">Slug (URL)</label>
                <Input
                  value={slug}
                  onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
                  className="h-8 font-mono text-[10px] bg-muted/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold text-muted-foreground">Palavras-chave</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="separadas por vírgula"
                  className="h-8 text-[10px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}