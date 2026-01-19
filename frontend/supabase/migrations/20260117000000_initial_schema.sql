-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. Create Tables (Create first, define policies later)
-- ============================================

-- Users Table
create table public.users (
  id text primary key, -- Clerk User ID
  email text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);
comment on table public.users is 'Clerkユーザー情報の同期テーブル';

-- Teams Table
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now() not null
);
comment on table public.teams is 'プロジェクト/チーム情報';

-- Team Members Table
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id text not null references public.users(id) on delete cascade,
  role text check (role in ('admin', 'member')) not null default 'member',
  joined_at timestamptz default now() not null,
  unique(team_id, user_id)
);
comment on table public.team_members is 'チーム所属情報';

-- Tasks Table
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  assignee_id text not null references public.users(id),
  due_date date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
comment on table public.tasks is 'タスク情報';


-- ============================================
-- 2. RLS & Policies
-- ============================================

-- Users Policies
alter table public.users enable row level security;

create policy "Users are viewable by everyone" on public.users
  for select to authenticated using (true);

create policy "Users can update their own profile" on public.users
  for update to authenticated
  using (auth.uid()::text = id)
  with check (auth.uid()::text = id);


-- Teams Policies
alter table public.teams enable row level security;

create policy "Users can view teams they belong to" on public.teams
  for select to authenticated
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()::text
    )
  );

create policy "Users can create teams" on public.teams
  for insert to authenticated
  with check (true);


-- Team Members Policies
alter table public.team_members enable row level security;

create policy "Users can view members of their teams" on public.team_members
  for select to authenticated
  using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()::text
    )
  );

create policy "Admins can add members" on public.team_members
  for insert to authenticated
  with check (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()::text
      and tm.role = 'admin'
    )
  );


-- Tasks Policies
alter table public.tasks enable row level security;

create policy "Users can access tasks in their teams" on public.tasks
  for all to authenticated
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = tasks.team_id
      and team_members.user_id = auth.uid()::text
    )
  );


-- ============================================
-- 3. Realtime Setup
-- ============================================
alter publication supabase_realtime add table public.tasks;
