set check_function_bodies = off;
set search_path = public, extensions;
create or replace function public.notify_crm_tracker_on_deal_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.crm_tracker_settings%rowtype;
  v_request_id bigint;
  v_status integer;
  v_headers jsonb;
  v_body text;
  v_success boolean := false;
  v_error text;
  v_payload jsonb;
  v_pixel_id text;
  v_default_currency text := 'BRL';
  v_timeout integer := 1000;
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
        'metadata', jsonb_strip_nulls(jsonb_build_object(
          'deal_full_name', new.deal_full_name,
          'deal_email', new.deal_email,
          'deal_phone', new.deal_phone,
          'vendedor_responsavel', new.vendedor_responsavel,
          'deal_value', new.deal_valor_contrato,
          'deal_currency', coalesce(v_default_currency, 'BRL'),
          'deal_service', new.deal_servico,
          'deal_order_id', new.id,
          'payment_type', new.deal_forma_pagamento,
          'installments', new.deal_parcelas,
          'installments_schedule', new.parcelas_datas,
          'deal_status', new.deal_status,
          'deal_city', new.deal_cidade,
          'deal_state', new.deal_estado,
          'deal_zip', new.deal_cep,
          'deal_street', new.deal_rua,
          'deal_number', new.deal_numero,
          'deal_neighborhood', new.deal_bairro,
          'date_of_birth', new.data_nascimento
        ))
      );

      begin
        select net.http_post(
          url := v_settings.lead_status_url,
          body := v_payload,
          params := '{}'::jsonb,
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'X-CRM-TRACKER-SECRET', v_settings.secret,
            'Authorization', 'Bearer ' || v_settings.secret,
            'apikey', v_settings.secret
          ),
          timeout_milliseconds := v_timeout
        )
        into v_request_id;
        v_success := true;
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
    v_headers,
    case when v_body is null then null else to_jsonb(v_body) end,
    v_success,
    v_error,
    case when v_success then null else now() + interval '15 minutes' end,
    v_pixel_id
  );

  return new;
end;
$$;
