alter table public.meta_dispatch_log
  add column if not exists response_headers jsonb;
