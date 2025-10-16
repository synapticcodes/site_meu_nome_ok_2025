-- Migration: Initialize core tables for Meta Conversion API Server
-- Covers Task 2.1 requirements (core tables, constraints, indexes, relationships)

BEGIN;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  ip_address INET,
  country_code TEXT,
  country_name TEXT,
  region TEXT,
  city TEXT,
  browser TEXT,
  device_brand TEXT,
  device_model TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS utm_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES visitors(session_id) ON DELETE CASCADE,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_term TEXT,
  utm_content TEXT,
  utm_placement TEXT,
  utm_site_source_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitors(session_id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_time TIMESTAMP WITH TIME ZONE NOT NULL,
  event_id TEXT UNIQUE NOT NULL,
  user_data JSONB,
  custom_data JSONB,
  meta_response JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT events_status_check CHECK (status IN ('pending', 'sent', 'failed'))
);
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitors(session_id) ON DELETE SET NULL,
  email_hash TEXT,
  phone_hash TEXT,
  first_name_hash TEXT,
  last_name_hash TEXT,
  gender TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT leads_status_check CHECK (
    status IN ('novo', 'qualificado', 'contrato_enviado', 'contrato_assinado', 'boleto_pago')
  ),
  CONSTRAINT leads_gender_check CHECK (
    gender IS NULL OR gender IN ('f', 'm', 'o')
  )
);
CREATE TABLE IF NOT EXISTS lead_cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES visitors(session_id) ON DELETE CASCADE,
  lead_email TEXT,
  lead_phone TEXT,
  lead_first_name TEXT,
  lead_last_name TEXT,
  lead_genero TEXT,
  lead_city TEXT,
  lead_state TEXT,
  lead_country TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT lead_cookies_session_unique UNIQUE (session_id)
);
CREATE TABLE IF NOT EXISTS pixel_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pixel_id TEXT UNIQUE NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  domain TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_utm_data_session_id ON utm_data(session_id);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email_hash ON leads(email_hash);
CREATE INDEX IF NOT EXISTS idx_leads_phone_hash ON leads(phone_hash);
CREATE INDEX IF NOT EXISTS idx_lead_cookies_expires_at ON lead_cookies(expires_at);
CREATE INDEX IF NOT EXISTS idx_pixel_configs_domain ON pixel_configs(domain);
COMMIT;
