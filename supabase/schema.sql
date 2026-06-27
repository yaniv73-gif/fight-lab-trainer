-- Run this in your Supabase SQL editor

-- Sessions (workout plans)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null, -- bjj | muay_thai | mma | bags | fitness
  sections jsonb not null default '[]',
  created_at timestamptz default now()
);

alter table sessions enable row level security;
create policy "Users own their sessions" on sessions
  for all using (auth.uid() = user_id);

-- Training logs (completed sessions)
create table training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references sessions(id) on delete set null,
  category text not null,
  notes text,
  created_at timestamptz default now()
);

alter table training_logs enable row level security;
create policy "Users own their logs" on training_logs
  for all using (auth.uid() = user_id);
