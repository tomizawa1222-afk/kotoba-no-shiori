-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (Managed by Clerk, synced via webhook or client)
-- Note: We use text for ID to match Clerk's User ID format, or UUID if you map it. 
-- Assuming Clerk IDs are strings (e.g., "user_..."), but database design said UUID.
-- We will use TEXT for ID to be safe with Clerk IDs, but if strictly UUID is required, mapping is needed.
-- Design said UUID, but Clerk IDs are strings. Let's use TEXT for the PK to avoid casting issues.
create table if not exists public.users (
  id text primary key,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Books table
create table if not exists public.books (
  isbn text primary key,
  title text not null,
  author text,
  cover_url text,
  publisher text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Quotes table
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references public.users(id) on delete cascade,
  book_isbn text not null references public.books(isbn) on delete cascade,
  content text not null,
  page_number int,
  privacy_settings text default 'public' check (privacy_settings in ('public', 'followers', 'private')),
  likes_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes table
create table if not exists public.likes (
  user_id text not null references public.users(id) on delete cascade,
  quote_id uuid not null references public.quotes(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, quote_id)
);

-- Book Statuses (Bookshelf) table
create table if not exists public.book_statuses (
  user_id text not null references public.users(id) on delete cascade,
  book_isbn text not null references public.books(isbn) on delete cascade,
  status text not null check (status in ('read', 'reading', 'want_to_read')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, book_isbn)
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.books enable row level security;
alter table public.quotes enable row level security;
alter table public.likes enable row level security;
alter table public.book_statuses enable row level security;

-- RLS Policies

-- Users
create policy "Public profiles are viewable by everyone" 
  on public.users for select using (true);
create policy "Users can update own profile" 
  on public.users for update using (auth.uid()::text = id);

-- Books
create policy "Books are viewable by everyone" 
  on public.books for select using (true);
create policy "Authenticated users can insert books" 
  on public.books for insert with check (auth.role() = 'authenticated');

-- Quotes
create policy "Public quotes are viewable by everyone" 
  on public.quotes for select using (privacy_settings = 'public');
create policy "Private quotes are viewable by owner" 
  on public.quotes for select using (auth.uid()::text = user_id);
create policy "Users can insert their own quotes" 
  on public.quotes for insert with check (auth.uid()::text = user_id);
create policy "Users can update their own quotes" 
  on public.quotes for update using (auth.uid()::text = user_id);
create policy "Users can delete their own quotes" 
  on public.quotes for delete using (auth.uid()::text = user_id);

-- Likes
create policy "Likes are viewable by everyone" 
  on public.likes for select using (true);
create policy "Users can insert their own likes" 
  on public.likes for insert with check (auth.uid()::text = user_id);
create policy "Users can delete their own likes" 
  on public.likes for delete using (auth.uid()::text = user_id);

-- Book Statuses
create policy "Statuses are viewable by everyone" 
  on public.book_statuses for select using (true);
create policy "Users can manage their own book statuses" 
  on public.book_statuses for all using (auth.uid()::text = user_id);

