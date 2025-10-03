-- ============================================
-- PUSHES TABLE
-- ============================================
create table if not exists public.pushes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  github_link text not null,
  comment text not null
);

-- Enable RLS
alter table public.pushes enable row level security;

-- Simple policy: allow anon to read, insert and delete (adjust for your needs)
drop policy if exists "Allow read" on public.pushes;
create policy "Allow read" on public.pushes for select using (true);

drop policy if exists "Allow insert" on public.pushes;
create policy "Allow insert" on public.pushes for insert with check (true);

drop policy if exists "Allow delete" on public.pushes;
create policy "Allow delete" on public.pushes for delete using (true);

-- ============================================
-- PROMPTS TABLE
-- ============================================
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  content text not null,
  category text,
  is_favorite boolean default false,
  tags text[]
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Policies for prompts
drop policy if exists "Allow read prompts" on public.prompts;
create policy "Allow read prompts" on public.prompts for select using (true);

drop policy if exists "Allow insert prompts" on public.prompts;
create policy "Allow insert prompts" on public.prompts for insert with check (true);

drop policy if exists "Allow update prompts" on public.prompts;
create policy "Allow update prompts" on public.prompts for update using (true);

drop policy if exists "Allow delete prompts" on public.prompts;
create policy "Allow delete prompts" on public.prompts for delete using (true);

-- ============================================
-- IDEAS/PROJECTS TABLE
-- ============================================
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null,
  status text default 'idea',
  priority text default 'medium',
  tags text[]
);

-- Enable RLS
alter table public.ideas enable row level security;

-- Policies for ideas
drop policy if exists "Allow read ideas" on public.ideas;
create policy "Allow read ideas" on public.ideas for select using (true);

drop policy if exists "Allow insert ideas" on public.ideas;
create policy "Allow insert ideas" on public.ideas for insert with check (true);

drop policy if exists "Allow update ideas" on public.ideas;
create policy "Allow update ideas" on public.ideas for update using (true);

drop policy if exists "Allow delete ideas" on public.ideas;
create policy "Allow delete ideas" on public.ideas for delete using (true);
