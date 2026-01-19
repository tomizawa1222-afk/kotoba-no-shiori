-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Users Table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(50) unique not null,
  display_name varchar(100) not null,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Books Table
create table public.books (
  isbn varchar(20) primary key,
  title varchar(255) not null,
  author varchar(255),
  cover_url text,
  publisher varchar(100),
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Quotes Table
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  book_isbn varchar(20) references public.books(isbn) not null,
  content text not null,
  page_number int,
  privacy_settings varchar(20) default 'public' check (privacy_settings in ('public', 'followers', 'private')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes Table
create table public.likes (
  user_id uuid references public.users(id) not null,
  quote_id uuid references public.quotes(id) not null,
  created_at timestamptz default now(),
  primary key (user_id, quote_id)
);

-- Book Statuses Table
create table public.book_statuses (
  user_id uuid references public.users(id) not null,
  book_isbn varchar(20) references public.books(isbn) not null,
  status varchar(20) not null check (status in ('read', 'reading', 'want_to_read')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, book_isbn)
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.books enable row level security;
alter table public.quotes enable row level security;
alter table public.likes enable row level security;
alter table public.book_statuses enable row level security;

-- Users Policies
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- Books Policies
create policy "Books are viewable by everyone." on public.books
  for select using (true);

create policy "Authenticated users can insert books." on public.books
  for insert with check (auth.role() = 'authenticated');

-- Quotes Policies
create policy "Public quotes are viewable by everyone." on public.quotes
  for select using (privacy_settings = 'public');

create policy "Authenticated users can insert quotes." on public.quotes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own quotes." on public.quotes
  for update using (auth.uid() = user_id);

create policy "Users can delete own quotes." on public.quotes
  for delete using (auth.uid() = user_id);

-- Likes Policies
create policy "Likes are viewable by everyone." on public.likes
  for select using (true);

create policy "Authenticated users can insert likes." on public.likes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can delete own likes." on public.likes
  for delete using (auth.uid() = user_id);

-- Book Statuses Policies
create policy "Book statuses are viewable by everyone." on public.book_statuses
  for select using (true);

create policy "Users can insert/update own book status." on public.book_statuses
  for all using (auth.uid() = user_id);

