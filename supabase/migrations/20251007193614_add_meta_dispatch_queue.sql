create table if not exists public.meta_dispatch_queue (
  id bigserial primary key,
  deal_id uuid not null,
  pixel_config_id uuid,
  pixel_id text,
  meta_access_token text,
  event_name text,
  request_payload jsonb,
  status text not null default 'pending',
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_meta_dispatch_queue_status on public.meta_dispatch_queue(status);
create index if not exists idx_meta_dispatch_queue_deal on public.meta_dispatch_queue(deal_id);
