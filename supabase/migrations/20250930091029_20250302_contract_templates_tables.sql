CREATE TABLE IF NOT EXISTS public.contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  storage_path text,
  template_body text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contract_template_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.contract_templates(id) ON DELETE CASCADE,
  variable_key text NOT NULL,
  source text NOT NULL CHECK (source IN ('lead', 'deal', 'custom')),
  column_name text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_timestamp_contract_templates
BEFORE UPDATE ON public.contract_templates
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS contract_templates_nome_idx ON public.contract_templates (nome);
CREATE INDEX IF NOT EXISTS contract_template_variables_template_idx ON public.contract_template_variables (template_id);
;
