create table if not exists public.members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  invited_at timestamptz not null default now(),
  expires_at timestamptz,
  locked_until timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id text not null,
  submitted_at timestamptz not null,
  score_percent numeric(5, 2) not null check (score_percent >= 0 and score_percent <= 100),
  mastered boolean not null,
  response jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assessment_attempts_user_assessment_idx on public.assessment_attempts (user_id, assessment_id, submitted_at desc);

alter table public.members enable row level security;
alter table public.assessment_attempts enable row level security;

drop policy if exists "members can read own membership" on public.members;
create policy "members can read own membership" on public.members for select to authenticated using (auth.uid() = user_id);

drop policy if exists "members can read own attempts" on public.assessment_attempts;
create policy "members can read own attempts" on public.assessment_attempts for select to authenticated using (auth.uid() = user_id);

drop policy if exists "members can create own attempts" on public.assessment_attempts;
create policy "members can create own attempts" on public.assessment_attempts for insert to authenticated with check (auth.uid() = user_id);
