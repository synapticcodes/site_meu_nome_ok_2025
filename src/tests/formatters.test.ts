import { describe, expect, it } from 'vitest';
import { formatCPF, formatCNPJ, formatPhone, formatCurrency, onlyDigits } from '@utils/formatters';

describe('formatters', () => {
  it('formats CPF correctly', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('formats CNPJ correctly', () => {
    expect(formatCNPJ('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('formats phone numbers with 11 digits', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formats currency strings', () => {
    const expected = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(19.99);
    expect(formatCurrency('1999')).toBe(expected);
  });

  it('extracts only digits', () => {
    expect(onlyDigits('abc123-45')).toBe('12345');
  });
});
