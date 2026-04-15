import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Trash2, Zap, Sparkles, Plus, Save, Menu, ArrowLeft } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { useStoreBrands } from '@/hooks/useStoreBrands';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab';
import { AdminStoresTab } from '@/components/admin/AdminStoresTab';
import { AdminSeoTab } from '@/components/admin/AdminSeoTab';
import { AdminBlogTab } from '@/components/admin/AdminBlogTab';

type Coupon = Tables<'coupons'>;

interface DraftCoupon { store: string; title: string; description: string; code: string; discount: string; link: string; expiry: string; is_flash: boolean; }
type LinkOption = { label: string; url: string };

const STORE_LINK_OPTIONS: Record<string, LinkOption[]> = {
  'Mercado Livre': [{ label: 'Lista', url: 'https://mercadolivre.com/sec/1Psi79H' }, { label: 'Digitar link', url: '' }],
  Shopee: [{ label: 'Cupons diários', url: 'https://s.shopee.com.br/10ynrTMQNa' }, { label: 'Insira o código', url: 'https://s.shopee.com.br/9Kdvnbetie' }, { label: 'Digitar link', url: '' }],
  Amazon: [{ label: 'Ofertas do dia', url: 'https://amzn.to/4t7ww4D' }, { label: 'Digitar link', url: '' }],
};

function getLinksForStore(store: string): LinkOption[] { return STORE_LINK_OPTIONS[store] || [{ label: 'Digitar link', url: '' }]; }
function getDefaultLinkForStore(store: string): LinkOption { return getLinksForStore(store)[0]; }

function detectStoreFromText(text: string): string | null {
  const firstLine = text.split('\n')[0]?.toLowerCase() || '';
  if (firstLine.includes('shopee')) return 'Shopee';
  if (firstLine.includes('mercado livre') || firstLine.includes('mercadolivre')) return 'Mercado Livre';
  if (firstLine.includes('amazon')) return 'Amazon';
  return null;
}

