import { Activity, AlertTriangle, Gauge, Lightbulb, MousePointerClick, Search, Target, TrendingUp, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useMarketingFunnelByChannel,
  useMarketingGrowthHypotheses,
  useMarketingObservabilityAlerts,
  useMarketingObservabilityOverview,
  useMarketingObservabilityTrend,
  useMarketingSeoHealth,
} from '@/hooks/useMarketingObservability';

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function severityClass(severity: string) {
  if (severity === 'critical') return 'border-red-300 bg-red-50';
  if (severity === 'warning') return 'border-yellow-300 bg-yellow-50';
  return 'border-border';
}

export function AdminMarketingObservabilityTab() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useMarketingObservabilityOverview();
  const { data: trend = [], isLoading: trendLoading, error: trendError } = useMarketingObservabilityTrend();
  const { data: seoHealth, isLoading: seoLoading, error: seoError } = useMarketingSeoHealth();
  const { data: funnel = [], isLoading: funnelLoading, error: funnelError } = useMarketingFunnelByChannel();
  const { data: alerts = [], isLoading: alertsLoading, error: alertsError } = useMarketingObservabilityAlerts();
  const { data: hypotheses = [], isLoading: hypothesesLoading, error: hypothesesError } = useMarketingGrowthHypotheses();

  const stats = [
    { label: 'Sessões (14d)', value: overview?.sessions ?? 0, icon: Users, color: 'text-blue-500' },
    { label: 'Pageviews (14d)', value: overview?.pageViews ?? 0, icon: Activity, color: 'text-purple-500' },
    { label: 'Cliques CTA (14d)', value: overview?.ctaClicks ?? 0, icon: MousePointerClick, color: 'text-orange-500' },
    { label: 'Signups (14d)', value: overview?.signups ?? 0, icon: UserPlus, color: 'text-green-500' },
  ];



  const hasAnyError = overviewError || trendError || seoError || funnelError || alertsError || hypothesesError;

  const topOpportunity = funnel.length > 0
    ? [...funnel].sort((a, b) => b.sessions - a.sessions).find((item) => item.sessionToSignupRate < 1.5)
    : null;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Observabilidade Marketing</h1>
        <p className="text-sm text-muted-foreground">Sprints 3 e 4: hipóteses priorizadas, insights acionáveis e hardening de UX/performance.</p>
      </div>

      {hasAnyError ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">Algumas métricas falharam ao carregar. Verifique permissões RLS e dados das tabelas de observabilidade.</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewLoading ? '...' : s.value.toLocaleString('pt-BR')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" /> Conversão global (14d)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">{overviewLoading ? '...' : formatPercent(overview?.conversionRate ?? 0)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Search className="h-4 w-4 text-primary" /> SEO Health (14d)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {seoLoading ? <p className="text-muted-foreground">Carregando métricas SEO...</p> : (
              <>
                <p><strong>Indexação:</strong> {seoHealth?.indexedUrls ?? 0}/{seoHealth?.totalUrls ?? 0} ({formatPercent(seoHealth?.indexCoverageRate ?? 0)})</p>
                <p><strong>CTR média:</strong> {formatPercent((seoHealth?.averageCtr ?? 0) * 100)}</p>
                <p><strong>Posição média:</strong> {(seoHealth?.averagePosition ?? 0).toFixed(2)}</p>
                <p><strong>CWV Good:</strong> {formatPercent(seoHealth?.goodCwvRate ?? 0)}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Funil por canal (14d)</CardTitle></CardHeader>
          <CardContent>
            {funnelLoading ? <p className="text-sm text-muted-foreground">Carregando funil por canal...</p> : funnel.length === 0 ? <p className="text-sm text-muted-foreground">Sem dados do funil ainda.</p> : (
              <div className="space-y-2">
                {funnel.map((item) => (
                  <div key={item.channel} className="rounded-md border border-border px-3 py-2 text-sm">
                    <div className="flex items-center justify-between"><span className="font-medium capitalize">{item.channel}</span><span className="text-muted-foreground">{item.sessions} sessões</span></div>
                    <div className="mt-1 text-muted-foreground">CTA: {formatPercent(item.sessionToCtaRate)} · Signup: {formatPercent(item.sessionToSignupRate)} · Leads: {item.leads}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-4 w-4 text-primary" /> Insights acionáveis (Sprint 3)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topOpportunity ? (
              <div className="rounded-md border border-border px-3 py-2">
                <p className="font-medium">Canal com oportunidade: {topOpportunity.channel}</p>
                <p className="text-muted-foreground">Muitas sessões ({topOpportunity.sessions}) e baixa conversão ({formatPercent(topOpportunity.sessionToSignupRate)}). Priorizar teste de CTA/landing.</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Sem dados suficientes para insights automáticos.</p>
            )}
            {seoHealth && seoHealth.indexCoverageRate < 85 ? (
              <div className="rounded-md border border-border px-3 py-2">
                <p className="font-medium">Risco de indexação detectado</p>
                <p className="text-muted-foreground">Cobertura abaixo de 85%. Auditar sitemap, canonicals e cobertura no Search Console.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" /> Backlog de hipóteses (ICE)</CardTitle></CardHeader>
        <CardContent>
          {hypothesesLoading ? <p className="text-sm text-muted-foreground">Carregando hipóteses...</p> : hypotheses.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma hipótese cadastrada ainda.</p> : (
            <div className="space-y-2">
              {hypotheses.map((h) => (
                <div key={h.id} className="rounded-md border border-border px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2"><p className="font-medium">{h.title}</p><span className="text-xs text-muted-foreground">ICE {h.iceScore}</span></div>
                  <p className="text-muted-foreground">{h.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{h.channel} · {h.stage} · {h.status}{h.owner ? ` · owner: ${h.owner}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-primary" /> Alertas automáticos</CardTitle></CardHeader>
        <CardContent>{alertsLoading ? <p className="text-sm text-muted-foreground">Avaliando alertas...</p> : <div className="space-y-2">{alerts.map((alert) => <div key={alert.title} className={`rounded-md border px-3 py-2 text-sm ${severityClass(alert.severity)}`}><p className="font-medium">[{alert.severity.toUpperCase()}] {alert.title}</p><p className="text-muted-foreground">{alert.description}</p></div>)}</div>}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Gauge className="h-4 w-4 text-primary" /> Hardening (Sprint 4)</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>• Queries agregadas com janela temporal limitada (14/28d) para reduzir custo no admin.</p>
          <p>• Polling/cache com staleTime para evitar refetch excessivo e melhorar UX.</p>
          <p>• Layout responsivo sem overflow horizontal (mobile-safe).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Tendência diária (sessões e signups)</CardTitle></CardHeader>
        <CardContent>
          {trendLoading ? <p className="text-sm text-muted-foreground">Carregando série temporal...</p> : trend.length === 0 ? <p className="text-sm text-muted-foreground">Sem dados ainda. Comece a enviar eventos para preencher a observabilidade.</p> : (
            <div className="space-y-2">{trend.map((point) => <div key={point.metricDate} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"><span className="font-medium">{point.metricDate}</span><span className="text-muted-foreground">{point.sessions} sessões · {point.signups} signups</span></div>)}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
