-- Sprint 3: hypotheses and experiments backlog for observability

create table if not exists public.marketing_growth_hypotheses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  source_signal text not null default 'dashboard',
  channel text not null default 'organic',
  stage text not null default 'acquisition',
  ice_impact integer not null default 5 check (ice_impact between 1 and 10),
  ice_confidence integer not null default 5 check (ice_confidence between 1 and 10),
  ice_ease integer not null default 5 check (ice_ease between 1 and 10),
  status text not null default 'planned' check (status in ('planned', 'running', 'validated', 'discarded')),
  owner text,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketing_growth_hypotheses_status_idx
  on public.marketing_growth_hypotheses (status);
create index if not exists marketing_growth_hypotheses_channel_idx
  on public.marketing_growth_hypotheses (channel);

alter table public.marketing_growth_hypotheses enable row level security;

create policy if not exists "marketing hypotheses read public"
  on public.marketing_growth_hypotheses for select
  using (true);
create policy if not exists "marketing hypotheses write authenticated"
  on public.marketing_growth_hypotheses for all
  to authenticated
  using (true)
  with check (true);
