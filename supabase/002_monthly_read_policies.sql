do $$
declare
  t text;
begin
  foreach t in array array['09-2026','10-2026','11-2026','12-2026','01-2027','02-2027','03-2027','04-2027']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to authenticated', t);
    execute format('drop policy if exists %I on public.%I', 'dashboard_read_owner', t);
    execute format('create policy %I on public.%I for select to authenticated using (exists (select 1 from public.dashboard_access a where a.user_id = (select auth.uid())))', 'dashboard_read_owner', t);
  end loop;
end $$;
