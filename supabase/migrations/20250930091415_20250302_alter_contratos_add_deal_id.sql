ALTER TABLE public.contratos
ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS contratos_deal_id_unique_idx ON public.contratos (deal_id);
;
