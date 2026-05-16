import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MarketingObservabilityOverview {
  sessions: number;
  pageViews: number;
  ctaClicks: number;
  leads: number;
  signups: number;
  conversionRate: number;
}

interface MarketingObservabilityTrendPoint {
  metricDate: string;
  sessions: number;
  signups: number;
}

interface MarketingFunnelByChannel {
  channel: string;
  sessions: number;
  ctaClicks: number;
  leads: number;
  signups: number;
  sessionToSignupRate: number;
  sessionToCtaRate: number;
}

interface MarketingSeoHealth {
  totalUrls: number;
  indexedUrls: number;
  indexCoverageRate: number;
  averageCtr: number;
  averagePosition: number;
  goodCwvRate: number;
}

interface MarketingAlert {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
}

const DAYS_WINDOW = 14;

type DailyRow = {
  metric_date: string;
  channel: string;
  sessions: number;
  page_views: number;
  cta_clicks: number;
  leads: number;
  signups: number;
};

type SeoRow = {
  snapshot_date: string;
  page_path: string;
  ctr: number;
  average_position: number | null;
  is_indexed: boolean;
  cwv_status: string;
};

function formatDate(daysBack: number, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() - daysBack);
  return date.toISOString().slice(0, 10);
}

export function useMarketingObservabilityOverview() {
  return useQuery<MarketingObservabilityOverview>({
    queryKey: ['marketing-observability-overview', DAYS_WINDOW],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_observability_daily')
        .select('sessions,page_views,cta_clicks,leads,signups')
        .gte('metric_date', formatDate(DAYS_WINDOW));

      if (error) throw new Error(error.message);

      const totals = ((data || []) as Array<Record<string, number>>).reduce(
        (acc, row) => ({
          sessions: acc.sessions + Number(row.sessions || 0),
          pageViews: acc.pageViews + Number(row.page_views || 0),
          ctaClicks: acc.ctaClicks + Number(row.cta_clicks || 0),
          leads: acc.leads + Number(row.leads || 0),
          signups: acc.signups + Number(row.signups || 0),
        }),
        { sessions: 0, pageViews: 0, ctaClicks: 0, leads: 0, signups: 0 },
      );

      return {
        ...totals,
        conversionRate: totals.sessions > 0 ? (totals.signups / totals.sessions) * 100 : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingObservabilityTrend() {
  return useQuery<MarketingObservabilityTrendPoint[]>({
    queryKey: ['marketing-observability-trend', DAYS_WINDOW],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_observability_daily')
        .select('metric_date,sessions,signups')
        .gte('metric_date', formatDate(DAYS_WINDOW))
        .order('metric_date', { ascending: true });

      if (error) throw new Error(error.message);

      return ((data || []) as Array<Record<string, string | number>>).map((row) => ({
        metricDate: String(row.metric_date || ''),
        sessions: Number(row.sessions || 0),
        signups: Number(row.signups || 0),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingFunnelByChannel() {
  return useQuery<MarketingFunnelByChannel[]>({
    queryKey: ['marketing-observability-funnel-channel', DAYS_WINDOW],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_observability_daily')
        .select('channel,sessions,cta_clicks,leads,signups')
        .gte('metric_date', formatDate(DAYS_WINDOW));

      if (error) throw new Error(error.message);

      const grouped = new Map<string, { sessions: number; ctaClicks: number; leads: number; signups: number }>();

      ((data || []) as Array<Record<string, string | number>>).forEach((row) => {
        const channel = String(row.channel || 'unknown');
        const current = grouped.get(channel) || { sessions: 0, ctaClicks: 0, leads: 0, signups: 0 };
        current.sessions += Number(row.sessions || 0);
        current.ctaClicks += Number(row.cta_clicks || 0);
        current.leads += Number(row.leads || 0);
        current.signups += Number(row.signups || 0);
        grouped.set(channel, current);
      });

      return Array.from(grouped.entries())
        .map(([channel, value]) => ({
          channel,
          ...value,
          sessionToSignupRate: value.sessions > 0 ? (value.signups / value.sessions) * 100 : 0,
          sessionToCtaRate: value.sessions > 0 ? (value.ctaClicks / value.sessions) * 100 : 0,
        }))
        .sort((a, b) => b.sessions - a.sessions);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingSeoHealth() {
  return useQuery<MarketingSeoHealth>({
    queryKey: ['marketing-observability-seo-health', DAYS_WINDOW],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_observability_seo_snapshots')
        .select('snapshot_date,page_path,ctr,average_position,is_indexed,cwv_status')
        .gte('snapshot_date', formatDate(DAYS_WINDOW));

      if (error) throw new Error(error.message);

      const rows = (data || []) as SeoRow[];
      const totalUrls = rows.length;
      const indexedUrls = rows.filter((row) => row.is_indexed).length;
      const averageCtr = totalUrls > 0 ? rows.reduce((acc, row) => acc + Number(row.ctr || 0), 0) / totalUrls : 0;
      const positionRows = rows.filter((row) => row.average_position !== null);
      const averagePosition = positionRows.length > 0
        ? positionRows.reduce((acc, row) => acc + Number(row.average_position || 0), 0) / positionRows.length
        : 0;
      const goodCwvCount = rows.filter((row) => row.cwv_status.toLowerCase() === 'good').length;

      return {
        totalUrls,
        indexedUrls,
        indexCoverageRate: totalUrls > 0 ? (indexedUrls / totalUrls) * 100 : 0,
        averageCtr,
        averagePosition,
        goodCwvRate: totalUrls > 0 ? (goodCwvCount / totalUrls) * 100 : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingObservabilityAlerts() {
  return useQuery<MarketingAlert[]>({
    queryKey: ['marketing-observability-alerts'],
    queryFn: async () => {
      const now = new Date();
      const cutoff28 = formatDate(28, now);
      const cutoff7 = formatDate(7, now);

      const { data, error } = await supabase
        .from('marketing_observability_daily')
        .select('metric_date,channel,sessions,page_views,cta_clicks,leads,signups')
        .gte('metric_date', cutoff28)
        .order('metric_date', { ascending: true });

      if (error) throw new Error(error.message);

      const rows = (data || []) as DailyRow[];
      if (rows.length === 0) {
        return [{ severity: 'info', title: 'Sem dados suficientes', description: 'Ainda não há dados para alertas. Inicie a ingestão diária.' }];
      }

      const recent = rows.filter((row) => row.metric_date >= cutoff7);
      const baseline = rows.filter((row) => row.metric_date < cutoff7);

      const sumRecentSessions = recent.reduce((acc, row) => acc + Number(row.sessions || 0), 0);
      const sumBaselineSessions = baseline.reduce((acc, row) => acc + Number(row.sessions || 0), 0);
      const recentSignupRate = sumRecentSessions > 0 ? recent.reduce((acc, row) => acc + Number(row.signups || 0), 0) / sumRecentSessions : 0;
      const baselineSignupRate = sumBaselineSessions > 0 ? baseline.reduce((acc, row) => acc + Number(row.signups || 0), 0) / sumBaselineSessions : 0;

      const alerts: MarketingAlert[] = [];

      if (sumBaselineSessions > 0 && sumRecentSessions < sumBaselineSessions * 0.8) {
        alerts.push({ severity: 'critical', title: 'Queda de tráfego', description: 'Sessões dos últimos 7 dias caíram mais de 20% vs período anterior.' });
      }

      if (baselineSignupRate > 0 && recentSignupRate < baselineSignupRate * 0.85) {
        alerts.push({ severity: 'warning', title: 'Conversão em queda', description: 'Taxa de signup/sessão caiu mais de 15% vs baseline recente.' });
      }

      if (alerts.length === 0) {
        alerts.push({ severity: 'info', title: 'Operação estável', description: 'Sem alertas críticos detectados nas regras da Sprint 2.' });
      }

      return alerts;
    },
    staleTime: 2 * 60 * 1000,
  });
}


interface MarketingHypothesis {
  id: string;
  title: string;
  description: string;
  channel: string;
  stage: string;
  status: string;
  owner: string | null;
  dueDate: string | null;
  iceScore: number;
}

export function useMarketingGrowthHypotheses() {
  return useQuery<MarketingHypothesis[]>({
    queryKey: ['marketing-growth-hypotheses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_growth_hypotheses')
        .select('id,title,description,channel,stage,status,owner,due_date,ice_impact,ice_confidence,ice_ease')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw new Error(error.message);

      return ((data || []) as Array<Record<string, string | number | null>>).map((row) => {
        const impact = Number(row.ice_impact || 0);
        const confidence = Number(row.ice_confidence || 0);
        const ease = Number(row.ice_ease || 0);

        return {
          id: String(row.id || ''),
          title: String(row.title || ''),
          description: String(row.description || ''),
          channel: String(row.channel || 'unknown'),
          stage: String(row.stage || 'unknown'),
          status: String(row.status || 'planned'),
          owner: row.owner ? String(row.owner) : null,
          dueDate: row.due_date ? String(row.due_date) : null,
          iceScore: Number(((impact * confidence * ease) / 100).toFixed(2)),
        };
      });
    },
    staleTime: 2 * 60 * 1000,
  });
}
