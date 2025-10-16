set check_function_bodies = off;
set search_path = public, extensions;
create table if not exists public.pixel_configs (
  id uuid primary key default gen_random_uuid(),
  pixel_id text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists idx_pixel_configs_pixel_id on public.pixel_configs (pixel_id);
drop trigger if exists trg_pixel_configs_updated_at on public.pixel_configs;
create trigger trg_pixel_configs_updated_at
  before update on public.pixel_configs
  for each row
  execute function public.set_updated_at();
alter table if exists public.leads_captura
  add column if not exists pixel_config_id uuid references public.pixel_configs(id);
alter table if exists public.deals
  add column if not exists pixel_config_id uuid references public.pixel_configs(id);
alter table if exists public.crm_tracker_sync_log
  add column if not exists pixel_id text;
comment on column public.leads_captura.pixel_config_id is 'Reference to pixel configuration used for marketing events';
comment on column public.deals.pixel_config_id is 'Reference to pixel configuration used for marketing events';
comment on column public.crm_tracker_sync_log.pixel_id is 'Pixel identifier sent to CRM Tracker';
-- ensure existing deals inherit pixel config from lead when available
update public.deals d
set pixel_config_id = lc.pixel_config_id
from public.leads_captura lc
where d.pixel_config_id is null and lc.contact_fingerprint is not null and lc.contact_fingerprint = d.contact_fingerprint;
-- recreate convert_lead_to_deal to propagate pixel_config_id
 drop function if exists public.convert_lead_to_deal(uuid);
create or replace function public.convert_lead_to_deal(p_lead_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead record;
  v_deal_id uuid;
begin
  select * into v_lead from public.leads_captura where id = p_lead_id;

  if not found then
    raise exception 'Lead % not found', p_lead_id;
  end if;

  insert into public.deals (
    deal_first_name,
    deal_last_name,
    deal_full_name,
    deal_phone,
    deal_email,
    deal_status,
    vendedor_responsavel,
    contact_fingerprint,
    pixel_config_id
  )
  values (
    v_lead.lead_first_name,
    v_lead.lead_last_name,
    nullif(trim(concat_ws(' ', v_lead.lead_first_name, v_lead.lead_last_name)), ''),
    v_lead.lead_phone,
    v_lead.lead_email,
    'negocio_novo',
    v_lead.vendedor_responsavel,
    v_lead.contact_fingerprint,
    v_lead.pixel_config_id
  )
  returning id into v_deal_id;

  update public.leads_captura
  set
    lead_status = 'convertido',
    updated_at = now()
  where id = p_lead_id;

  return v_deal_id;
end;
$$;
grant execute on function public.convert_lead_to_deal(uuid) to authenticated;
grant execute on function public.convert_lead_to_deal(uuid) to service_role;
-- recreate notify_crm_tracker_on_deal_status to include pixel info
create or replace function public.notify_crm_tracker_on_deal_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.crm_tracker_settings%rowtype;
  v_response jsonb;
  v_status integer;
  v_success boolean := false;
  v_error text;
  v_payload jsonb;
  v_pixel_id text;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if coalesce(old.deal_status, '') = coalesce(new.deal_status, '') then
    return new;
  end if;

  if new.deal_status not in ('contrato_enviado', 'contrato_assinado') then
    return new;
  end if;

  if new.pixel_config_id is not null then
    select pixel_id
      into v_pixel_id
    from public.pixel_configs
    where id = new.pixel_config_id and coalesce(is_active, true)
    limit 1;
  end if;

  if new.contact_fingerprint is null then
    v_error := 'contact fingerprint not available';
  else
    select *
      into v_settings
    from public.crm_tracker_settings
    where is_active
    order by updated_at desc
    limit 1;

    if v_settings.lead_status_url is null or v_settings.secret is null then
      v_error := 'crm_tracker_settings misconfigured';
    else
      v_payload := jsonb_build_object(
        'contact_fingerprint', new.contact_fingerprint,
        'deal_id', new.id,
        'status', new.deal_status,
        'pixel_config_id', new.pixel_config_id,
        'pixel_id', v_pixel_id,
        'updated_at', coalesce(new.updated_at, now()),
        'source', 'crm-heart',
        'metadata', jsonb_build_object(
          'deal_full_name', new.deal_full_name,
          'deal_email', new.deal_email,
          'deal_phone', new.deal_phone,
          'vendedor_responsavel', new.vendedor_responsavel
        )
      );

      begin
        v_response := net.http_post(
          url => v_settings.lead_status_url,
          headers => jsonb_build_object(
            'Content-Type', 'application/json',
            'X-CRM-TRACKER-SECRET', v_settings.secret
          ),
          body => v_payload::text
        );
        v_status := (v_response ->> 'status')::int;
        v_success := v_status between 200 and 299;
        if not v_success then
          v_error := coalesce(v_response ->> 'body', 'unexpected response body');
        end if;
      exception when others then
        v_error := sqlerrm;
      end;
    end if;
  end if;

  insert into public.crm_tracker_sync_log (
    deal_id,
    contact_fingerprint,
    deal_status,
    payload,
    response_status,
    response_headers,
    response_body,
    success,
    error_message,
    next_retry_at,
    pixel_id
  )
  values (
    new.id,
    coalesce(new.contact_fingerprint, old.contact_fingerprint),
    new.deal_status,
    coalesce(v_payload, jsonb_build_object(
      'contact_fingerprint', new.contact_fingerprint,
      'deal_id', new.id,
      'status', new.deal_status,
      'pixel_config_id', new.pixel_config_id,
      'pixel_id', v_pixel_id
    )),
    v_status,
    case when v_response is not null and v_response ? 'headers' then v_response -> 'headers' else null end,
    case
      when v_response is not null and v_response ? 'body' then to_jsonb(v_response ->> 'body')
      else v_response
    end,
    v_success,
    v_error,
    case when v_success then null else now() + interval '15 minutes' end,
    v_pixel_id
  );

  return new;
end;
$$;
-- ensure trigger exists
 drop trigger if exists trg_notify_crm_tracker on public.deals;
create trigger trg_notify_crm_tracker
  after update on public.deals
  for each row
  execute function public.notify_crm_tracker_on_deal_status();
comment on table public.pixel_configs is 'Stores pixel identifiers for marketing integrations.';
