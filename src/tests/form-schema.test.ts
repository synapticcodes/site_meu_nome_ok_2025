import { describe, expect, it } from 'vitest';
import { clientFormSchema, serverFormSchema } from '@lib/forms/schema';

const baseClientData = {
  personType: 'cpf',
  fullName: 'Fulano de Tal',
  document: '12345678901',
  email: 'teste@example.com',
  phone: '11987654321',
  debtType: 'cartao',
  debtValue: '150000',
  creditor: 'Banco XPTO',
  city: 'São Paulo',
  state: 'SP',
  hasLawsuit: 'nao',
  preferredContact: 'whatsapp',
  bestTime: 'qualquer',
  consent: true
} as const;

describe('clientFormSchema', () => {
  it('accepts valid data', () => {
    const result = clientFormSchema.safeParse(baseClientData);
    expect(result.success).toBe(true);
  });

  it('rejects CPF with wrong length', () => {
    const result = clientFormSchema.safeParse({ ...baseClientData, document: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects when consent is false', () => {
    const result = clientFormSchema.safeParse({ ...baseClientData, consent: false });
    expect(result.success).toBe(false);
  });
});

describe('serverFormSchema', () => {
  it('normalizes server payload', () => {
    const result = serverFormSchema.safeParse({
      ...baseClientData,
      document: '12345678901',
      phone: '11987654321',
      debtValue: 1500
    });
    expect(result.success).toBe(true);
  });
});
