-- Migration: Lead status change triggers inserting events (Task 2.3)

BEGIN;
-- Helper function mapping lead status to Meta event names
CREATE OR REPLACE FUNCTION public.map_lead_status_to_event(status text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE status
    WHEN 'qualificado' THEN 'LeadQualificado'
    WHEN 'contrato_enviado' THEN 'ContratoEnviado'
    WHEN 'contrato_assinado' THEN 'ContratoAssinado'
    WHEN 'boleto_pago' THEN 'BoletoPago'
    ELSE NULL
  END;
$$;
-- Trigger function that generates conversion events when lead status changes
CREATE OR REPLACE FUNCTION public.handle_lead_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  status_event_name text;
  generated_event_id text;
BEGIN
  -- Ignore updates that do not modify status
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  status_event_name := public.map_lead_status_to_event(NEW.status);

  IF status_event_name IS NULL THEN
    RETURN NEW;
  END IF;

  generated_event_id := concat(
    'lead-status-',
    NEW.id::text,
    '-',
    NEW.status,
    '-',
    floor(extract(epoch FROM now()) * 1000)::bigint
  );

  INSERT INTO events (
    id,
    session_id,
    pixel_config_id,
    event_name,
    event_time,
    event_id,
    user_data,
    custom_data,
    status,
    retry_count,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.session_id,
    NEW.pixel_config_id,
    status_event_name,
    NOW(),
    generated_event_id,
    NULL,
    jsonb_build_object(
      'source', 'lead_status_trigger',
      'lead_id', NEW.id::text,
      'previous_status', OLD.status,
      'current_status', NEW.status
    ),
    'pending',
    0,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_lead_status_change ON leads;
CREATE TRIGGER trg_lead_status_change
AFTER UPDATE OF status ON leads
FOR EACH ROW
EXECUTE FUNCTION public.handle_lead_status_change();
COMMIT;