function extractDrafts(text: string, fallbackStore: string): { drafts: DraftCoupon[]; detectedStore: string } {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const detectedStore = detectStoreFromText(text) || fallbackStore;
  const defaultLink = getDefaultLinkForStore(detectedStore);
  const drafts: DraftCoupon[] = [];
  for (const line of lines) {
    const startsWithEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(line);
    const hasOff = /off/i.test(line);
    if (!startsWithEmoji && !hasOff) continue;
    const moneyMatch = line.match(/R\$\s?(\d+[.,]?\d*)/);
    const pctMatch = line.match(/(\d+[.,]?\d*)\s?%/);
    if (!moneyMatch && !pctMatch) continue;
    const discount = moneyMatch ? `R$ ${moneyMatch[1]}` : `${pctMatch![1]}%`;
    const title = line.replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]+/gu, '').trim();
    drafts.push({ store: detectedStore, title, description: '', code: '', discount, link: defaultLink.url, expiry: '', is_flash: false });
  }
  return { drafts, detectedStore };
}

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
  head: () => ({ meta: [{ title: 'Admin | Cuponito' }, { name: 'robots', content: 'noindex, nofollow' }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('cupons');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [drafts, setDrafts] = useState<DraftCoupon[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [draftLinkSelections, setDraftLinkSelections] = useState<Record<number, string>>({});

  const defaultStore = 'Mercado Livre';
  const defaultLinks = getLinksForStore(defaultStore);
  const [form, setForm] = useState<DraftCoupon>({ store: defaultStore, title: '', description: '', code: '', discount: '', link: defaultLinks[0].url, expiry: '', is_flash: false });
  const [selectedLinkOption, setSelectedLinkOption] = useState(defaultLinks[0].label);
  const { data: stores, refetch: refetchStores } = useStoreBrands();

  const fetchCoupons = async () => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) toast({ title: 'Erro ao carregar cupons', description: error.message, variant: 'destructive' });
    else setCoupons(data || []);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: '/admin/login' }); return; }
      setLoading(false); fetchCoupons();
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) navigate({ to: '/admin/login' }); });
    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleStoreChange = (store: string) => { const links = getLinksForStore(store); setSelectedLinkOption(links[0].label); setForm((p) => ({ ...p, store, link: links[0].url })); };
  const handleLinkOptionChange = (label: string) => { setSelectedLinkOption(label); const option = getLinksForStore(form.store).find((l) => l.label === label); setForm((p) => ({ ...p, link: option?.url || '' })); };

  const handleExtract = () => {
    const result = extractDrafts(rawText, form.store);
    if (result.drafts.length === 0) { toast({ title: 'Nenhum dado encontrado' }); return; }
    const defaultLink = getDefaultLinkForStore(result.detectedStore);
    const selections: Record<number, string> = {};
    result.drafts.forEach((_, i) => { selections[i] = defaultLink.label; });
    setDrafts(result.drafts); setDraftLinkSelections(selections);
    toast({ title: `${result.drafts.length} rascunho(s) extraído(s)` });
  };

  const updateDraft = (index: number, field: keyof DraftCoupon, value: string | boolean) => { setDrafts((p) => p.map((d, i) => i === index ? { ...d, [field]: value } : d)); };
  const handleDraftLinkOption = (index: number, label: string) => { const store = drafts[index]?.store || 'Amazon'; const option = getLinksForStore(store).find((l) => l.label === label); setDraftLinkSelections((p) => ({ ...p, [index]: label })); updateDraft(index, 'link', option?.url || ''); };
  const handleDraftStoreChange = (index: number, store: string) => { updateDraft(index, 'store', store); const links = getLinksForStore(store); setDraftLinkSelections((p) => ({ ...p, [index]: links[0].label })); updateDraft(index, 'link', links[0].url); };
  const removeDraft = (index: number) => { setDrafts((p) => p.filter((_, i) => i !== index)); };

  const saveDraft = async (draft: DraftCoupon) => {
    const { error } = await supabase.from('coupons').insert({ store: draft.store, title: draft.title, description: draft.description, code: draft.code, discount: draft.discount, link: draft.link, expiry: draft.expiry, is_flash: draft.is_flash });
    if (error) { toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' }); return false; }
    return true;
  };

  const saveAllDrafts = async () => { let saved = 0; for (const d of drafts) { if (await saveDraft(d)) saved++; } toast({ title: `${saved} cupom(ns) salvo(s)!` }); setDrafts([]); setRawText(''); fetchCoupons(); };
  const saveSingleForm = async () => { if (await saveDraft(form)) { toast({ title: 'Cupom salvo!' }); setForm((p) => ({ ...p, title: '', description: '', code: '', discount: '', expiry: '' })); fetchCoupons(); } };
  const toggleStatus = async (id: string, current: boolean) => { const { error } = await supabase.from('coupons').update({ status: !current }).eq('id', id); if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' }); else setCoupons((p) => p.map((c) => c.id === id ? { ...c, status: !current } : c)); };
  const deleteCoupon = async (id: string) => { const { error } = await supabase.from('coupons').delete().eq('id', id); if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' }); else { setCoupons((p) => p.filter((c) => c.id !== id)); toast({ title: 'Cupom excluído' }); } };
  const handleLogout = async () => { await supabase.auth.signOut(); navigate({ to: '/admin/login' }); };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <button onClick={() => setSidebarOpen(true)} className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card md:hidden" aria-label="Abrir menu admin"><Menu className="h-4 w-4" /></button>
      <div className="hidden md:block"><AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} /></div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}><SheetContent side="left" className="w-56 p-0 md:hidden [&>button]:hidden"><AdminSidebar variant="mobile" activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} onLogout={handleLogout} /></SheetContent></Sheet>

      <main className="flex-1 overflow-auto md:ml-56">
        <div className="mx-auto max-w-5xl px-4 py-6 pt-14 md:pt-6">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/20">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </Link>
          
          {activeTab === 'dashboard' && <AdminDashboardTab coupons={coupons} stores={stores} />}
          {activeTab === 'lojas' && <AdminStoresTab stores={stores} refetchStores={refetchStores} />}
          {activeTab === 'blog' && <AdminBlogTab />}
          {activeTab === 'seo' && <AdminSeoTab />}
          {activeTab === 'cupons' && (
            <div className="space-y-6">
              <div><h1 className="text-2xl font-bold text-foreground">Cupons</h1><p className="text-sm text-muted-foreground">Extraia, cadastre e gerencie cupons</p></div>
              <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Extrator Inteligente</CardTitle></CardHeader><CardContent>
                <Textarea placeholder="Cole aqui o texto com códigos, links e valores..." value={rawText} onChange={(e) => setRawText(e.target.value)} className="mb-3 min-h-[100px]" />
                <Button onClick={handleExtract} className="gap-1.5"><Zap className="h-4 w-4" /> Extrair dados</Button>
                {drafts.length > 0 && (
                  <div className="mt-5 space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">{drafts.length} rascunho(s) — revise e salve:</h3>
                    {drafts.map((draft, index) => {
                      const linkOptions = getLinksForStore(draft.store);
                      const selectedLink = draftLinkSelections[index] || '';
                      const isManualLink = selectedLink === 'Digitar link' || !selectedLink;
                      return (
                        <div key={index} className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
                          <div className="flex flex-wrap items-end gap-2">
                            <div className="w-28"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Loja</label><Select value={draft.store} onValueChange={(v) => handleDraftStoreChange(index, v)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Amazon">Amazon</SelectItem><SelectItem value="Shopee">Shopee</SelectItem><SelectItem value="Mercado Livre">Mercado Livre</SelectItem></SelectContent></Select></div>
                            <div className="min-w-[140px] flex-1"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Título</label><Input value={draft.title} onChange={(e) => updateDraft(index, 'title', e.target.value)} className="h-9 text-xs" /></div>
                            <div className="w-20"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Desconto</label><Input value={draft.discount} onChange={(e) => updateDraft(index, 'discount', e.target.value)} className="h-9 text-xs" /></div>
                            <div className="w-28"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Código</label><Input value={draft.code} onChange={(e) => updateDraft(index, 'code', e.target.value)} className="h-9 text-xs font-mono" /></div>
                            <div className="w-28"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Validade</label><Input type="date" value={draft.expiry} onChange={(e) => updateDraft(index, 'expiry', e.target.value)} className="h-9 text-xs" /></div>
                          </div>
                          <div className="flex flex-wrap items-end gap-2">
                            <div className="w-36"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Link pré-selecionado</label><Select value={selectedLink} onValueChange={(v) => handleDraftLinkOption(index, v)}><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Escolha..." /></SelectTrigger><SelectContent>{linkOptions.map((o) => <SelectItem key={o.label} value={o.label}>{o.label}</SelectItem>)}</SelectContent></Select></div>
                            <div className="min-w-[140px] flex-1"><label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Link</label><Input value={draft.link} onChange={(e) => updateDraft(index, 'link', e.target.value)} readOnly={!isManualLink} className={`h-9 text-xs ${!isManualLink ? 'cursor-not-allowed bg-muted/50' : ''}`} /></div>
                            <div className="flex items-center gap-1.5 pb-0.5"><Checkbox checked={draft.is_flash} onCheckedChange={(v) => updateDraft(index, 'is_flash', !!v)} id={`flash-${index}`} /><label htmlFor={`flash-${index}`} className="text-[10px] font-medium">⚡</label></div>
                            <Button variant="ghost" size="icon" onClick={() => removeDraft(index)} className="h-9 w-9 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      );
                    })}
                    <Button onClick={saveAllDrafts} className="gap-1.5"><Save className="h-4 w-4" /> Salvar todos ({drafts.length})</Button>
                  </div>
                )}
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="h-4 w-4 text-primary" /> Adicionar cupom manual</CardTitle></CardHeader><CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Loja *</label><Select value={form.store} onValueChange={handleStoreChange}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mercado Livre">Mercado Livre</SelectItem><SelectItem value="Shopee">Shopee</SelectItem><SelectItem value="Amazon">Amazon</SelectItem></SelectContent></Select></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Link Pré-selecionado</label><Select value={selectedLinkOption} onValueChange={handleLinkOptionChange}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{getLinksForStore(form.store).map((o) => <SelectItem key={o.label} value={o.label}>{o.label}</SelectItem>)}</SelectContent></Select></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Link afiliado</label><Input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} readOnly={selectedLinkOption !== 'Digitar link'} className={`h-11 ${selectedLinkOption !== 'Digitar link' ? 'cursor-not-allowed bg-muted/50' : ''}`} /></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Título</label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="h-11" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="h-11" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Código</label><Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className="h-11 font-mono" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Desconto</label><Input value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} className="h-11" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Validade</label><Input type="date" value={form.expiry} onChange={(e) => setForm((p) => ({ ...p, expiry: e.target.value }))} className="h-11" /></div>
                </div>
                <div className="mt-3 flex items-center gap-4"><div className="flex items-center gap-2"><Checkbox checked={form.is_flash} onCheckedChange={(v) => setForm((p) => ({ ...p, is_flash: !!v }))} id="flash-manual" /><label htmlFor="flash-manual" className="text-sm font-medium">Cupom Relâmpago</label></div><Button onClick={saveSingleForm} className="ml-auto h-11 gap-1.5"><Save className="h-4 w-4" /> Salvar</Button></div>
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">Cupons cadastrados ({coupons.length})</CardTitle></CardHeader><CardContent>
                {coupons.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum cupom cadastrado ainda.</p> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Loja</TableHead><TableHead>Título</TableHead><TableHead>Código</TableHead><TableHead>Desconto</TableHead><TableHead>Validade</TableHead><TableHead>Flash</TableHead><TableHead>Ativo</TableHead><TableHead className="w-16" /></TableRow></TableHeader><TableBody>
                    {coupons.map((c) => (<TableRow key={c.id} className={!c.status ? 'opacity-50' : ''}><TableCell className="text-sm font-medium">{c.store}</TableCell><TableCell className="max-w-[200px] truncate text-sm">{c.title || '—'}</TableCell><TableCell className="font-mono text-sm">{c.code || '—'}</TableCell><TableCell className="text-sm">{c.discount || '—'}</TableCell><TableCell className="text-sm">{c.expiry || '—'}</TableCell><TableCell>{c.is_flash ? '⚡' : '—'}</TableCell><TableCell><Switch checked={c.status} onCheckedChange={() => toggleStatus(c.id, c.status)} /></TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => deleteCoupon(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
                  </TableBody></Table></div>
                )}
              </CardContent></Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}