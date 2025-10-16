import { Pool } from 'pg';

declare global {
  var __supabaseDbPool: Pool | undefined;
}

const resolveConnectionString = () =>
  process.env.SUPABASE_DB_URL ?? import.meta.env.SUPABASE_DB_URL ?? '';

export const getDatabasePool = () => {
  if (!globalThis.__supabaseDbPool) {
    const connectionString = resolveConnectionString();
    if (!connectionString) {
      throw new Error('SUPABASE_DB_URL is not configured');
    }

    const max =
      Number.parseInt(process.env.SUPABASE_DB_POOL_MAX ?? '', 10) ||
      Number.parseInt(import.meta.env.SUPABASE_DB_POOL_MAX ?? '', 10) ||
      5;
    const idle =
      Number.parseInt(process.env.SUPABASE_DB_IDLE_TIMEOUT ?? '', 10) ||
      Number.parseInt(import.meta.env.SUPABASE_DB_IDLE_TIMEOUT ?? '', 10) ||
      30;

    const pool = new Pool({
      connectionString,
      max,
      idleTimeoutMillis: idle * 1000,
      ssl: { rejectUnauthorized: false }
    });

    pool.on('error', (error) => {
      console.error('[leads_site] Unexpected database error', error);
    });

    globalThis.__supabaseDbPool = pool;
  }

  return globalThis.__supabaseDbPool;
};

export type LeadsSiteInsert = {
  submittedAt: string;
  personType: 'cpf' | 'cnpj';
  fullName: string;
  document: string;
  email: string;
  phone: string;
  debtType: 'cartao' | 'emprestimo' | 'financiamento' | 'servicos' | 'tributos' | 'outros';
  debtValue: number;
  creditor: string;
  city: string;
  state: string;
  hasLawsuit: 'sim' | 'nao';
  preferredContact: 'whatsapp' | 'telefone' | 'email';
  bestTime: 'manha' | 'tarde' | 'noite' | 'qualquer';
  additionalInfo?: string | null;
  consent: boolean;
  source?: string | null;
};

export const insertLead = async (payload: LeadsSiteInsert) => {
  const pool = getDatabasePool();

  await pool.query(
    `
      insert into public.leads_site (
        submitted_at,
        person_type,
        full_name,
        document,
        email,
        phone,
        debt_type,
        debt_value,
        creditor,
        city,
        state,
        has_lawsuit,
        preferred_contact,
        best_time,
        additional_info,
        consent,
        source
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
    `,
    [
      payload.submittedAt,
      payload.personType,
      payload.fullName,
      payload.document,
      payload.email,
      payload.phone,
      payload.debtType,
      payload.debtValue,
      payload.creditor,
      payload.city,
      payload.state,
      payload.hasLawsuit === 'sim',
      payload.preferredContact,
      payload.bestTime,
      payload.additionalInfo ?? null,
      payload.consent,
      payload.source ?? null
    ]
  );
};
