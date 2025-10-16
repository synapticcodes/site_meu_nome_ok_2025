BEGIN;
CREATE TABLE IF NOT EXISTS public.lead_status_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  value NUMERIC,
  currency TEXT,
  service TEXT,
  order_id TEXT,
  payment_type TEXT,
  installments INTEGER,
  installments_schedule JSONB,
  segmentation TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  street TEXT,
  number TEXT,
  neighborhood TEXT,
  date_of_birth DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_status_details_lead_status ON public.lead_status_details(lead_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_status_details_created_at ON public.lead_status_details(created_at DESC);
COMMIT;
