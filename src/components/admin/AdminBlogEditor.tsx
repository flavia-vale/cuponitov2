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
import { useAdminPosts, usePublishedPostsForSelect, type Post } from '@/hooks/usePosts';

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
  const { data: publishedPosts = [] } = usePublishedPostsForSelect();
  const [relatedOpen, setRelatedOpen] = useState(false);

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

  const filteredPublished = publishedPosts.filter(
    (p) =>
      p.id !== post?.id &&
      !relatedIds.includes(p.id) &&
      p.title.toLowerCase().includes(relatedSearch.toLowerCase()),
  );

  const selectedPosts = publishedPosts.filter((p) => relatedIds.includes(p.id));

  const addRelated = (id: string) => {
    setRelatedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setRelatedSearch('');
  };

  const removeRelated = (id: string) =>
    setRelatedIds((prev) => prev.filter((x) => x !== id));

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Posts Relacionados</CardTitle>
                <span className={`text-[10px] font-medium ${relatedIds.length >= 3 ? 'text-green-600' : 'text-amber-500'}`}>
                  {relatedIds.length}/3 sugeridos
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Selected chips */}
              {selectedPosts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedPosts.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 rounded-full border border-primary/20 bg-[#FFF0EB] px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      <span className="max-w-[150px] truncate">{p.title || 'Sem título'}</span>
                      <button
                        type="button"
                        onClick={() => removeRelated(p.id)}
                        className="ml-0.5 rounded-full hover:bg-primary/10 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative">
                <Input
                  value={relatedSearch}
                  onChange={(e) => { setRelatedSearch(e.target.value); setRelatedOpen(true); }}
                  onFocus={() => setRelatedOpen(true)}
                  onBlur={() => setTimeout(() => setRelatedOpen(false), 150)}
                  placeholder="Buscar posts publicados..."
                  className="h-9 text-sm pr-8"
                />
                {relatedSearch && (
                  <button
                    type="button"
                    onClick={() => { setRelatedSearch(''); setRelatedOpen(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Dropdown */}
                {relatedOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-white shadow-xl">
                    <div className="max-h-52 overflow-y-auto py-1">
                      {filteredPublished.length > 0 ? (
                        filteredPublished.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onMouseDown={() => addRelated(p.id)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-muted transition-colors"
                          >
                            <div className="h-8 w-12 shrink-0 overflow-hidden rounded bg-[#f5f3ef]">
                              {p.cover_url
                                ? <img src={p.cover_url} alt="" className="h-full w-full object-cover" />
                                : <div className="flex h-full items-center justify-center text-base">📄</div>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-foreground">{p.title || 'Sem título'}</p>
                              {p.category && (
                                <p className="text-[10px] text-muted-foreground">{p.category}</p>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-3 text-xs text-muted-foreground">
                          {relatedSearch ? 'Nenhum post publicado encontrado.' : 'Digite para buscar posts publicados.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
