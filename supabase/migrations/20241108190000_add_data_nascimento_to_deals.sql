set check_function_bodies = off;
set search_path = public, extensions;
alter table if exists public.deals
  add column if not exists data_nascimento date;
comment on column public.deals.data_nascimento is 'Data de nascimento associada ao negócio.';
-- ensure convert_lead_to_deal inserts the new column
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
    pixel_config_id,
    data_nascimento
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
    v_lead.pixel_config_id,
    null
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
