set check_function_bodies = off;
set search_path = public, extensions;
alter table if exists public.pixel_configs
  add column if not exists meta_access_token text,
  add column if not exists meta_test_event_code text;
comment on column public.pixel_configs.meta_access_token is 'Access token used to dispatch events to Meta Conversions API.';
comment on column public.pixel_configs.meta_test_event_code is 'Optional test event code for Meta Conversions API.';
