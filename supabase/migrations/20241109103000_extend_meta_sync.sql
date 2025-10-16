set check_function_bodies = off;
set search_path = public;
create table if not exists lead_status_sync_log (
  id bigserial primary key,
  lead_id uuid not null,
  pixel_id text not null,
  status text not null,
  meta_event_name text not null,
  meta_request_id text,
  meta_request_status text,
  meta_response_body jsonb,
  success boolean not null default false,
  error_message text,
  retries integer not null default 0,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_lead_status_sync_log_lead on lead_status_sync_log (lead_id);
create index if not exists idx_lead_status_sync_log_status on lead_status_sync_log (status);
create index if not exists idx_lead_status_sync_log_success on lead_status_sync_log (success);
create or replace function set_lead_status_sync_log_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists trg_lead_status_sync_log_updated_at on lead_status_sync_log;
create trigger trg_lead_status_sync_log_updated_at
  before update on lead_status_sync_log
  for each row
  execute function set_lead_status_sync_log_updated_at();
create or replace function map_status_to_meta_event(p_status text)
returns text
language sql
immutable
as $$
  select case lower(p_status)
    when 'chamouwhtas' then 'ChamouWhatsapp'
    when 'contrato_enviado' then 'ContratoEnviado'
    when 'contrato_assinado' then 'ContratoAssinado'
    when 'boleto_pago' then 'BoletoPago'
    else null
  end;
$$;
create or replace function enqueue_meta_sync(
  p_lead_id uuid,
  p_pixel_id text,
  p_status text,
  p_payload jsonb,
  p_retry integer default 0
)
returns void
language plpgsql
as $$
declare
  v_event text;
  v_request_id bigint;
  v_response jsonb;
  v_status integer;
  v_body text;
  v_error text;
  v_success boolean := false;
  v_meta_url text := current_setting('app.meta_endpoint', true);
  v_meta_token text := current_setting('app.meta_token', true);
  v_timeout integer := 2000;
begin
  v_event := map_status_to_meta_event(p_status);
  if v_event is null then
    raise notice 'Status % is not mapped to Meta event', p_status;
    return;
  end if;

  insert into lead_status_sync_log (
    lead_id,
    pixel_id,
    status,
    meta_event_name,
    payload,
    retries
  )
  values (
    p_lead_id,
    p_pixel_id,
    p_status,
    v_event,
    p_payload,
    p_retry
  )
  returning id into v_request_id;

  if v_meta_url is null or v_meta_token is null then
    update lead_status_sync_log
    set error_message = 'Meta endpoint or token not configured'
    where id = v_request_id;
    return;
  end if;

  begin
    select net.http_post(
      url := format('%s/%s', v_meta_url, v_event),
      body := p_payload,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', v_meta_token
      ),
      timeout_milliseconds := v_timeout
    )
    into v_response;

    v_status := (v_response ->> 'status')::int;
    v_body := v_response ->> 'body';

    v_success := v_status between 200 and 299;
  exception when others then
    v_error := sqlerrm;
  end;

  update lead_status_sync_log
  set
    meta_request_status = case when v_status is not null then v_status::text else null end,
    meta_response_body = case when v_body is not null then to_jsonb(v_body) else v_response end,
    success = v_success,
    error_message = v_error
  where id = v_request_id;
end;
$$;
comment on function enqueue_meta_sync is 'Enqueues and dispatches status events to Meta API, logging outcome.';
