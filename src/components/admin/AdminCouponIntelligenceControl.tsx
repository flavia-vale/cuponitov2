import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Database, Loader2, Play, RefreshCcw, Radar, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json, Tables } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type CouponSource = Tables<'coupon_sources'>;
type CouponEvidence = Tables<'coupon_evidence'>;

type ScannerResult = {
  source_id: string;
  source_url: string;
  candidates_found: number;
  evidence_inserted: number;
  skipped_duplicates: number;
};

type ScannerResponse = {
  success?: boolean;
  message?: string;
  results?: ScannerResult[];
};

const SCAN_INTERVAL_OPTIONS = [15, 30, 60, 120, 360, 720, 1440];

function fmtDate(iso: string | null): string {
  return iso
    ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '—';
}

function fmtInterval(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours}h`;
}

function metadataValue(metadata: Json, key: string): string {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return '—';
  const value = (metadata as Record<string, Json | undefined>)[key];
  return typeof value === 'string' && value.trim() ? value : '—';
}

function statusBadge(status: string) {
  if (status === 'success') {
    return <Badge className="border-green-200 bg-green-500/10 text-green-700"><CheckCircle className="mr-1 h-3 w-3" />Sucesso</Badge>;
  }

  if (status === 'error') {
    return <Badge className="border-red-200 bg-red-500/10 text-red-700"><XCircle className="mr-1 h-3 w-3" />Erro</Badge>;
  }

  if (status === 'pending') {
    return <Badge className="border-yellow-200 bg-yellow-500/10 text-yellow-700"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
  }

  return <Badge variant="outline">{status}</Badge>;
}

function evidenceBadge(status: string) {
  if (status === 'pending_review') return <Badge variant="secondary">Revisão</Badge>;
  if (status === 'verified_public' || status === 'verified_by_partner') return <Badge className="bg-green-500/10 text-green-700">Verificado</Badge>;
  if (status === 'rejected' || status === 'expired_or_failed') return <Badge variant="destructive">Rejeitado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export function AdminCouponIntelligenceControl() {
  const [sources, setSources] = useState<CouponSource[]>([]);
  const [evidence, setEvidence] = useState<CouponEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingSource, setUpdatingSource] = useState<string | null>(null);
  const [scanningSource, setScanningSource] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sourcesRes, evidenceRes] = await Promise.all([
        supabase.from('coupon_sources').select('*').order('marketplace_slug').order('source_url'),
        supabase.from('coupon_evidence').select('*').order('observed_at', { ascending: false }).limit(10),
      ]);

      if (sourcesRes.error) throw sourcesRes.error;
      if (evidenceRes.error) throw evidenceRes.error;

      setSources((sourcesRes.data ?? []) as CouponSource[]);
      setEvidence((evidenceRes.data ?? []) as CouponEvidence[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao carregar inteligência de cupons: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const enabled = sources.filter(source => source.enabled).length;
    const pendingEvidence = evidence.filter(item => item.status === 'pending_review').length;

    return {
      enabled,
      pendingEvidence,
      totalSources: sources.length,
      totalEvidence: evidence.length,
    };
  }, [sources, evidence]);

  const toggleSource = async (source: CouponSource, enabled: boolean) => {
    setUpdatingSource(source.id);
    try {
      const payload = enabled
        ? { enabled, next_scan_at: new Date().toISOString(), last_error: null }
        : { enabled };

      const { error } = await supabase.from('coupon_sources').update(payload).eq('id', source.id);
      if (error) throw error;

      setSources(prev => prev.map(item => (
        item.id === source.id
          ? { ...item, enabled, next_scan_at: enabled ? new Date().toISOString() : item.next_scan_at, last_error: enabled ? null : item.last_error }
          : item
      )));
      toast.success(enabled ? 'Fonte habilitada para varredura' : 'Fonte pausada');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar fonte: ${message}`);
    } finally {
      setUpdatingSource(null);
    }
  };

  const updateInterval = async (source: CouponSource, minutes: number) => {
    setUpdatingSource(source.id);
    try {
      const { error } = await supabase
        .from('coupon_sources')
        .update({ scan_interval_minutes: minutes })
        .eq('id', source.id);

      if (error) throw error;

      setSources(prev => prev.map(item => (
        item.id === source.id ? { ...item, scan_interval_minutes: minutes } : item
      )));
      toast.success('Intervalo atualizado');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar intervalo: ${message}`);
    } finally {
      setUpdatingSource(null);
    }
  };

  const runScan = async (source: CouponSource) => {
    if (!source.enabled) {
      toast.warning('Habilite a fonte antes de executar uma varredura manual.');
      return;
    }

    setScanningSource(source.id);
    try {
      const { data, error } = await supabase.functions.invoke('scan-coupon-sources', {
        body: { source_id: source.id },
      });

      if (error) throw error;

      const response = data as ScannerResponse | null;
      const result = response?.results?.[0];

      if (!result) {
        toast.info(response?.message ?? 'Scanner executado sem novas evidências.');
      } else {
        toast.success(`${result.candidates_found} candidatos, ${result.evidence_inserted} evidências novas, ${result.skipped_duplicates} duplicadas`);
      }

      await load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao executar scanner: ${message}`);
    } finally {
      setScanningSource(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando inteligência de cupons...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Radar className="h-4 w-4 text-primary" />
            Controle de Inteligência de Cupons
          </CardTitle>
          <CardDescription>
            Gerencie fontes públicas e auditoria de evidências para marketplaces sem API oficial de cupons.
            As fontes nascem pausadas e só publicam evidências para revisão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Fontes</p>
              <p className="text-2xl font-bold">{stats.totalSources}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Ativas</p>
              <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Evidências recentes</p>
              <p className="text-2xl font-bold">{stats.totalEvidence}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingEvidence}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fontes monitoradas</h3>
          <Button variant="outline" size="sm" className="gap-2" onClick={load}>
            <RefreshCcw className="h-3.5 w-3.5" /> Atualizar
          </Button>
        </div>

        {sources.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma fonte cadastrada. Aplique a migration de inteligência de cupons para criar o seed do Mercado Livre.
            </CardContent>
          </Card>
        ) : sources.map(source => (
          <Card key={source.id} className={!source.enabled ? 'opacity-80' : ''}>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                    {source.name}
                    <Badge variant="outline">{source.marketplace_slug}</Badge>
                    {statusBadge(source.last_status)}
                  </CardTitle>
                  <CardDescription className="break-all">
                    {source.source_url}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={source.enabled}
                    disabled={updatingSource === source.id}
                    onCheckedChange={(checked) => toggleSource(source, checked)}
                  />
                  <span className="text-sm font-medium">{source.enabled ? 'Ativa' : 'Pausada'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Varredura a cada</span>
                  <Select
                    value={String(source.scan_interval_minutes)}
                    onValueChange={(value) => updateInterval(source, Number(value))}
                  >
                    <SelectTrigger className="h-7 w-28 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCAN_INTERVAL_OPTIONS.map(minutes => (
                        <SelectItem key={minutes} value={String(minutes)}>{fmtInterval(minutes)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground md:ml-auto">
                  <span>Última: {fmtDate(source.last_scan_at)}</span>
                  <span>Próxima: {fmtDate(source.next_scan_at)}</span>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Risco</p>
                  <p className="font-semibold">{source.risk_level}/10</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Compliance</p>
                  <p className="font-semibold">{metadataValue(source.metadata, 'compliance_status')}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="font-semibold">{source.source_type}</p>
                </div>
              </div>

              {source.last_error && (
                <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{source.last_error}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-2"
                  disabled={!source.enabled || scanningSource !== null}
                  onClick={() => runScan(source)}
                >
                  {scanningSource === source.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  Executar varredura agora
                </Button>
                {!source.enabled && (
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Habilitação manual obrigatória
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4 text-primary" />
            Evidências recentes
          </CardTitle>
          <CardDescription>
            Candidatos extraídos pelo scanner ficam em revisão antes de qualquer publicação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evidence.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma evidência recente encontrada.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Data</th>
                    <th className="px-3 py-2 text-left font-medium">Marketplace</th>
                    <th className="px-3 py-2 text-left font-medium">Código</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-right font-medium">Confiança</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {evidence.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 text-muted-foreground">{fmtDate(item.observed_at)}</td>
                      <td className="px-3 py-2">{item.marketplace_slug}</td>
                      <td className="px-3 py-2 font-mono font-semibold">{item.normalized_code || '—'}</td>
                      <td className="px-3 py-2">{evidenceBadge(item.status)}</td>
                      <td className="px-3 py-2 text-right font-medium">{Number(item.confidence_score).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
