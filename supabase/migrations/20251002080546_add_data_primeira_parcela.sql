-- Adds the first installment date column to deals records
alter table public.deals
  add column if not exists data_primeira_parcela date;
