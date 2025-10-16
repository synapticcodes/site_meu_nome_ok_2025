-- Migration: Add pixel scoping columns and RLS policies (Task 2.2)

BEGIN;
-- Add pixel_config_id foreign keys for tenant isolation
ALTER TABLE visitors
  ADD COLUMN IF NOT EXISTS pixel_config_id UUID REFERENCES pixel_configs(id) ON DELETE CASCADE;
ALTER TABLE visitors
  ALTER COLUMN pixel_config_id SET NOT NULL;
ALTER TABLE utm_data
  ADD COLUMN IF NOT EXISTS pixel_config_id UUID REFERENCES pixel_configs(id) ON DELETE CASCADE;
ALTER TABLE utm_data
  ALTER COLUMN pixel_config_id SET NOT NULL;
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS pixel_config_id UUID REFERENCES pixel_configs(id) ON DELETE CASCADE;
ALTER TABLE events
  ALTER COLUMN pixel_config_id SET NOT NULL;
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS pixel_config_id UUID REFERENCES pixel_configs(id) ON DELETE CASCADE;
ALTER TABLE leads
  ALTER COLUMN pixel_config_id SET NOT NULL;
ALTER TABLE lead_cookies
  ADD COLUMN IF NOT EXISTS pixel_config_id UUID REFERENCES pixel_configs(id) ON DELETE CASCADE;
ALTER TABLE lead_cookies
  ALTER COLUMN pixel_config_id SET NOT NULL;
-- Useful indexes for pixel scoped queries
CREATE INDEX IF NOT EXISTS idx_visitors_pixel_config_id ON visitors(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_utm_data_pixel_config_id ON utm_data(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_events_pixel_config_id ON events(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_leads_pixel_config_id ON leads(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_lead_cookies_pixel_config_id ON lead_cookies(pixel_config_id);
-- Helper functions to interpret auth context
CREATE OR REPLACE FUNCTION public.current_pixel_config_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(auth.jwt() ->> 'pixel_config_id', '')::uuid;
$$;
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.role() = 'service_role';
$$;
-- Enable RLS and define policies for each table
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS visitors_service_role_full_access ON visitors;
CREATE POLICY visitors_service_role_full_access
  ON visitors
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS visitors_pixel_scoped_access ON visitors;
CREATE POLICY visitors_pixel_scoped_access
  ON visitors
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
ALTER TABLE utm_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_data FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS utm_data_service_role_full_access ON utm_data;
CREATE POLICY utm_data_service_role_full_access
  ON utm_data
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS utm_data_pixel_scoped_access ON utm_data;
CREATE POLICY utm_data_pixel_scoped_access
  ON utm_data
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
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS events_service_role_full_access ON events;
CREATE POLICY events_service_role_full_access
  ON events
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS events_pixel_scoped_access ON events;
CREATE POLICY events_pixel_scoped_access
  ON events
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
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS leads_service_role_full_access ON leads;
CREATE POLICY leads_service_role_full_access
  ON leads
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS leads_pixel_scoped_access ON leads;
CREATE POLICY leads_pixel_scoped_access
  ON leads
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
ALTER TABLE lead_cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_cookies FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lead_cookies_service_role_full_access ON lead_cookies;
CREATE POLICY lead_cookies_service_role_full_access
  ON lead_cookies
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS lead_cookies_pixel_scoped_access ON lead_cookies;
CREATE POLICY lead_cookies_pixel_scoped_access
  ON lead_cookies
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
ALTER TABLE pixel_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_configs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pixel_configs_service_role_full_access ON pixel_configs;
CREATE POLICY pixel_configs_service_role_full_access
  ON pixel_configs
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());
DROP POLICY IF EXISTS pixel_configs_self_access ON pixel_configs;
CREATE POLICY pixel_configs_self_access
  ON pixel_configs
  FOR SELECT
  USING (
    NOT public.is_service_role()
    AND public.current_pixel_config_id() IS NOT NULL
    AND id = public.current_pixel_config_id()
  );
COMMIT;
