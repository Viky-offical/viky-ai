-- Viky AI video jobs + secure credit consumption
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'google-veo-3.1',
  mode text not null default 'text',
  prompt text not null,
  status text not null default 'processing',
  operation_name text,
  target_seconds integer not null default 8,
  current_seconds integer not null default 0,
  credits_cost integer not null default 20,
  video_path text,
  video_url text,
  captions_url text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.video_jobs enable row level security;

drop policy if exists "Users can read own video jobs" on public.video_jobs;
create policy "Users can read own video jobs"
on public.video_jobs for select
to authenticated
using (auth.uid() = user_id);

-- Secure atomic credit deduction.
create or replace function public.consume_viky_credits(
  p_user_id uuid,
  p_amount integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.profiles
  set credits = credits - p_amount
  where id = p_user_id
    and credits >= p_amount;

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.consume_viky_credits(uuid, integer) from public;
grant execute on function public.consume_viky_credits(uuid, integer) to service_role;

-- Storage policies for the existing private bucket "viky-videos".
drop policy if exists "Viky users upload own media" on storage.objects;
create policy "Viky users upload own media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'viky-videos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Viky users read own media" on storage.objects;
create policy "Viky users read own media"
on storage.objects for select
to authenticated
using (
  bucket_id = 'viky-videos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Viky users delete own media" on storage.objects;
create policy "Viky users delete own media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'viky-videos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
