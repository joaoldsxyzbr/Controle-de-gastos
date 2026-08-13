create table if not exists public.dashboard_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.dashboard_access enable row level security;
revoke all on public.dashboard_access from anon, authenticated;
grant select on public.dashboard_access to authenticated;

drop policy if exists "read_own_dashboard_access" on public.dashboard_access;
create policy "read_own_dashboard_access"
on public.dashboard_access
for select
to authenticated
using ((select auth.uid()) = user_id);
