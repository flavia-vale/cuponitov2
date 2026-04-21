import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Store, Zap, ToggleRight } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import type { StoreBrand } from '@/lib/storeBranding';

type Coupon = Tables<'coupons'>;

interface Props {
  coupons: Coupon[];
  stores: StoreBrand[] | undefined;
}

export function AdminDashboardTab({ coupons, stores }: Props) {
  const active = coupons.filter((c) => c.status).length;
  const flash = coupons.filter((c) => c.is_flash).length;
  const storeCount = stores?.length ?? 0;

  const stats = [
    { label: 'Total de Cupons', value: coupons.length, icon: Ticket, color: 'text-primary' },
    { label: 'Cupons Ativos', value: active, icon: ToggleRight, color: 'text-green-500' },
    { label: 'Cupons Flash', value: flash, icon: Zap, color: 'text-yellow-500' },
    { label: 'Lojas Cadastradas', value: storeCount, icon: Store, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Dashboard</h1><p className="text-sm text-muted-foreground">Visão geral do Cuponito</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle><s.icon className={`h-4 w-4 ${s.color}`} /></CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Cupons por Loja</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stores?.map((store) => {
              const count = coupons.filter((c) => c.store === store.name).length;
              const activeCount = coupons.filter((c) => c.store === store.name && c.status).length;
              return (
                <div key={store.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted/30 overflow-hidden">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <span className="text-lg">{store.icon_emoji}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{store.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{activeCount} ativos / {count} total</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}