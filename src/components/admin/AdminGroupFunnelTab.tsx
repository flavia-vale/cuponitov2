import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGroupJoinClicks } from '@/hooks/useGroupJoinClicks';
import { buildAdsConversionsCsv, summarizeJoinClicks, type JoinClickSummaryRow } from '@/lib/groupJoinTracking';

const PERIODS = [7, 30] as const;

/** Nome da ação de conversão criada no Google Ads (Metas → Conversões → Importar). Tem que ser igual lá. */
const ADS_CONVERSION_NAME = 'Clique Entrar no grupo';

function downloadCsv(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function RankedTable({ title, rows, emptyText }: { title: string; rows: JoinClickSummaryRow[]; emptyText: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {rows.slice(0, 15).map(row => (
              <li key={row.key} className="flex items-center justify-between gap-3 py-2">
                <span className="truncate font-medium text-foreground">{row.key}</span>
                <span className="shrink-0 font-bold tabular-nums">{row.clicks}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Captação do grupo: cliques no botão "Entrar no grupo" gravados pelo /entrar,
 * por dia, por página e por origem do botão. Mostra quais páginas (SEO/GEO)
 * trazem gente — o painel do Link Inteligente só conta o total.
 */
export function AdminGroupFunnelTab() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(7);
  const { data: rows, isLoading, error } = useGroupJoinClicks(days);
  const summary = useMemo(() => summarizeJoinClicks(rows ?? [], days), [rows, days]);
  const mobileShare = summary.total ? Math.round((summary.mobile / summary.total) * 100) : 0;
  const adsClicks = useMemo(() => (rows ?? []).filter(row => row.gclid), [rows]);
  const exportAdsConversions = () =>
    downloadCsv(
      `conversoes-google-ads-${new Date().toISOString().slice(0, 10)}.csv`,
      buildAdsConversionsCsv(adsClicks, ADS_CONVERSION_NAME)
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Captação do grupo</h2>
          <p className="text-sm text-muted-foreground">
            Cliques no botão "Entrar no grupo" do site. Entradas de fato: compare com o painel do Link Inteligente.
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(period => (
            <Button key={period} size="sm" variant={period === days ? 'default' : 'outline'} onClick={() => setDays(period)}>
              {period} dias
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="font-bold text-foreground">
              Google Ads: {isLoading ? '…' : adsClicks.length} cliques no botão vindos de anúncio em {days} dias
            </p>
            <p className="text-sm text-muted-foreground">
              Exporte e importe no Google Ads (Metas → Conversões → Carregar). A ação de conversão tem que se chamar "{ADS_CONVERSION_NAME}".
            </p>
          </div>
          <Button size="sm" variant="outline" disabled={adsClicks.length === 0} onClick={exportAdsConversions}>
            Exportar conversões (CSV)
          </Button>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          Não foi possível ler os cliques. Confira se a migration 20261018150000_group_join_clicks.sql foi rodada.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-black tabular-nums">{isLoading ? '…' : summary.total}</p>
            <p className="text-sm text-muted-foreground">cliques em {days} dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-black tabular-nums">{isLoading ? '…' : (summary.total / days).toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">por dia, em média</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-black tabular-nums">{isLoading ? '…' : `${mobileShare}%`}</p>
            <p className="text-sm text-muted-foreground">pelo celular</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RankedTable title="Por página" rows={summary.byPage} emptyText="Nenhum clique no período." />
        <RankedTable title="Por botão (origem)" rows={summary.byOrigin} emptyText="Nenhum clique no período." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Por dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border text-sm">
            {summary.byDay.map(row => (
              <li key={row.key} className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground">{row.key.split('-').reverse().join('/')}</span>
                <span className="font-bold tabular-nums">{row.clicks}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
