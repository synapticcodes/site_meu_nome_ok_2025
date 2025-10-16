INSERT INTO storage.buckets (id, name, public)
VALUES ('contratos_assinados', 'contratos_assinados', false)
ON CONFLICT (id) DO NOTHING;
;
