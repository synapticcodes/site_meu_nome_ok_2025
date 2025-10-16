ALTER TABLE public.visitors
  ADD COLUMN IF NOT EXISTS visit_count integer NOT NULL DEFAULT 0;
