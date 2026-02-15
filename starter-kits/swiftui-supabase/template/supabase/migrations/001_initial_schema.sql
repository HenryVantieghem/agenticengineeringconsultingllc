-- SwiftLaunch Initial Schema
-- Run this migration in your Supabase SQL Editor or via CLI

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES
-- ============================================================================

create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    bio text check (char_length(bio) <= 150),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

comment on table public.profiles is 'User profiles linked to auth.users';

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Users can delete their own profile"
    on public.profiles for delete
    using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ============================================================================
-- POSTS
-- ============================================================================

create table if not exists public.posts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    content text not null check (char_length(content) >= 1 and char_length(content) <= 2000),
    image_url text,
    likes_count integer default 0 not null,
    created_at timestamptz default now() not null
);

comment on table public.posts is 'User posts / feed items';

create index idx_posts_user_id on public.posts(user_id);
create index idx_posts_created_at on public.posts(created_at desc);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
    on public.posts for select
    using (true);

create policy "Authenticated users can create posts"
    on public.posts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own posts"
    on public.posts for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
    on public.posts for delete
    using (auth.uid() = user_id);

-- ============================================================================
-- POST LIKES
-- ============================================================================

create table if not exists public.post_likes (
    post_id uuid references public.posts(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    primary key (post_id, user_id)
);

comment on table public.post_likes is 'Tracks which users liked which posts';

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
    on public.post_likes for select
    using (true);

create policy "Authenticated users can like posts"
    on public.post_likes for insert
    with check (auth.uid() = user_id);

create policy "Users can unlike posts"
    on public.post_likes for delete
    using (auth.uid() = user_id);

-- Function to update likes_count on posts
create or replace function public.update_likes_count()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    if tg_op = 'INSERT' then
        update public.posts set likes_count = likes_count + 1 where id = new.post_id;
        return new;
    elsif tg_op = 'DELETE' then
        update public.posts set likes_count = likes_count - 1 where id = old.post_id;
        return old;
    end if;
    return null;
end;
$$;

create or replace trigger on_like_change
    after insert or delete on public.post_likes
    for each row execute procedure public.update_likes_count();

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

create table if not exists public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    type text not null check (type in ('like', 'comment', 'follow', 'system', 'subscription')),
    title text not null,
    body text,
    reference_id uuid,
    is_read boolean default false not null,
    created_at timestamptz default now() not null
);

comment on table public.notifications is 'In-app notifications';

create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_created_at on public.notifications(created_at desc);
create index idx_notifications_unread on public.notifications(user_id) where is_read = false;

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
    on public.notifications for select
    using (auth.uid() = user_id);

create policy "Users can update their own notifications"
    on public.notifications for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================

create table if not exists public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null unique,
    product_id text not null,
    original_transaction_id text,
    environment text,
    is_active boolean default true not null,
    expires_at timestamptz,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

comment on table public.subscriptions is 'StoreKit 2 subscription records synced from client';

create index idx_subscriptions_user_id on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
    on public.subscriptions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
    on public.subscriptions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
    on public.subscriptions for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- ============================================================================
-- DEVICE TOKENS (for push notifications)
-- ============================================================================

create table if not exists public.device_tokens (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    token text not null,
    platform text not null default 'ios',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique(user_id, token)
);

comment on table public.device_tokens is 'APNs device tokens for push notifications';

alter table public.device_tokens enable row level security;

create policy "Users can manage their own device tokens"
    on public.device_tokens for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
    ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
    ('post-images', 'post-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- Storage policies for avatars
create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users can update their own avatar"
    on storage.objects for update
    using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users can delete their own avatar"
    on storage.objects for delete
    using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- Storage policies for post images
create policy "Post images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'post-images');

create policy "Users can upload post images"
    on storage.objects for insert
    with check (
        bucket_id = 'post-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users can delete their own post images"
    on storage.objects for delete
    using (
        bucket_id = 'post-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================================
-- REALTIME
-- ============================================================================

alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.notifications;

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();

create trigger set_subscriptions_updated_at
    before update on public.subscriptions
    for each row execute procedure public.set_updated_at();

create trigger set_device_tokens_updated_at
    before update on public.device_tokens
    for each row execute procedure public.set_updated_at();
