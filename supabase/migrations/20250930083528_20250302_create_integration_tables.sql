-- AIs table
CREATE TABLE public.ais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade text NOT NULL,
  provider text NOT NULL DEFAULT 'dify',
  config_json jsonb,
  webhook_url text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX ais_entidade_unique_idx ON public.ais (entidade);
CREATE INDEX ais_provider_idx ON public.ais (provider);

CREATE TRIGGER set_timestamp_ais
BEFORE UPDATE ON public.ais
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Instancias table
CREATE TABLE public.instancias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  instance_id text UNIQUE,
  status text NOT NULL DEFAULT 'aguardando',
  qr_code text,
  whatsapp_number text,
  ai_entidade uuid REFERENCES public.ais(id) ON DELETE SET NULL,
  webhook_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX instancias_status_idx ON public.instancias (status);
CREATE INDEX instancias_ai_entidade_idx ON public.instancias (ai_entidade);

CREATE TRIGGER set_timestamp_instancias
BEFORE UPDATE ON public.instancias
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Contratos table
CREATE TABLE public.contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  deal_name text,
  deal_phone text,
  deal_email text,
  vendedor_responsavel uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  contrato_template text,
  contrato_nome text,
  contrato_metodo text,
  contrato_status text NOT NULL DEFAULT 'rascunho',
  contrato_copia text,
  document_id_autentique text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX contratos_vendedor_status_idx ON public.contratos (vendedor_responsavel, contrato_status);
CREATE INDEX contratos_created_at_idx ON public.contratos (created_at DESC);

CREATE TRIGGER set_timestamp_contratos
BEFORE UPDATE ON public.contratos
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- metricas_ais table
CREATE TABLE public.metricas_ais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidade uuid REFERENCES public.ais(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.leads_captura(id) ON DELETE SET NULL,
  acao text,
  atendido_em timestamptz,
  lead_scoring integer,
  motivo_desqualificacao text,
  remarketing_enviado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX metricas_ais_entidade_idx ON public.metricas_ais (entidade);
CREATE INDEX metricas_ais_lead_idx ON public.metricas_ais (lead_id);
CREATE INDEX metricas_ais_created_at_idx ON public.metricas_ais (created_at DESC);

-- consultas table
CREATE TABLE public.consultas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  search_cpf text,
  response_data jsonb,
  search_status text,
  error_message text,
  usuario_que_consultou uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX consultas_user_idx ON public.consultas (user_id);
CREATE INDEX consultas_search_status_idx ON public.consultas (search_status);
CREATE INDEX consultas_created_at_idx ON public.consultas (created_at DESC);

CREATE TRIGGER set_timestamp_consultas
BEFORE UPDATE ON public.consultas
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- logs_master table
CREATE TABLE public.logs_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  user_email text,
  action text NOT NULL,
  details jsonb,
  stage text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX logs_master_user_idx ON public.logs_master (user_id);
CREATE INDEX logs_master_stage_idx ON public.logs_master (stage);
CREATE INDEX logs_master_created_at_idx ON public.logs_master (created_at DESC);
;
