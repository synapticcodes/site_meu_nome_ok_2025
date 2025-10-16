CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  valor_padrao numeric(12,2) NOT NULL DEFAULT 0,
  max_parcelas integer NOT NULL DEFAULT 1,
  formas_pagamento text[] NOT NULL DEFAULT ARRAY[]::text[],
  contrato_template_id uuid REFERENCES public.contratos(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_timestamp_services
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS services_nome_idx ON public.services (nome);
;
