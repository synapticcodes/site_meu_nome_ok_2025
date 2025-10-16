-- Migration: Add contact fingerprint support and lead status sync log for CRM Tracker
-- Adds helper functions, columns, indexes, backfill logic, and logging table for inbound status updates

BEGIN;
-- Helper functions for contact normalization and fingerprint generation
CREATE OR REPLACE FUNCTION public.normalize_email(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN value IS NULL THEN NULL
    WHEN trim(value) = '' THEN NULL
    ELSE lower(trim(value))
  END;
$$;
CREATE OR REPLACE FUNCTION public.normalize_phone(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN value IS NULL THEN NULL
    ELSE NULLIF(left(regexp_replace(value, '[^0-9]', '', 'g'), 11), '')
  END;
$$;
CREATE OR REPLACE FUNCTION public.compute_contact_fingerprint(email text, phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  WITH normalized AS (
    SELECT public.normalize_email(email) AS email_norm,
           public.normalize_phone(phone) AS phone_norm
  )
  SELECT CASE
    WHEN (SELECT email_norm FROM normalized) IS NULL AND (SELECT phone_norm FROM normalized) IS NULL THEN NULL
    ELSE encode(digest(coalesce((SELECT email_norm FROM normalized), '') || '|' || coalesce((SELECT phone_norm FROM normalized), ''), 'sha256'), 'hex')
  END;
$$;
-- Leads tables contact fingerprint column
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS contact_fingerprint text;
ALTER TABLE leads_captura
  ADD COLUMN IF NOT EXISTS contact_fingerprint text;
ALTER TABLE lead_cookies
  ADD COLUMN IF NOT EXISTS contact_fingerprint text;
-- Indexes to accelerate lookups
CREATE INDEX IF NOT EXISTS idx_leads_contact_fingerprint ON leads(contact_fingerprint);
CREATE INDEX IF NOT EXISTS idx_leads_captura_contact_fingerprint ON leads_captura(contact_fingerprint);
CREATE INDEX IF NOT EXISTS idx_lead_cookies_contact_fingerprint ON lead_cookies(contact_fingerprint);
-- Backfill fingerprints from available raw data sources
UPDATE lead_cookies
SET contact_fingerprint = public.compute_contact_fingerprint(lead_email, lead_phone)
WHERE contact_fingerprint IS NULL
  AND (lead_email IS NOT NULL OR lead_phone IS NOT NULL);
UPDATE leads_captura lc
SET contact_fingerprint = public.compute_contact_fingerprint(lc.lead_email, lc.lead_phone)
WHERE contact_fingerprint IS NULL
  AND (lc.lead_email IS NOT NULL OR lc.lead_phone IS NOT NULL);
UPDATE leads AS l
SET contact_fingerprint = coalesce(
    l.contact_fingerprint,
    public.compute_contact_fingerprint(lc.lead_email, lc.lead_phone),
    public.compute_contact_fingerprint(c.lead_email, c.lead_phone)
  )
FROM leads_captura AS lc
LEFT JOIN lead_cookies AS c ON c.session_id = lc.session_id AND c.pixel_config_id = lc.pixel_config_id
WHERE l.contact_fingerprint IS NULL
  AND lc.session_id = l.session_id
  AND lc.pixel_config_id = l.pixel_config_id;
-- Create table to log inbound status sync attempts
CREATE TABLE IF NOT EXISTS lead_status_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pixel_config_id UUID NOT NULL REFERENCES pixel_configs(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  contact_fingerprint TEXT,
  incoming_status TEXT NOT NULL,
  previous_status TEXT,
  payload JSONB NOT NULL,
  source TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_status_sync_log_pixel ON lead_status_sync_log(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_sync_log_lead ON lead_status_sync_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_sync_log_fingerprint ON lead_status_sync_log(contact_fingerprint);
CREATE INDEX IF NOT EXISTS idx_lead_status_sync_log_processed_at ON lead_status_sync_log(processed_at DESC);
-- Apply RLS to the new log table
ALTER TABLE lead_status_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_sync_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lead_status_sync_log_service_role_full_access ON lead_status_sync_log;
CREATE POLICY lead_status_sync_log_service_role_full_access
  ON lead_status_sync_log
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS lead_status_sync_log_pixel_scoped_access ON lead_status_sync_log;
CREATE POLICY lead_status_sync_log_pixel_scoped_access
  ON lead_status_sync_log
  FOR ALL
  USING (
    NOT public.is_service_role()
    AND public.current_pixel_config_id() IS NOT NULL
    AND pixel_config_id = public.current_pixel_config_id()
  )
  WITH CHECK (
    NOT public.is_service_role()
    AND public.current_pixel_config_id() IS NOT NULL
    AND pixel_config_id = public.current_pixel_config_id()
  );
COMMIT;
