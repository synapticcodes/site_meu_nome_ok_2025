set check_function_bodies = off;
set search_path = public, extensions;
create or replace function public.meta_hash(value text)
returns text
language sql
immutable
as $$
  select case
    when value is null or value = '' then null
    else encode(digest(convert_to(value, 'UTF8'), 'sha256'), 'hex')
  end;
$$;
