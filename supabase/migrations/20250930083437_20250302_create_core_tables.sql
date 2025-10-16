-- Create updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

-- leads_captura table
CREATE TABLE public.leads_captura (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_first_name text,
  lead_last_name text,
  lead_phone text,
  lead_email text,
  lead_status text NOT NULL DEFAULT 'lead_novo',
  motivo_descarte text,
  vendedor_responsavel uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX leads_captura_vendedor_status_idx ON public.leads_captura (vendedor_responsavel, lead_status);
CREATE INDEX leads_captura_created_at_idx ON public.leads_captura (created_at DESC);

CREATE TRIGGER set_timestamp_leads_captura
BEFORE UPDATE ON public.leads_captura
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- deals table
CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_first_name text,
  deal_last_name text,
  deal_full_name text,
  deal_phone text,
  deal_email text,
  deal_status text NOT NULL DEFAULT 'negocio_novo',
  deal_cpf text,
  deal_rg text,
  deal_rua text,
  deal_numero text,
  deal_bairro text,
  deal_cidade text,
  deal_estado text,
  deal_cep text,
  deal_servico text,
  deal_valor_contrato numeric(12,2),
  deal_forma_pagamento text,
  deal_parcelas integer,
  parcelas_datas jsonb,
  deal_documento_frente text,
  deal_documento_verso text,
  deal_audio text,
  deal_copia_contrato_assinado text,
  deal_comprovante_residencia text,
  vendedor_responsavel uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX deals_vendedor_status_idx ON public.deals (vendedor_responsavel, deal_status);
CREATE INDEX deals_created_at_idx ON public.deals (created_at DESC);

CREATE TRIGGER set_timestamp_deals
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- equipe table
CREATE TABLE public.equipe (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text,
  user_email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'vendedor')),
  ip_address inet,
  geolocation jsonb,
  status text NOT NULL DEFAULT 'offline',
  last_activity timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX equipe_user_email_unique_idx ON public.equipe (user_email);
CREATE INDEX equipe_role_idx ON public.equipe (role);
CREATE INDEX equipe_status_idx ON public.equipe (status);

CREATE TRIGGER set_timestamp_equipe
BEFORE UPDATE ON public.equipe
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
;
