CREATE OR REPLACE FUNCTION public.convert_lead_to_deal(p_lead_id uuid)
RETURNS public.deals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lead_row public.leads_captura%ROWTYPE;
  current_role text;
  is_authorized boolean;
  deal_row public.deals;
BEGIN
  SELECT * INTO lead_row
  FROM public.leads_captura
  WHERE id = p_lead_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead % não encontrado', p_lead_id;
  END IF;

  SELECT role INTO current_role FROM public.equipe WHERE id = auth.uid();
  is_authorized := current_role = 'admin' OR lead_row.vendedor_responsavel = auth.uid();

  IF NOT is_authorized THEN
    RAISE EXCEPTION 'Usuário sem permissão para converter este lead';
  END IF;

  -- Upsert deal using same ID
  INSERT INTO public.deals (
    id,
    deal_first_name,
    deal_last_name,
    deal_full_name,
    deal_phone,
    deal_email,
    deal_status,
    vendedor_responsavel,
    created_at,
    updated_at
  )
  VALUES (
    lead_row.id,
    lead_row.lead_first_name,
    lead_row.lead_last_name,
    CONCAT_WS(' ', lead_row.lead_first_name, lead_row.lead_last_name),
    lead_row.lead_phone,
    lead_row.lead_email,
    'negocio_novo',
    lead_row.vendedor_responsavel,
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO UPDATE SET
    deal_first_name = EXCLUDED.deal_first_name,
    deal_last_name = EXCLUDED.deal_last_name,
    deal_full_name = EXCLUDED.deal_full_name,
    deal_phone = EXCLUDED.deal_phone,
    deal_email = EXCLUDED.deal_email,
    updated_at = timezone('utc', now())
  RETURNING * INTO deal_row;

  UPDATE public.leads_captura
  SET lead_status = 'convertido',
      updated_at = timezone('utc', now())
  WHERE id = p_lead_id;

  RETURN deal_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.convert_lead_to_deal(uuid) TO authenticated, service_role;
;
