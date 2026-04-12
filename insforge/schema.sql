create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.market_trends (
  trend_id text primary key,
  title text not null,
  description text not null,
  industry text not null,
  category text not null,
  status text not null check (status in ('emerging', 'growing', 'peaking', 'declining')),
  trend_score numeric(6, 2) not null,
  mention_count integer not null,
  growth_rate numeric(6, 2) not null,
  sentiment_score numeric(6, 4) not null,
  top_keywords text not null,
  detected_at timestamptz not null
);

create table if not exists public.market_insights (
  insight_id text primary key,
  title text not null,
  summary text not null,
  insight_type text not null check (insight_type in ('kpi', 'opportunity', 'alert', 'summary')),
  industry text not null,
  generated_at timestamptz not null,
  related_trend_ids text default '',
  metric_value numeric(12, 2),
  metric_unit text,
  change_percent numeric(8, 2),
  period text
);

create table if not exists public.market_recommendations (
  recommendation_id text primary key,
  trend_id text not null references public.market_trends(trend_id) on delete cascade,
  title text not null,
  description text not null,
  product_category text not null,
  target_demographic text not null,
  confidence_score numeric(5, 4) not null check (confidence_score >= 0 and confidence_score <= 1),
  estimated_revenue_potential text not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  status text not null default 'new' check (status in ('new', 'reviewed', 'accepted', 'dismissed')),
  action_plan text not null,
  created_at timestamptz not null
);

create table if not exists public.market_sources (
  source_id text primary key,
  trend_id text not null references public.market_trends(trend_id) on delete cascade,
  platform text not null,
  mention_count integer not null,
  engagement_rate numeric(8, 4) not null,
  sentiment_breakdown text not null,
  collected_at timestamptz not null
);

create table if not exists public.market_demographics (
  demographic_id text primary key,
  trend_id text not null references public.market_trends(trend_id) on delete cascade,
  age_group text not null,
  gender text not null,
  location text not null,
  affinity_score numeric(8, 4) not null,
  engagement_index numeric(8, 4) not null,
  purchase_intent numeric(8, 4) not null,
  top_interests text not null
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  industry text not null default 'All',
  business_name text not null default '',
  has_completed_setup boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendation_feedback (
  user_id uuid not null references auth.users(id) on delete cascade,
  recommendation_id text not null references public.market_recommendations(recommendation_id) on delete cascade,
  status text not null check (status in ('reviewed', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, recommendation_id)
);

create table if not exists public.trend_bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id text not null references public.market_trends(trend_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, trend_id)
);

create index if not exists market_trends_industry_idx on public.market_trends (industry);
create index if not exists market_trends_status_idx on public.market_trends (status);
create index if not exists market_insights_industry_idx on public.market_insights (industry);
create index if not exists market_insights_type_idx on public.market_insights (insight_type);
create index if not exists market_recommendations_trend_idx on public.market_recommendations (trend_id);
create index if not exists market_recommendations_status_idx on public.market_recommendations (status);
create index if not exists market_recommendations_priority_idx on public.market_recommendations (priority);
create index if not exists market_sources_trend_idx on public.market_sources (trend_id);
create index if not exists market_demographics_trend_idx on public.market_demographics (trend_id);
create index if not exists recommendation_feedback_user_status_idx on public.recommendation_feedback (user_id, status);
create index if not exists trend_bookmarks_user_idx on public.trend_bookmarks (user_id);

alter table public.market_trends enable row level security;
alter table public.market_insights enable row level security;
alter table public.market_recommendations enable row level security;
alter table public.market_sources enable row level security;
alter table public.market_demographics enable row level security;
alter table public.user_preferences enable row level security;
alter table public.recommendation_feedback enable row level security;
alter table public.trend_bookmarks enable row level security;

drop policy if exists "market_trends_public_read" on public.market_trends;
create policy "market_trends_public_read"
on public.market_trends
for select
to anon, authenticated
using (true);

drop policy if exists "market_insights_public_read" on public.market_insights;
create policy "market_insights_public_read"
on public.market_insights
for select
to anon, authenticated
using (true);

drop policy if exists "market_recommendations_public_read" on public.market_recommendations;
create policy "market_recommendations_public_read"
on public.market_recommendations
for select
to anon, authenticated
using (true);

drop policy if exists "market_sources_public_read" on public.market_sources;
create policy "market_sources_public_read"
on public.market_sources
for select
to anon, authenticated
using (true);

drop policy if exists "market_demographics_public_read" on public.market_demographics;
create policy "market_demographics_public_read"
on public.market_demographics
for select
to anon, authenticated
using (true);

drop policy if exists "user_preferences_select_own" on public.user_preferences;
create policy "user_preferences_select_own"
on public.user_preferences
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "user_preferences_insert_own" on public.user_preferences;
create policy "user_preferences_insert_own"
on public.user_preferences
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "user_preferences_update_own" on public.user_preferences;
create policy "user_preferences_update_own"
on public.user_preferences
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "user_preferences_delete_own" on public.user_preferences;
create policy "user_preferences_delete_own"
on public.user_preferences
for delete
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "recommendation_feedback_select_own" on public.recommendation_feedback;
create policy "recommendation_feedback_select_own"
on public.recommendation_feedback
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "recommendation_feedback_insert_own" on public.recommendation_feedback;
create policy "recommendation_feedback_insert_own"
on public.recommendation_feedback
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "recommendation_feedback_update_own" on public.recommendation_feedback;
create policy "recommendation_feedback_update_own"
on public.recommendation_feedback
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "recommendation_feedback_delete_own" on public.recommendation_feedback;
create policy "recommendation_feedback_delete_own"
on public.recommendation_feedback
for delete
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "trend_bookmarks_select_own" on public.trend_bookmarks;
create policy "trend_bookmarks_select_own"
on public.trend_bookmarks
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "trend_bookmarks_insert_own" on public.trend_bookmarks;
create policy "trend_bookmarks_insert_own"
on public.trend_bookmarks
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "trend_bookmarks_delete_own" on public.trend_bookmarks;
create policy "trend_bookmarks_delete_own"
on public.trend_bookmarks
for delete
to authenticated
using (user_id = (select auth.uid()));

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row
execute function public.set_updated_at();

drop trigger if exists recommendation_feedback_set_updated_at on public.recommendation_feedback;
create trigger recommendation_feedback_set_updated_at
before update on public.recommendation_feedback
for each row
execute function public.set_updated_at();
