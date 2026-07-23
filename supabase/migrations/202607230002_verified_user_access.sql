create or replace function public.is_verified_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where id = (select auth.uid())
      and email_confirmed_at is not null
  );
$$;

revoke all on function public.is_verified_user() from public;
grant execute on function public.is_verified_user() to authenticated;

drop policy if exists "members can read own membership" on public.members;
create policy "verified users can read own membership" on public.members
  for select to authenticated
  using ((select public.is_verified_user()) and (select auth.uid()) = user_id);

drop policy if exists "members can read own attempts" on public.assessment_attempts;
create policy "verified users can read own attempts" on public.assessment_attempts
  for select to authenticated
  using ((select public.is_verified_user()) and (select auth.uid()) = user_id);

drop policy if exists "members can create own attempts" on public.assessment_attempts;
create policy "verified users can create own attempts" on public.assessment_attempts
  for insert to authenticated
  with check ((select public.is_verified_user()) and (select auth.uid()) = user_id);

revoke insert, update, delete on public.members from anon, authenticated;
