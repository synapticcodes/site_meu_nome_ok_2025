INSERT INTO storage.buckets (id, name, public)
VALUES ('contract_templates', 'contract_templates', false)
ON CONFLICT (id) DO NOTHING;
;
