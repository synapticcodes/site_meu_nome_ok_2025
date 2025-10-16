set check_function_bodies = off;
set search_path = public, extensions;
alter table if exists public.meta_dispatch_log
  add column if not exists response_headers jsonb;
