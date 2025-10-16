ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_template_variables ENABLE ROW LEVEL SECURITY;

CREATE POLICY contract_templates_admin_policy
  ON public.contract_templates
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY contract_template_variables_admin_policy
  ON public.contract_template_variables
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
;
