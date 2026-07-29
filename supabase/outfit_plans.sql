-- Outfit planner calendar: run in the Supabase dashboard SQL editor.
--
-- PRE-FLIGHT: the FK columns below assume uuid ids. Confirm first:
--   select pg_typeof(id) from tryon_images limit 1;         -- expect uuid
--   select pg_typeof(id) from avatar_tryon_images limit 1;  -- expect uuid
-- If either returns bigint, change the matching FK column type below.

-- 1) Table
create table public.outfit_plans (
  id                      uuid primary key default gen_random_uuid(),
  profiles_id             uuid not null references public.profiles(id) on delete cascade,
  outfit_date             date not null,
  source_type             text not null check (source_type in ('tryon', 'avatar_tryon', 'upload')),
  tryon_images_id         bigint references public.tryon_images(id) on delete cascade,
  avatar_tryon_images_id  bigint references public.avatar_tryon_images(id) on delete cascade,
  image_url               text,   -- public URL, upload entries only
  storage_path            text,   -- bucket-relative path, upload entries only (for cleanup)
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- one entry per user per day; DEFERRABLE so move_outfit_plan can swap
  -- atomically. Deferrable means ON CONFLICT/upsert cannot target it, so the
  -- app does update-if-occupied / insert-if-empty instead of upserts.
  constraint outfit_plans_one_per_day
    unique (profiles_id, outfit_date) deferrable initially immediate,

  -- exactly the columns matching source_type are populated
  constraint outfit_plans_source_matches check (
    (source_type = 'tryon'
       and tryon_images_id is not null
       and avatar_tryon_images_id is null and image_url is null and storage_path is null)
    or
    (source_type = 'avatar_tryon'
       and avatar_tryon_images_id is not null
       and tryon_images_id is null and image_url is null and storage_path is null)
    or
    (source_type = 'upload'
       and image_url is not null and storage_path is not null
       and tryon_images_id is null and avatar_tryon_images_id is null)
  )
);

-- FK indexes so cascaded deletes from the source tables don't scan
create index outfit_plans_tryon_images_id_idx
  on public.outfit_plans (tryon_images_id) where tryon_images_id is not null;
create index outfit_plans_avatar_tryon_images_id_idx
  on public.outfit_plans (avatar_tryon_images_id) where avatar_tryon_images_id is not null;

-- 2) updated_at maintenance
create or replace function public.outfit_plans_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger outfit_plans_set_updated_at
  before update on public.outfit_plans
  for each row execute function public.outfit_plans_set_updated_at();

-- 3) RLS
alter table public.outfit_plans enable row level security;

create policy "outfit_plans_select_own" on public.outfit_plans
  for select to authenticated using (auth.uid() = profiles_id);
create policy "outfit_plans_insert_own" on public.outfit_plans
  for insert to authenticated with check (auth.uid() = profiles_id);
create policy "outfit_plans_update_own" on public.outfit_plans
  for update to authenticated
  using (auth.uid() = profiles_id) with check (auth.uid() = profiles_id);
create policy "outfit_plans_delete_own" on public.outfit_plans
  for delete to authenticated using (auth.uid() = profiles_id);

-- 4) Atomic move / swap RPC (SECURITY INVOKER: RLS still applies)
create or replace function public.move_outfit_plan(p_from date, p_to date)
returns void
language plpgsql
as $$
declare
  v_uid     uuid := auth.uid();
  v_from_id uuid;
  v_to_id   uuid;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if p_from = p_to then
    return;
  end if;

  set constraints public.outfit_plans_one_per_day deferred;

  select id into v_from_id from public.outfit_plans
    where profiles_id = v_uid and outfit_date = p_from for update;
  if v_from_id is null then
    raise exception 'no outfit planned on %', p_from;
  end if;

  select id into v_to_id from public.outfit_plans
    where profiles_id = v_uid and outfit_date = p_to for update;

  update public.outfit_plans set outfit_date = p_to where id = v_from_id;
  if v_to_id is not null then
    update public.outfit_plans set outfit_date = p_from where id = v_to_id;  -- swap
  end if;
end;
$$;

revoke execute on function public.move_outfit_plan(date, date) from public, anon;
grant  execute on function public.move_outfit_plan(date, date) to authenticated;

-- 5) Storage bucket + policies (public read, matching the existing buckets)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('outfit_plans', 'outfit_plans', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do nothing;

-- objects live at {auth.uid()}/{filename}
create policy "outfit_plans_storage_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'outfit_plans'
              and (storage.foldername(name))[1] = auth.uid()::text);
create policy "outfit_plans_storage_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'outfit_plans'
         and (storage.foldername(name))[1] = auth.uid()::text);
create policy "outfit_plans_storage_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'outfit_plans'
         and (storage.foldername(name))[1] = auth.uid()::text);
