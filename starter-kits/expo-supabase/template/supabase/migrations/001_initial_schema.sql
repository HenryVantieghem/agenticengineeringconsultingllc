-- ExpoLaunch Initial Schema
-- Run this migration against your Supabase project to set up the database.
-- Dashboard: SQL Editor > New Query > Paste & Run

-- ============================================================================
-- Tables
-- ============================================================================

-- Profiles (extends auth.users with app-specific fields)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts (main content table)
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  likes_count int default 0,
  created_at timestamptz default now()
);

-- Notifications (in-app notification center)
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index idx_posts_user_id on posts(user_id);
create index idx_posts_created_at on posts(created_at desc);
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_created_at on notifications(created_at desc);
create index idx_notifications_unread on notifications(user_id) where read = false;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table profiles enable row level security;
alter table posts enable row level security;
alter table notifications enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Posts: anyone can read, owner can create/update/delete
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

create policy "Users can create posts"
  on posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- Notifications: only owner can read and update
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- ============================================================================
-- Functions
-- ============================================================================

-- Auto-create profile when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update the updated_at timestamp on profile changes
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- Increment likes count (called via supabase.rpc)
create or replace function increment_likes(post_id uuid)
returns void as $$
begin
  update posts
  set likes_count = likes_count + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- Storage Buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Storage policies: authenticated users can upload, anyone can view public buckets
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update own avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

-- ============================================================================
-- Realtime
-- ============================================================================

alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table notifications;
