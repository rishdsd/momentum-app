create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  unit text not null,
  weekly_target numeric not null default 1,
  overall_weight integer not null default 5,
  mode text not null default 'count',
  created_at timestamptz not null default now()
);

create table public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  amount numeric not null,
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  note text,
  logged_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.smart_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.smart_set_items (
  id uuid primary key default gen_random_uuid(),
  smart_set_id uuid not null references public.smart_sets(id) on delete cascade,
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  amount numeric not null
);

create table public.journal_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period text not null check (period in ('daily', 'weekly', 'monthly', 'yearly')),
  prompt text not null,
  sort_order integer not null default 0
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period text not null check (period in ('daily', 'weekly', 'monthly', 'yearly')),
  period_key text not null,
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  answers jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, period, period_key)
);

alter table public.profiles enable row level security;
alter table public.trackers enable row level security;
alter table public.logs enable row level security;
alter table public.smart_sets enable row level security;
alter table public.smart_set_items enable row level security;
alter table public.journal_prompts enable row level security;
alter table public.journal_entries enable row level security;

create policy "profiles are owned by user" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "trackers are owned by user" on public.trackers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "logs are owned by user" on public.logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "smart sets are owned by user" on public.smart_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "smart set items follow parent ownership" on public.smart_set_items
  for all using (
    exists (
      select 1 from public.smart_sets
      where smart_sets.id = smart_set_items.smart_set_id
      and smart_sets.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.smart_sets
      where smart_sets.id = smart_set_items.smart_set_id
      and smart_sets.user_id = auth.uid()
    )
  );

create policy "journal prompts are owned by user" on public.journal_prompts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "journal entries are owned by user" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
