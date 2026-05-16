-- Sprint 1 foundation for Marketing & Growth observability dashboard

create table if not exists public.marketing_observability_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  post_slug text,
  channel text,
  device_type text,
  session_id text,
  user_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists marketing_observability_events_occurred_at_idx
  on public.marketing_observability_events (occurred_at desc);
create index if not exists marketing_observability_events_event_name_idx
  on public.marketing_observability_events (event_name);
create index if not exists marketing_observability_events_page_path_idx
  on public.marketing_observability_events (page_path);

create table if not exists public.marketing_observability_daily (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null,
  channel text not null default 'unknown',
  page_path text,
  sessions integer not null default 0,
  page_views integer not null default 0,
  cta_clicks integer not null default 0,
  leads integer not null default 0,
  signups integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (metric_date, channel, page_path)
);

create index if not exists marketing_observability_daily_metric_date_idx
  on public.marketing_observability_daily (metric_date desc);
create index if not exists marketing_observability_daily_channel_idx
  on public.marketing_observability_daily (channel);

create table if not exists public.marketing_observability_seo_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  page_path text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6,4) not null default 0,
  average_position numeric(8,3),
  is_indexed boolean not null default true,
  cwv_status text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_date, page_path)
);

create index if not exists marketing_observability_seo_snapshots_date_idx
  on public.marketing_observability_seo_snapshots (snapshot_date desc);

alter table public.marketing_observability_events enable row level security;
alter table public.marketing_observability_daily enable row level security;
alter table public.marketing_observability_seo_snapshots enable row level security;

create policy if not exists "marketing observability read public"
  on public.marketing_observability_events for select
  using (true);
create policy if not exists "marketing observability write authenticated"
  on public.marketing_observability_events for insert
  to authenticated
  with check (true);

create policy if not exists "marketing observability daily read public"
  on public.marketing_observability_daily for select
  using (true);
create policy if not exists "marketing observability daily write authenticated"
  on public.marketing_observability_daily for all
  to authenticated
  using (true)
  with check (true);

create policy if not exists "marketing observability seo read public"
  on public.marketing_observability_seo_snapshots for select
  using (true);
create policy if not exists "marketing observability seo write authenticated"
  on public.marketing_observability_seo_snapshots for all
  to authenticated
  using (true)
  with check (true);
