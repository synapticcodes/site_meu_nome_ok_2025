-- Ensure pgcrypto is available for UUID generation
create extension if not exists "pgcrypto";

create table if not exists public.leads_site (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  submitted_at timestamptz not null default timezone('utc', now()),
  person_type text not null check (person_type in ('cpf', 'cnpj')),
  full_name text not null,
  document varchar(14) not null,
  email text not null,
  phone varchar(11) not null,
  debt_type text not null check (
    debt_type in ('cartao', 'emprestimo', 'financiamento', 'servicos', 'tributos', 'outros')
  ),
  debt_value numeric(12,2) not null,
  creditor text not null,
  city text not null,
  state char(2) not null,
  has_lawsuit boolean not null,
  preferred_contact text not null check (
    preferred_contact in ('whatsapp', 'telefone', 'email')
  ),
  best_time text not null check (best_time in ('manha', 'tarde', 'noite', 'qualquer')),
  additional_info text,
  consent boolean not null default false,
  source text
);

create index if not exists leads_site_document_idx on public.leads_site (document);
create index if not exists leads_site_phone_idx on public.leads_site (phone);
create index if not exists leads_site_submitted_at_idx on public.leads_site (submitted_at);
