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
  -- Meta dispatch
  v_meta_access_token text;
  v_meta_test_event_code text;
  v_meta_event text;
  v_meta_user_data jsonb;
  v_meta_custom_data jsonb;
  v_meta_payload jsonb;
  v_meta_request bigint;
  v_meta_status integer;
  v_meta_headers jsonb;
  v_meta_body text;
  v_meta_body_json jsonb;
  v_meta_error text;
  v_meta_success boolean := false;
  v_meta_url text;
  v_meta_event_time bigint;
  v_email_hash text;
  v_phone_digits text;
  v_phone_hash text;
  v_first_name_hash text;
  v_last_name_hash text;
  v_gender_hash text;
  v_city_hash text;
  v_state_hash text;
  v_country_hash text;
  v_zip_hash text;
  v_dob text;
  v_dob_hash text;
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
    select pixel_id, meta_access_token, meta_test_event_code
      into v_pixel_id, v_meta_access_token, v_meta_test_event_code
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

  v_meta_event := case new.deal_status
    when 'contrato_enviado' then 'ContratoEnviado'
    when 'contrato_assinado' then 'ContratoAssinado'
    else null
  end;

  if v_meta_event is not null and v_pixel_id is not null then
    if v_meta_access_token is null then
      insert into public.meta_dispatch_log (
        deal_id,
        pixel_config_id,
        pixel_id,
        event_name,
        success,
        error_message,
        request_payload
      )
      values (
        new.id,
        new.pixel_config_id,
        v_pixel_id,
        v_meta_event,
        false,
        'Meta access token not configured',
        jsonb_build_object('status', new.deal_status, 'deal_id', new.id)
      );
    else
      v_email_hash := public.meta_hash(public.meta_normalize(new.deal_email));
      v_phone_digits := public.meta_normalize_phone(new.deal_phone);
      if v_phone_digits is not null and left(v_phone_digits, 2) <> '55' then
        v_phone_digits := '55' || v_phone_digits;
      end if;
      v_phone_hash := public.meta_hash(v_phone_digits);
      v_first_name_hash := public.meta_hash(public.meta_normalize(new.deal_first_name));
      v_last_name_hash := public.meta_hash(public.meta_normalize(new.deal_last_name));
      v_gender_hash := null;
      v_city_hash := public.meta_hash(public.meta_normalize(new.deal_cidade));
      v_state_hash := public.meta_hash(public.meta_normalize(new.deal_estado));
      v_country_hash := public.meta_hash('br');
      v_zip_hash := public.meta_hash(public.meta_normalize(new.deal_cep));
      v_dob := case when new.data_nascimento is not null then to_char(new.data_nascimento, 'YYYYMMDD') else null end;
      v_dob_hash := public.meta_hash(v_dob);

      v_meta_user_data := jsonb_strip_nulls(jsonb_build_object(
        'em', v_email_hash,
        'ph', v_phone_hash,
        'fn', v_first_name_hash,
        'ln', v_last_name_hash,
        'ct', v_city_hash,
        'st', v_state_hash,
        'country', v_country_hash,
        'zip', v_zip_hash,
        'db', v_dob_hash
      ));

      v_meta_custom_data := jsonb_strip_nulls(jsonb_build_object(
        'value', new.deal_valor_contrato,
        'currency', coalesce(v_default_currency, 'BRL'),
        'order_id', new.id::text,
        'content_name', new.deal_servico,
        'status', new.deal_status,
        'installments', new.deal_parcelas,
        'installments_schedule', new.parcelas_datas
      ));

      v_meta_event_time := floor(extract(epoch from coalesce(new.updated_at, now())));

      v_meta_payload := jsonb_build_object(
        'data', jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
          'event_name', v_meta_event,
          'event_time', v_meta_event_time,
          'action_source', 'website',
          'user_data', v_meta_user_data,
          'custom_data', case when v_meta_custom_data = '{}'::jsonb then null else v_meta_custom_data end
        )))
      );

      if v_meta_test_event_code is not null then
        v_meta_payload := jsonb_set(
          v_meta_payload,
          '{data,0,test_event_code}',
          to_jsonb(v_meta_test_event_code),
          true
        );
      end if;

      v_meta_url := format('https://graph.facebook.com/v18.0/%s/events?access_token=%s', v_pixel_id, v_meta_access_token);

      begin
        select net.http_post(
          url := v_meta_url,
          body := v_meta_payload,
          params := '{}'::jsonb,
          headers := jsonb_build_object('Content-Type', 'application/json'),
          timeout_milliseconds := v_timeout
        )
        into v_meta_request;

        begin
          select status, headers, body
            into v_meta_status, v_meta_headers, v_meta_body
          from net.http_collect_response(v_meta_request);
        exception when others then
          v_meta_status := null;
          v_meta_headers := null;
          v_meta_body := null;
          v_meta_error := sqlerrm;
        end;

        if v_meta_body is not null then
          begin
            v_meta_body_json := v_meta_body::jsonb;
          exception when others then
            v_meta_body_json := jsonb_build_object('raw', v_meta_body);
          end;
        else
          v_meta_body_json := null;
        end if;

        v_meta_success := coalesce(v_meta_status between 200 and 299, false);

        if not v_meta_success then
          if v_meta_error is null and v_meta_body is not null then
            v_meta_error := v_meta_body;
          end if;
        end if;
      exception when others then
        v_meta_error := sqlerrm;
        v_meta_status := null;
        v_meta_headers := null;
        v_meta_body_json := null;
        v_meta_success := false;
      end;

      insert into public.meta_dispatch_log (
        deal_id,
        pixel_config_id,
        pixel_id,
        event_name,
        status_code,
        success,
        response_body,
        error_message,
        request_payload
      )
      values (
        new.id,
        new.pixel_config_id,
        v_pixel_id,
        v_meta_event,
        v_meta_status,
        v_meta_success,
        v_meta_body_json,
        v_meta_error,
        v_meta_payload
      );
    end if;
  end if;

  return new;
end;
$$;
