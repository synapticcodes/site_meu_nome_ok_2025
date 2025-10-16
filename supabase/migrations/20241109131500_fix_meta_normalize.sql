set check_function_bodies = off;
set search_path = public, extensions;
create or replace function public.meta_normalize(value text)
returns text
language sql
immutable
as $$
  select case
    when value is null then null
    else nullif(regexp_replace(lower(extensions.unaccent(value)), '[^0-9a-z]', '', 'g'), '')
  end;
$$;
