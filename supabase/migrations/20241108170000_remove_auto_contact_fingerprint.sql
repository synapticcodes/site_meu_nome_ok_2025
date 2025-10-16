set check_function_bodies = off;
set search_path = public, extensions;
drop trigger if exists trg_leads_contact_fingerprint on public.leads_captura;
drop trigger if exists trg_deals_contact_fingerprint on public.deals;
drop function if exists public.set_contact_fingerprint_on_leads();
drop function if exists public.set_contact_fingerprint_on_deals();
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
    contact_fingerprint
  )
  values (
    v_lead.lead_first_name,
    v_lead.lead_last_name,
    nullif(trim(concat_ws(' ', v_lead.lead_first_name, v_lead.lead_last_name)), ''),
    v_lead.lead_phone,
    v_lead.lead_email,
    'negocio_novo',
    v_lead.vendedor_responsavel,
    v_lead.contact_fingerprint
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
update public.leads_captura set contact_fingerprint = null where contact_fingerprint is not null;
update public.deals set contact_fingerprint = null where contact_fingerprint is not null;
