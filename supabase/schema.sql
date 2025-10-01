-- Create table
create table if not exists public.pushes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  github_link text not null,
  comment text not null
);

-- Enable RLS
alter table public.pushes enable row level security;

-- Simple policy: allow anon to read, insert and delete (adjust for your needs)
create policy if not exists "Allow read" on public.pushes for select using (true);
create policy if not exists "Allow insert" on public.pushes for insert with check (true);
create policy if not exists "Allow delete" on public.pushes for delete using (true);
