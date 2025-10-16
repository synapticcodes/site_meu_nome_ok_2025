set check_function_bodies = off;
set search_path = public, extensions;
create extension if not exists unaccent with schema extensions;
create or replace function public.meta_normalize(value text)
returns text
language sql
immutable
as $$
  select case
    when value is null then null
    else nullif(regexp_replace(lower(unaccent(value)), '[^0-9a-z]', '', 'g'), '')
  end;
$$;
create or replace function public.meta_hash(value text)
returns text
language sql
immutable
as $$
  select case
    when value is null or value = '' then null
    else encode(digest(value, 'sha256'), 'hex')
  end;
$$;
create or replace function public.meta_normalize_phone(value text)
returns text
language sql
immutable
as $$
  select case
    when value is null then null
    else nullif(regexp_replace(value, '\\D', '', 'g'), '')
  end;
$$;
create table if not exists public.meta_dispatch_log (
  id bigserial primary key,
  deal_id uuid references public.deals(id) on delete set null,
  pixel_config_id uuid references public.pixel_configs(id) on delete set null,
  pixel_id text,
  event_name text not null,
  status_code integer,
  success boolean not null default false,
  response_body jsonb,
  error_message text,
  request_payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_meta_dispatch_log_created_at on public.meta_dispatch_log(created_at desc);
create index if not exists idx_meta_dispatch_log_success on public.meta_dispatch_log(success);
