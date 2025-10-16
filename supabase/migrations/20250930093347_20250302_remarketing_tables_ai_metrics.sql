CREATE TABLE IF NOT EXISTS public.remarketing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  audience_type text NOT NULL,
  payload jsonb NOT NULL,
  delivery_method text NOT NULL,
  scheduled_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.remarketing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.remarketing_jobs(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_id uuid,
  target_type text,
  delivery_method text,
  status text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_timestamp_remarketing_jobs
BEFORE UPDATE ON public.remarketing_jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS remarketing_logs_job_idx ON public.remarketing_logs (job_id);

ALTER TABLE public.remarketing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remarketing_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY remarketing_jobs_access_policy
  ON public.remarketing_jobs
  FOR ALL
  USING (auth.uid() = created_by OR public.is_admin())
  WITH CHECK (auth.uid() = created_by OR public.is_admin());

CREATE POLICY remarketing_logs_access_policy
  ON public.remarketing_logs
  FOR SELECT
  USING (auth.uid() = created_by OR public.is_admin());

CREATE OR REPLACE FUNCTION public.ai_metrics_summary()
RETURNS TABLE (
  total_actions bigint,
  atendidos bigint,
  contactados bigint,
  transferidos bigint,
  descartados bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*) AS total_actions,
    COUNT(*) FILTER (WHERE acao = 'atendido') AS atendidos,
    COUNT(*) FILTER (WHERE acao = 'contactado') AS contactados,
    COUNT(*) FILTER (WHERE acao = 'transferido') AS transferidos,
    COUNT(*) FILTER (WHERE acao = 'descartado') AS descartados
  FROM public.metricas_ais;
$$;
;
