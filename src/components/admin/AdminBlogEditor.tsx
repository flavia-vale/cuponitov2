import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TipTapEditor } from './TipTapEditor';
import { useAdminPosts, type Post } from '@/hooks/usePosts';

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
    } catch (e: unknown) {
      toast({ title: 'Erro no upload', description: (e as Error).message, variant: 'destructive' });
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
    } catch (e: unknown) {
      toast({ title: 'Erro no upload', description: (e as Error).message, variant: 'destructive' });
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{post ? 'Editar Post' : 'Novo Post'}</h1>
        <Button onClick={handleSave} disabled={saving} className="ml-auto gap-1.5">
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Main column */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo"
              className="h-11 text-lg font-semibold"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">
              Slug {!slugManual && <span className="ml-1 text-primary">(auto)</span>}
            </label>
            <Input
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="url-do-artigo"
              className="h-10 font-mono text-sm"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Palavras-chave</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="palavra1, palavra2, palavra3"
              className="h-10 text-sm"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Conteúdo</label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>

          {/* Banners */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Banners Internos</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addBanner} className="gap-1">
                  <Plus className="h-3 w-3" /> Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {banners.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhum banner. Clique em "Adicionar" para inserir.</p>
              )}
              {banners.map((banner, idx) => (
                <div key={idx} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Banner {idx + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeBanner(idx)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {banner.url ? (
                    <div className="relative">
                      <img src={banner.url} alt={`Banner ${idx + 1}`} className="w-full rounded object-cover aspect-[3/1]" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => updateBanner(idx, 'url', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-1 rounded border-2 border-dashed border-border p-3 text-center hover:border-primary/50">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {uploadingBannerIdx === idx ? 'Enviando...' : 'Upload imagem'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(idx, f); }}
                      />
                    </label>
                  )}
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Input
                      value={banner.link}
                      onChange={(e) => updateBanner(idx, 'link', e.target.value)}
                      placeholder="https://link-de-redirecionamento.com"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Related posts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Posts Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                value={relatedSearch}
                onChange={(e) => setRelatedSearch(e.target.value)}
                placeholder="Buscar posts..."
                className="h-9 text-sm"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredPosts.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={relatedIds.includes(p.id)}
                      onChange={() => toggleRelated(p.id)}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    <span className="truncate text-foreground">{p.title || <em className="text-muted-foreground">Sem título</em>}</span>
                    {p.status && <span className="ml-auto text-[10px] text-green-600">Ativo</span>}
                  </label>
                ))}
                {filteredPosts.length === 0 && (
                  <p className="px-2 py-2 text-xs text-muted-foreground">Nenhum post encontrado.</p>
                )}
              </div>
              {relatedIds.length > 0 && (
                <p className="text-xs text-muted-foreground">{relatedIds.length} post(s) selecionado(s)</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 space-y-4 lg:w-72">
          {/* Publish */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Publicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Ativo</span>
                <Switch checked={status} onCheckedChange={setStatus} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{status ? 'Visível no site' : 'Rascunho (oculto)'}</p>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Meta Description ({metaDescription.length}/160)
                </label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descrição para mecanismos de busca"
                  maxLength={170}
                  className="min-h-[72px] text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classifica o */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Classificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="ex: Tecnologia"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Autor</label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nome do autor"
                  className="h-9 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cover image */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Imagem de Capa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coverUrl ? (
                <div className="relative">
                  <img src={coverUrl} alt="Capa" className="w-full rounded-lg object-cover aspect-video" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => setCoverUrl('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition hover:border-primary/50">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {uploadingCover ? 'Enviando...' : 'Clique para enviar'}
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
                className="h-9 text-xs"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
