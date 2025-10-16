-- Migration: ensure contact_fingerprint is always generated on ingest

BEGIN;
-- Trigger function for leads_captura
CREATE OR REPLACE FUNCTION public.set_contact_fingerprint_leads_captura()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  fingerprint text;
BEGIN
  IF TG_OP = 'INSERT' OR
     COALESCE(NEW.lead_email, '') IS DISTINCT FROM COALESCE(OLD.lead_email, '') OR
     COALESCE(NEW.lead_phone, '') IS DISTINCT FROM COALESCE(OLD.lead_phone, '') THEN
    fingerprint := public.compute_contact_fingerprint(NEW.lead_email, NEW.lead_phone);
    NEW.contact_fingerprint := fingerprint;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_set_contact_fingerprint_leads_captura ON leads_captura;
CREATE TRIGGER trg_set_contact_fingerprint_leads_captura
BEFORE INSERT OR UPDATE OF lead_email, lead_phone ON leads_captura
FOR EACH ROW
EXECUTE FUNCTION public.set_contact_fingerprint_leads_captura();
-- Trigger function for lead_cookies
CREATE OR REPLACE FUNCTION public.set_contact_fingerprint_lead_cookies()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  fingerprint text;
BEGIN
  IF TG_OP = 'INSERT' OR
     COALESCE(NEW.lead_email, '') IS DISTINCT FROM COALESCE(OLD.lead_email, '') OR
     COALESCE(NEW.lead_phone, '') IS DISTINCT FROM COALESCE(OLD.lead_phone, '') THEN
    fingerprint := public.compute_contact_fingerprint(NEW.lead_email, NEW.lead_phone);
    NEW.contact_fingerprint := fingerprint;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_set_contact_fingerprint_lead_cookies ON lead_cookies;
CREATE TRIGGER trg_set_contact_fingerprint_lead_cookies
BEFORE INSERT OR UPDATE OF lead_email, lead_phone ON lead_cookies
FOR EACH ROW
EXECUTE FUNCTION public.set_contact_fingerprint_lead_cookies();
-- Backfill any remaining null fingerprints just in case
UPDATE lead_cookies
SET contact_fingerprint = public.compute_contact_fingerprint(lead_email, lead_phone)
WHERE (lead_email IS NOT NULL OR lead_phone IS NOT NULL)
  AND contact_fingerprint IS NULL;
UPDATE leads_captura
SET contact_fingerprint = public.compute_contact_fingerprint(lead_email, lead_phone)
WHERE (lead_email IS NOT NULL OR lead_phone IS NOT NULL)
  AND contact_fingerprint IS NULL;
COMMIT;
