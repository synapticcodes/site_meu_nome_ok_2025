-- Helper functions for role checks
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.equipe
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.equipe WHERE id = auth.uid()), FALSE);
$$;

GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Enable RLS
ALTER TABLE public.leads_captura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;

-- Policies for leads_captura
CREATE POLICY leads_captura_select_policy
  ON public.leads_captura
  FOR SELECT
  USING (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY leads_captura_insert_policy
  ON public.leads_captura
  FOR INSERT
  WITH CHECK (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY leads_captura_update_policy
  ON public.leads_captura
  FOR UPDATE
  USING (public.is_admin() OR vendedor_responsavel = auth.uid())
  WITH CHECK (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY leads_captura_delete_policy
  ON public.leads_captura
  FOR DELETE
  USING (public.is_admin() OR vendedor_responsavel = auth.uid());

-- Policies for deals
CREATE POLICY deals_select_policy
  ON public.deals
  FOR SELECT
  USING (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY deals_insert_policy
  ON public.deals
  FOR INSERT
  WITH CHECK (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY deals_update_policy
  ON public.deals
  FOR UPDATE
  USING (public.is_admin() OR vendedor_responsavel = auth.uid())
  WITH CHECK (public.is_admin() OR vendedor_responsavel = auth.uid());

CREATE POLICY deals_delete_policy
  ON public.deals
  FOR DELETE
  USING (public.is_admin() OR vendedor_responsavel = auth.uid());

-- Policies for equipe
CREATE POLICY equipe_select_policy_admin
  ON public.equipe
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY equipe_select_policy_self
  ON public.equipe
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY equipe_insert_policy_admin
  ON public.equipe
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY equipe_update_policy_admin
  ON public.equipe
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY equipe_update_policy_self
  ON public.equipe
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY equipe_delete_policy_admin
  ON public.equipe
  FOR DELETE
  USING (public.is_admin());
;
