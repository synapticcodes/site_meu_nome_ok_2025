-- Allow multiple contract records per deal and enforce unique Autentique document IDs
ALTER TABLE public.contratos
  DROP CONSTRAINT IF EXISTS contratos_deal_id_key;
DROP INDEX IF EXISTS contratos_deal_id_unique_idx;
CREATE INDEX IF NOT EXISTS contratos_deal_id_idx
  ON public.contratos (deal_id);
CREATE UNIQUE INDEX IF NOT EXISTS contratos_document_id_autentique_key
  ON public.contratos (document_id_autentique)
  WHERE document_id_autentique IS NOT NULL;
