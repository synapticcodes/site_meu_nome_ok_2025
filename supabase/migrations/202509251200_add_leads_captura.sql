CREATE TABLE IF NOT EXISTS leads_captura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  pixel_config_id UUID NOT NULL REFERENCES pixel_configs(id) ON DELETE CASCADE,
  lead_first_name TEXT,
  lead_last_name TEXT,
  lead_phone TEXT,
  lead_email TEXT,
  lead_genero TEXT,
  lead_city TEXT,
  lead_state TEXT,
  status TEXT,
  action TEXT NOT NULL,
  lead_country TEXT,
  browser TEXT,
  ip_address TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_term TEXT,
  utm_content TEXT,
  utm_placement TEXT,
  utm_site_source_name TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_captura_session_unique'
  ) THEN
    ALTER TABLE leads_captura
      ADD CONSTRAINT leads_captura_session_unique UNIQUE (session_id);
  END IF;
END
$$;
CREATE INDEX IF NOT EXISTS idx_leads_captura_pixel_config_id ON leads_captura(pixel_config_id);
CREATE INDEX IF NOT EXISTS idx_leads_captura_action ON leads_captura(action);
CREATE INDEX IF NOT EXISTS idx_leads_captura_created_at ON leads_captura(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_captura_status ON leads_captura(status);
