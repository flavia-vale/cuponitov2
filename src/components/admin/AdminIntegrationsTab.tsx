import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Play, RefreshCcw, Plus, Pencil, Trash2, Clock,
  CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Sparkles,
  Store, Search, CalendarX
} from 'lucide-react';

const UTIL_STORAGE_KEY = 'cuponito_util_prefs';

function loadUtilPrefs() {
  try {
    const raw = localStorage.getItem(UTIL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveUtilPref(key: string, value: unknown) {
  const prefs = loadUtilPrefs();
  localStorage.setItem(UTIL_STORAGE_KEY, JSON.stringify({ ...prefs, [key]: value }));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Provider { id: string; name: string; slug: string; active: boolean }

interface Account {
  id: string;
  name: string;
  publisher_id: string;
  api_token: string;
  active: boolean;
  provider_id: string;
  integration_providers: { name: string; slug: string }
}

interface Schedule {
  id: string;
  account_id: string;
  interval_hours: number;
  enabled: boolean;
  last_run_at: string | null;
  next_run_at: string;
}

interface SyncLog {
  id: string;
  account_id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  records_inserted: number;
  records_updated: number;
  records_skipped: number;
  error_message: string | null;
}

interface LomadeeStoreFilter {
  id: string;
  account_id: string;
  lomadee_store_id: string;
  store_name: string;
  store_logo: string;
  enabled: boolean;
}

const EMPTY_ACCOUNT = { name: '', publisher_id: '', api_token: '', provider_id: '', active: true };

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminIntegrationsTab() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [expiringCoupons, setExpiringCoupons] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<string | null>(null);

  // Utility routines state (persisted via localStorage)
  const [enrichInterval, setEnrichInterval] = useState(24);
  const [enrichLastRun, setEnrichLastRun] = useState<string | null>(null);
  const [expireInterval, setExpireInterval] = useState(24);
  const [expireLastRun, setExpireLastRun] = useState<string | null>(null);

  const [accountDialog, setAccountDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Partial<typeof EMPTY_ACCOUNT> & { id?: string }>(EMPTY_ACCOUNT);

  // Lomadee store filters
  const [lomadeeFilters, setLomadeeFilters] = useState<Record<string, LomadeeStoreFilter[]>>({});
  const [expandedStores, setExpandedStores] = useState<string | null>(null);
  const [storeSearch, setStoreSearch] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, aRes, sRes, lRes, fRes] = await Promise.all([
      supabase.from('integration_providers').select('*').order('name'),
      supabase.from('affiliate_accounts').select('*, integration_providers(name, slug)').order('name'),
      supabase.from('sync_schedules').select('*'),
      supabase.from('sync_logs').select('*').order('started_at', { ascending: false }).limit(50),
      supabase.from('lomadee_store_filters').select('*').order('store_name'),
    ]);
    if (pRes.data) setProviders(pRes.data as Provider[]);
    if (aRes.data) setAccounts(aRes.data as Account[]);
    if (sRes.data) setSchedules(sRes.data as Schedule[]);
    if (lRes.data) setLogs(lRes.data as SyncLog[]);
    if (fRes.data) {
      const grouped = (fRes.data as LomadeeStoreFilter[]).reduce((acc, f) => {
        if (!acc[f.account_id]) acc[f.account_id] = [];
        acc[f.account_id].push(f);
        return acc;
      }, {} as Record<string, LomadeeStoreFilter[]>);
      setLomadeeFilters(grouped);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const prefs = loadUtilPrefs();
    if (prefs.enrich_interval) setEnrichInterval(prefs.enrich_interval);
    if (prefs.enrich_last_run) setEnrichLastRun(prefs.enrich_last_run);
    if (prefs.expire_interval) setExpireInterval(prefs.expire_interval);
    if (prefs.expire_last_run) setExpireLastRun(prefs.expire_last_run);
  }, []);

  // ── Sync manual ─────────────────────────────────────────────────────────────

  const runSync = async (account: Account) => {
    setSyncing(account.id);
    try {
      const providerSlug = account.integration_providers?.slug;
      const fnMap: Record<string, string> = { awin: 'sync-awin', lomadee: 'sync-lomadee', rakuten: 'sync-rakuten' };
      const fn = fnMap[providerSlug];
      if (!fn) throw new Error(`Sem função para provedor "${providerSlug}"`);

      const { data, error } = await supabase.functions.invoke(fn, {
        body: { account_id: account.id }
      });
      if (error) throw error;

      const { inserted = 0, updated = 0, skipped = 0 } = data?.stats || {};
      toast.success(`${account.name}: ${inserted} novos, ${updated} atualizados`);
      await load();
    } catch (err: any) {
      toast.error(`Erro ao sincronizar: ${err.message}`);
    } finally {
      setSyncing(null);
    }
  };

  // ── Lomadee: toggle de loja individual ──────────────────────────────────────

  const toggleLomadeeStore = async (filter: LomadeeStoreFilter, enabled: boolean) => {
    // Atualização otimista
    setLomadeeFilters(prev => ({
      ...prev,
      [filter.account_id]: prev[filter.account_id]?.map(f =>
        f.id === filter.id ? { ...f, enabled } : f
      ) ?? [],
    }));

    const { error } = await supabase
      .from('lomadee_store_filters')
      .update({ enabled })
      .eq('id', filter.id);

    if (error) {
      toast.error('Erro ao salvar');
      // Rollback
      setLomadeeFilters(prev => ({
        ...prev,
        [filter.account_id]: prev[filter.account_id]?.map(f =>
          f.id === filter.id ? { ...f, enabled: !enabled } : f
        ) ?? [],
      }));
    }
  };

  // ── Lomadee: ativar/desativar todas ─────────────────────────────────────────

  const toggleAllLomadeeStores = async (accountId: string, enabled: boolean) => {
    const filters = lomadeeFilters[accountId] ?? [];
    if (filters.length === 0) return;

    // Atualização otimista
    setLomadeeFilters(prev => ({
      ...prev,
      [accountId]: prev[accountId]?.map(f => ({ ...f, enabled })) ?? [],
    }));

    const { error } = await supabase
      .from('lomadee_store_filters')
      .update({ enabled })
      .in('id', filters.map(f => f.id));

    if (error) {
      toast.error('Erro ao salvar');
      await load();
    }
  };

  // ── Intervalo de agendamento ─────────────────────────────────────────────────

  const updateInterval = async (accountId: string, hours: number) => {
    const schedule = schedules.find(s => s.account_id === accountId);
    if (!schedule) return;
    const { error } = await supabase
      .from('sync_schedules')
      .update({ interval_hours: hours })
      .eq('id', schedule.id);
    if (!error) {
      setSchedules(prev => prev.map(s => s.account_id === accountId ? { ...s, interval_hours: hours } : s));
      toast.success('Intervalo atualizado');
    }
  };

  const toggleSchedule = async (accountId: string, enabled: boolean) => {
    const schedule = schedules.find(s => s.account_id === accountId);
    if (!schedule) return;
    await supabase.from('sync_schedules').update({ enabled }).eq('id', schedule.id);
    setSchedules(prev => prev.map(s => s.account_id === accountId ? { ...s, enabled } : s));
  };

  // ── Enriquecimento de lojas ──────────────────────────────────────────────────

  const enrichStores = async (force = false) => {
    setEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-store', { body: { force } });
      if (error) throw error;
      const updated = data?.results?.filter((r: any) => r.updated).length ?? 0;
      const total = data?.results?.length ?? 0;
      const now = new Date().toISOString();
      setEnrichLastRun(now);
      saveUtilPref('enrich_last_run', now);
      toast.success(`${updated} de ${total} lojas enriquecidas com logo e cor`);
    } catch (err: any) {
      toast.error(`Erro ao enriquecer lojas: ${err.message}`);
    } finally {
      setEnriching(false);
    }
  };

  const runExpireCoupons = async () => {
    setExpiringCoupons(true);
    try {
      const { data, error } = await supabase.functions.invoke('expire-coupons', {});
      if (error) throw error;
      const now = new Date().toISOString();
      setExpireLastRun(now);
      saveUtilPref('expire_last_run', now);
      toast.success(`${data?.deleted_count ?? 0} cupons vencidos excluídos`);
    } catch (err: any) {
      toast.error(`Erro ao expirar cupons: ${err.message}`);
    } finally {
      setExpiringCoupons(false);
    }
  };

  // ── CRUD de contas ────────────────────────────────────────────────────────────

  const openNewAccount = () => {
    setEditingAccount({ ...EMPTY_ACCOUNT, provider_id: providers[0]?.id ?? '' });
    setAccountDialog(true);
  };

  const openEditAccount = (acc: Account) => {
    setEditingAccount({ id: acc.id, name: acc.name, publisher_id: acc.publisher_id, api_token: acc.api_token, provider_id: acc.provider_id, active: acc.active });
    setAccountDialog(true);
  };

  const saveAccount = async () => {
    if (!editingAccount.name || !editingAccount.provider_id) {
      toast.error('Nome e provedor são obrigatórios');
      return;
    }

    const payload = {
      name: editingAccount.name,
      publisher_id: editingAccount.publisher_id ?? '',
      api_token: editingAccount.api_token ?? '',
      provider_id: editingAccount.provider_id,
      active: editingAccount.active ?? true,
    };

    if (editingAccount.id) {
      const { error } = await supabase.from('affiliate_accounts').update(payload).eq('id', editingAccount.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Conta atualizada');
    } else {
      const { data, error } = await supabase.from('affiliate_accounts').insert(payload).select('id').single();
      if (error) { toast.error(error.message); return; }
      await supabase.from('sync_schedules').insert({ account_id: data.id, interval_hours: 6 });
      toast.success('Conta criada com agendamento padrão de 6h');
    }

    setAccountDialog(false);
    await load();
  };

  const deleteAccount = async (id: string, name: string) => {
    if (!confirm(`Excluir conta "${name}"? Isso removerá os logs e agendamentos vinculados.`)) return;
    await supabase.from('affiliate_accounts').delete().eq('id', id);
    toast.success('Conta removida');
    await load();
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getSchedule = (accountId: string) => schedules.find(s => s.account_id === accountId);

  const getAccountLogs = (accountId: string) => logs.filter(l => l.account_id === accountId).slice(0, 5);

  const fmtDate = (iso: string | null) => iso
    ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '—';

  const statusBadge = (status: string) => {
    if (status === 'success') return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Sucesso</Badge>;
    if (status === 'error') return <Badge className="bg-red-500/10 text-red-600 border-red-200"><XCircle className="h-3 w-3 mr-1" />Erro</Badge>;
    return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Rodando</Badge>;
  };

  if (loading) return <div className="flex justify-center py-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando integrações...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Integrações</h2>
          <p className="text-sm text-muted-foreground">Gerencie provedores de afiliados, contas e sincronizações</p>
        </div>
        <Button onClick={openNewAccount} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Nova Conta
        </Button>
      </div>

      {/* ── Provedores ── */}
      <div className="flex flex-wrap gap-2">
        {providers.map(p => (
          <Badge key={p.id} variant="outline" className={p.active ? 'border-primary/40 text-primary' : 'opacity-50'}>
            {p.name}
          </Badge>
        ))}
      </div>

      {/* ── Rotinas ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rotinas</h3>

        {/* Logo & Cor das Lojas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Logo & Cor das Lojas
            </CardTitle>
            <CardDescription>
              Busca logo oficial e cor da marca para lojas sem imagem via Brandfetch.
              Requer a secret <code className="text-xs bg-muted px-1 rounded">BRANDFETCH_API_KEY</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">A cada</span>
                <Select
                  value={String(enrichInterval)}
                  onValueChange={(v) => {
                    const h = Number(v);
                    setEnrichInterval(h);
                    saveUtilPref('enrich_interval', h);
                  }}
                >
                  <SelectTrigger className="h-7 w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 6, 12, 24, 48].map(h => (
                      <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                <span>Última: {fmtDate(enrichLastRun)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" className="gap-2" disabled={enriching} onClick={() => enrichStores(false)}>
                {enriching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Enriquecer lojas sem logo
              </Button>
              <Button size="sm" variant="outline" className="gap-2" disabled={enriching} onClick={() => enrichStores(true)}>
                {enriching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                Forçar todas as lojas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Apagar Cupons Vencidos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarX className="h-4 w-4 text-destructive" />
              Apagar Cupons Vencidos
            </CardTitle>
            <CardDescription>
              Remove todos os cupons com data de expiração no passado. Execute periodicamente para manter a base limpa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">A cada</span>
                <Select
                  value={String(expireInterval)}
                  onValueChange={(v) => {
                    const h = Number(v);
                    setExpireInterval(h);
                    saveUtilPref('expire_interval', h);
                  }}
                >
                  <SelectTrigger className="h-7 w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 6, 12, 24, 48].map(h => (
                      <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                <span>Última: {fmtDate(expireLastRun)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="gap-2"
                disabled={expiringCoupons}
                onClick={runExpireCoupons}
              >
                {expiringCoupons ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Apagar cupons vencidos agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Contas ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contas de Afiliado</h3>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma conta configurada. Clique em "Nova Conta" para começar.</p>
        ) : accounts.map(account => {
          const schedule = getSchedule(account.id);
          const accountLogs = getAccountLogs(account.id);
          const isLogsExpanded = expandedLogs === account.id;
          const isLomadee = account.integration_providers?.slug === 'lomadee';
          const filters = lomadeeFilters[account.id] ?? [];
          const enabledCount = filters.filter(f => f.enabled).length;
          const isStoresExpanded = expandedStores === account.id;
          const search = storeSearch[account.id] ?? '';
          const filteredStores = filters.filter(f =>
            f.store_name.toLowerCase().includes(search.toLowerCase())
          );

          return (
            <Card key={account.id} className={`border ${!account.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {account.name}
                      <Badge variant="outline" className="text-xs font-normal">
                        {account.integration_providers?.name}
                      </Badge>
                      {!account.active && <Badge variant="secondary" className="text-xs">Inativa</Badge>}
                    </CardTitle>
                    <CardDescription className="mt-0.5">
                      Publisher ID: <code className="text-xs bg-muted px-1 rounded">{account.publisher_id || '—'}</code>
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditAccount(account)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteAccount(account.id, account.name)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Agendamento */}
                {schedule && (
                  <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/40 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(v) => toggleSchedule(account.id, v)}
                      />
                      <span className="text-sm font-medium">Auto-sync</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">A cada</span>
                      <Select
                        value={String(schedule.interval_hours)}
                        onValueChange={(v) => updateInterval(account.id, Number(v))}
                      >
                        <SelectTrigger className="h-7 w-24 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 6, 12, 24, 48].map(h => (
                            <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Última: {fmtDate(schedule.last_run_at)}</span>
                      <span>Próxima: {fmtDate(schedule.next_run_at)}</span>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    disabled={syncing !== null}
                    onClick={() => runSync(account)}
                  >
                    {syncing === account.id
                      ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                      : <Play className="h-3.5 w-3.5" />}
                    Sincronizar agora
                  </Button>

                  {accountLogs.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-muted-foreground"
                      onClick={() => setExpandedLogs(isLogsExpanded ? null : account.id)}
                    >
                      Histórico ({accountLogs.length})
                      {isLogsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                </div>

                {/* Logs */}
                {isLogsExpanded && accountLogs.length > 0 && (
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Data</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                          <th className="px-3 py-2 text-right font-medium">Novos</th>
                          <th className="px-3 py-2 text-right font-medium">Atualizados</th>
                          <th className="px-3 py-2 text-left font-medium">Erro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {accountLogs.map(log => (
                          <tr key={log.id} className="hover:bg-muted/30">
                            <td className="px-3 py-2 text-muted-foreground">{fmtDate(log.started_at)}</td>
                            <td className="px-3 py-2">{statusBadge(log.status)}</td>
                            <td className="px-3 py-2 text-right font-medium text-green-600">+{log.records_inserted}</td>
                            <td className="px-3 py-2 text-right font-medium text-blue-600">~{log.records_updated}</td>
                            <td className="px-3 py-2 text-muted-foreground truncate max-w-[200px]" title={log.error_message ?? ''}>
                              {log.error_message ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Seção exclusiva Lomadee: filtro de lojas ── */}
                {isLomadee && (
                  <div className="rounded-lg border border-dashed">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Lojas Lomadee</span>
                        {filters.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {enabledCount} / {filters.length} ativas
                          </Badge>
                        )}
                        {filters.length === 0 && (
                          <span className="text-xs text-muted-foreground">nenhuma loja ainda</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {filters.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">descobertas automaticamente na 1ª sincronização</span>
                        )}
                        {filters.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-muted-foreground h-7 text-xs"
                            onClick={() => setExpandedStores(isStoresExpanded ? null : account.id)}
                          >
                            {isStoresExpanded ? 'Recolher' : 'Gerenciar'}
                            {isStoresExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    {isStoresExpanded && filters.length > 0 && (
                      <div className="border-t px-4 pb-4 pt-3 space-y-3">
                        {/* Controles */}
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                              className="h-8 pl-8 text-sm"
                              placeholder="Buscar loja..."
                              value={search}
                              onChange={e => setStoreSearch(prev => ({ ...prev, [account.id]: e.target.value }))}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs shrink-0"
                            onClick={() => toggleAllLomadeeStores(account.id, true)}
                          >
                            Ativar todas
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs shrink-0"
                            onClick={() => toggleAllLomadeeStores(account.id, false)}
                          >
                            Desativar todas
                          </Button>
                        </div>

                        {/* Lista de lojas */}
                        <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                          {filteredStores.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma loja encontrada</p>
                          )}
                          {filteredStores.map(filter => (
                            <div
                              key={filter.id}
                              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${filter.enabled ? 'bg-primary/5' : 'hover:bg-muted/40'}`}
                            >
                              {filter.store_logo ? (
                                <img
                                  src={filter.store_logo}
                                  alt={filter.store_name}
                                  className="h-6 w-6 rounded object-contain shrink-0"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className="h-6 w-6 rounded bg-muted shrink-0" />
                              )}
                              <span className="flex-1 text-sm truncate">{filter.store_name}</span>
                              <Switch
                                checked={filter.enabled}
                                onCheckedChange={v => toggleLomadeeStore(filter, v)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Dialog: Nova/Editar Conta ── */}
      <Dialog open={accountDialog} onOpenChange={setAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount.id ? 'Editar Conta' : 'Nova Conta de Afiliado'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Provedor</Label>
              <Select
                value={editingAccount.provider_id}
                onValueChange={(v) => setEditingAccount(prev => ({ ...prev, provider_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o provedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Nome amigável</Label>
              <Input
                placeholder="ex: Casas Bahia - Awin"
                value={editingAccount.name}
                onChange={(e) => setEditingAccount(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Publisher ID</Label>
              <Input
                placeholder="ex: 2740940"
                value={editingAccount.publisher_id}
                onChange={(e) => setEditingAccount(prev => ({ ...prev, publisher_id: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Token de acesso (API)</Label>
              <Input
                type="password"
                placeholder="Token será salvo com segurança"
                value={editingAccount.api_token}
                onChange={(e) => setEditingAccount(prev => ({ ...prev, api_token: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={editingAccount.active}
                onCheckedChange={(v) => setEditingAccount(prev => ({ ...prev, active: v }))}
              />
              <Label>Conta ativa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAccountDialog(false)}>Cancelar</Button>
            <Button onClick={saveAccount}>{editingAccount.id ? 'Salvar' : 'Criar conta'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
