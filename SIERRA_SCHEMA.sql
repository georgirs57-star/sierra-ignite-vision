-- ============================================================
-- SIERRA — Schéma initial (à exécuter dans Supabase SQL Editor)
-- ============================================================

-- 1) profiles ------------------------------------------------
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  name        text,
  level       text,
  xp          integer not null default 0,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, name, level, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'level', 'Seconde'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) stem_history --------------------------------------------
create table if not exists public.stem_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  video_id     text not null,
  subject      text,
  content_type text check (content_type in ('shorts','long')),
  title        text,
  thumbnail    text,
  watched_at   timestamptz not null default now()
);
create index if not exists stem_history_user_watched_idx on public.stem_history(user_id, watched_at desc);
grant select, insert, delete on public.stem_history to authenticated;
grant all on public.stem_history to service_role;
alter table public.stem_history enable row level security;
create policy "stem_history_own" on public.stem_history
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) favorites -----------------------------------------------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  video_id   text not null,
  subject    text,
  title      text,
  thumbnail  text,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);
create index if not exists favorites_user_idx on public.favorites(user_id, created_at desc);
grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
create policy "favorites_own" on public.favorites
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) xp_log --------------------------------------------------
create table if not exists public.xp_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  action     text not null,
  xp_gained  integer not null,
  created_at timestamptz not null default now()
);
create index if not exists xp_log_user_idx on public.xp_log(user_id, created_at desc);
grant select, insert on public.xp_log to authenticated;
grant all on public.xp_log to service_role;
alter table public.xp_log enable row level security;
create policy "xp_log_select_own" on public.xp_log
  for select to authenticated using (auth.uid() = user_id);
create policy "xp_log_insert_own" on public.xp_log
  for insert to authenticated with check (auth.uid() = user_id);

create or replace function public.increment_profile_xp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set xp = xp + new.xp_gained where user_id = new.user_id;
  return new;
end; $$;

drop trigger if exists on_xp_log_insert on public.xp_log;
create trigger on_xp_log_insert
  after insert on public.xp_log
  for each row execute function public.increment_profile_xp();

-- 5) chat_history --------------------------------------------
create table if not exists public.chat_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  message    text not null,
  response   text,
  created_at timestamptz not null default now()
);
create index if not exists chat_history_user_idx on public.chat_history(user_id, created_at desc);
grant select, insert, delete on public.chat_history to authenticated;
grant all on public.chat_history to service_role;
alter table public.chat_history enable row level security;
create policy "chat_history_own" on public.chat_history
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
