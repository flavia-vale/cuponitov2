import { useEffect, useState } from 'react';
import { ExternalLink, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useUpdateSettings } from '@/hooks/useSettings';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import {
  useDeleteWhatsappGroupPage,
  useSaveWhatsappGroupPage,
  useWhatsappGroupInfo,
  useWhatsappGroupPages,
  type WhatsappGroupPage,
} from '@/hooks/useWhatsappGroupPages';
import {
  GROUP_HUB_SLUG,
  groupPagePath,
  parseGroupFaq,
  safeExternalUrl,
  type GroupFaqItem,
  type WhatsappGroupInfo,
} from '@/lib/whatsappGroup';

const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface PageForm {
  slug: string;
  store_slug: string;
  title: string;
  h1: string;
  meta_description: string;
  intro: string;
  content: string;
  faq: GroupFaqItem[];
  join_url: string;
  is_published: boolean;
  sort_order: number;
}

const EMPTY_PAGE: PageForm = {
  slug: '',
  store_slug: '',
  title: '',
  h1: '',
  meta_description: '',
  intro: '',
  content: '',
  faq: [],
  join_url: '',
  is_published: true,
  sort_order: 0,
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function GroupInfoCard() {
  const info = useWhatsappGroupInfo();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<WhatsappGroupInfo>(info);

  useEffect(() => setForm(info), [info]);

  const handleSave = async () => {
    if (form.channel_url && !safeExternalUrl(form.channel_url)) {
      toast({ title: 'Link do canal inválido', description: 'Use um link que comece com https://', variant: 'destructive' });
      return;
    }
    try {
      await updateSettings.mutateAsync({ key: 'whatsapp_group_info', value: form });
      toast({ title: 'Dados do grupo salvos!' });
    } catch (error) {
      toast({ title: 'Erro', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Dados do grupo (todas as páginas)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome do grupo">
            <Input value={form.group_name} onChange={e => setForm(f => ({ ...f, group_name: e.target.value }))} className="h-9" />
          </Field>
          <Field label="Ofertas por dia" hint='Ex.: "cerca de 200". Só escreva o que é verdade.'>
            <Input value={form.offers_per_day} onChange={e => setForm(f => ({ ...f, offers_per_day: e.target.value }))} className="h-9" />
          </Field>
          <Field label="Lojas">
            <Input value={form.stores} onChange={e => setForm(f => ({ ...f, stores: e.target.value }))} className="h-9" />
          </Field>
          <Field label="Link do canal do WhatsApp" hint="Vazio = o botão do canal não aparece.">
            <Input value={form.channel_url} onChange={e => setForm(f => ({ ...f, channel_url: e.target.value }))} placeholder="https://whatsapp.com/channel/..." className="h-9 font-mono text-xs" />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.admins_only} onCheckedChange={checked => setForm(f => ({ ...f, admins_only: checked }))} />
          <span className="text-sm">Só os administradores postam</span>
          <Button size="sm" onClick={handleSave} disabled={updateSettings.isPending} className="ml-auto gap-1.5">
            <Save className="h-4 w-4" /> {updateSettings.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function toForm(page: WhatsappGroupPage): PageForm {
  return {
    slug: page.slug,
    store_slug: page.store_slug ?? '',
    title: page.title,
    h1: page.h1,
    meta_description: page.meta_description,
    intro: page.intro,
    content: page.content,
    faq: parseGroupFaq(page.faq),
    join_url: page.join_url ?? '',
    is_published: page.is_published,
    sort_order: page.sort_order,
  };
}

export function AdminWhatsappGroupsTab() {
  const { data: pages = [], isLoading } = useWhatsappGroupPages({ includeDrafts: true });
  const { data: stores = [] } = useStoreBrands();
  const savePage = useSaveWhatsappGroupPage();
  const deletePage = useDeleteWhatsappGroupPage();
  const [form, setForm] = useState<PageForm>(EMPTY_PAGE);
  const [editing, setEditing] = useState<string | null>(null);

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_PAGE);
  };

  const updateFaq = (index: number, patch: Partial<GroupFaqItem>) =>
    setForm(f => ({ ...f, faq: f.faq.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));

  const handleSave = async () => {
    const required: Array<[string, string]> = [
      ['slug', form.slug],
      ['título (SEO)', form.title],
      ['título da página (H1)', form.h1],
      ['descrição (SEO)', form.meta_description],
      ['resumo', form.intro],
    ];
    const missing = required.filter(([, value]) => !value.trim()).map(([name]) => name);
    if (missing.length) {
      toast({ title: 'Faltou preencher', description: missing.join(', '), variant: 'destructive' });
      return;
    }
    if (!SLUG_FORMAT.test(form.slug)) {
      toast({ title: 'Slug inválido', description: 'Use letras minúsculas, números e hífen. Ex.: mercado-livre', variant: 'destructive' });
      return;
    }
    if (form.join_url && !safeExternalUrl(form.join_url)) {
      toast({ title: 'Link de entrada inválido', description: 'Use um link que comece com https://', variant: 'destructive' });
      return;
    }

    try {
      await savePage.mutateAsync({
        id: editing ?? undefined,
        values: {
          slug: form.slug.trim(),
          store_slug: form.store_slug || null,
          title: form.title.trim(),
          h1: form.h1.trim(),
          meta_description: form.meta_description.trim(),
          intro: form.intro.trim(),
          content: form.content,
          faq: parseGroupFaq(form.faq) as unknown as WhatsappGroupPage['faq'],
          join_url: form.join_url.trim() || null,
          is_published: form.is_published,
          sort_order: Number(form.sort_order) || 0,
        },
      });
      toast({ title: editing ? 'Página atualizada!' : 'Página criada!' });
      cancelEdit();
    } catch (error) {
      toast({ title: 'Erro', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleDelete = async (page: WhatsappGroupPage) => {
    if (!confirm(`Excluir a página "${page.h1}"? O endereço ${groupPagePath(page.slug)} passa a dar 404.`)) return;
    try {
      await deletePage.mutateAsync(page.id);
      toast({ title: 'Página excluída' });
    } catch (error) {
      toast({ title: 'Erro', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <GroupInfoCard />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">
            {editing ? 'Editar página do grupo' : 'Nova página do grupo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Slug" hint={`"${GROUP_HUB_SLUG}" = /grupo-whatsapp. Outros = /grupo-whatsapp/<slug>.`}>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="mercado-livre" className="h-9 font-mono text-xs" />
            </Field>
            <Field label="Loja ligada" hint="O botão do WhatsApp na página dessa loja aponta para esta página.">
              <select
                value={form.store_slug}
                onChange={e => setForm(f => ({ ...f, store_slug: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Nenhuma</option>
                {stores.map(store => (
                  <option key={store.id} value={store.slug}>{store.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Título (SEO)" hint={`${form.title.length} caracteres. Ideal: até 55.`}>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Título da página (H1)">
              <Input value={form.h1} onChange={e => setForm(f => ({ ...f, h1: e.target.value }))} className="h-9" />
            </Field>
          </div>
          <Field label="Descrição (SEO)" hint={`${form.meta_description.length} caracteres. Ideal: até 155.`}>
            <Textarea value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} className="min-h-[60px] text-xs" />
          </Field>
          <Field label="Resumo (primeiro parágrafo)" hint="Fatos do grupo em uma ou duas frases: é o trecho que o Google e as IAs citam.">
            <Textarea value={form.intro} onChange={e => setForm(f => ({ ...f, intro: e.target.value }))} className="min-h-[60px] text-xs" />
          </Field>
          <Field label="Conteúdo (Markdown)" hint="Use ## para subtítulos, - para listas e [texto](/link) para links.">
            <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="min-h-[220px] font-mono text-xs" />
          </Field>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Perguntas frequentes</p>
            {form.faq.map((item, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-border p-3">
                <Input value={item.question} onChange={e => updateFaq(index, { question: e.target.value })} placeholder="Pergunta" className="h-9 text-xs" />
                <Textarea value={item.answer} onChange={e => updateFaq(index, { answer: e.target.value })} placeholder="Resposta" className="min-h-[50px] text-xs" />
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setForm(f => ({ ...f, faq: f.faq.filter((_, i) => i !== index) }))}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remover pergunta
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, faq: [...f.faq, { question: '', answer: '' }] }))} className="gap-1.5">
              <Plus className="h-4 w-4" /> Adicionar pergunta
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Link do botão Entrar no grupo" hint="Link Inteligente do Espelha Grupos. Vazio = link global (SEO & Config).">
              <Input value={form.join_url} onChange={e => setForm(f => ({ ...f, join_url: e.target.value }))} placeholder="https://espelhagrupos.com.br/g/..." className="h-9 font-mono text-xs" />
            </Field>
            <Field label="Ordem">
              <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="h-9" />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.is_published} onCheckedChange={checked => setForm(f => ({ ...f, is_published: checked }))} />
            <span className="text-sm">Publicada</span>
            <div className="ml-auto flex gap-2">
              {editing && <Button variant="ghost" size="sm" onClick={cancelEdit}><X className="mr-1 h-4 w-4" /> Cancelar</Button>}
              <Button size="sm" onClick={handleSave} disabled={savePage.isPending} className="gap-1.5">
                <Save className="h-4 w-4" /> {savePage.isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Páginas ({pages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
          ) : pages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma página criada ainda.</p>
          ) : (
            <div className="space-y-2">
              {pages.map(page => (
                <div key={page.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {page.h1} {!page.is_published && <span className="text-xs font-normal text-muted-foreground">(rascunho)</span>}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">{groupPagePath(page.slug)}</p>
                  </div>
                  <div className="flex gap-1">
                    <a href={groupPagePath(page.slug)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink className="h-3.5 w-3.5" /></Button>
                    </a>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(page.id); setForm(toForm(page)); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(page)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
