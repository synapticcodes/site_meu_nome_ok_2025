INSERT INTO storage.buckets (id, name, public) VALUES
  ('arquivos_deals', 'arquivos_deals', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES
  ('audios_deals', 'audios_deals', false)
ON CONFLICT (id) DO NOTHING;
;
