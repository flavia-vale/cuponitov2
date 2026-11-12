import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCouponClicks } from '@/hooks/useCouponClicks';
import { summarizeCouponClicks } from '@/lib/couponClickTracking';
import { RankedTable } from './AdminGroupFunnelTab';

const PERIODS = [7, 30] as const;

/**
 * Cliques em cupom gravados pelo /ir: por loja, fonte da visita, página e botão.
 * Venda de fato: compare com o painel da rede de afiliados (Lomadee, Awin, Amazon…).
 */
export function AdminCouponClicksTab() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(7);
  const { data: rows, isLoading, error } = useCouponClicks(days);
  const summary = useMemo(() => summarizeCouponClicks(rows ?? [], days), [rows, days]);
  const mobileShare = summary.total ? Math.round((summary.mobile / summary.total) * 100) : 0;
  const empty = 'Nenhum clique no período.';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Cliques em cupom</h2>
          <p className="text-sm text-muted-foreground">
            Cliques nos botões de cupom do site. Vendas de fato: compare com o painel da rede de afiliados.
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

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          Não foi possível ler os cliques. Confira se a migration 20261112120000_coupon_clicks.sql foi rodada.
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
        <RankedTable title="Por loja" rows={summary.byStore} emptyText={empty} />
        <RankedTable title="Por fonte (de onde a pessoa chegou ao site)" rows={summary.bySource} emptyText={empty} />
        <RankedTable title="Por página" rows={summary.byPage} emptyText={empty} />
        <RankedTable title="Por botão (origem)" rows={summary.byOrigin} emptyText={empty} />
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
