import { z } from 'zod';

export const personTypeEnum = z.enum(['cpf', 'cnpj']);
export const debtTypeEnum = z.enum(['cartao', 'emprestimo', 'financiamento', 'servicos', 'tributos', 'outros']);
export const lawsuitEnum = z.enum(['sim', 'nao']);
export const preferredContactEnum = z.enum(['whatsapp', 'telefone', 'email']);
export const bestTimeEnum = z.enum(['manha', 'tarde', 'noite', 'qualquer']);

export const brazilStates = [
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO'
] as const;

export const clientFormSchema = z
  .object({
    personType: personTypeEnum,
    fullName: z.string().min(3, 'Informe seu nome completo'),
    document: z.string().min(11, 'Documento inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    debtType: debtTypeEnum,
    debtValue: z.string().min(1, 'Informe o valor da dívida'),
    creditor: z.string().min(3, 'Informe o credor principal'),
    city: z.string().min(2, 'Informe a cidade'),
    state: z.enum(brazilStates, { errorMap: () => ({ message: 'Selecione o estado' }) }),
    hasLawsuit: lawsuitEnum,
    preferredContact: preferredContactEnum,
    bestTime: bestTimeEnum,
    additionalInfo: z.string().max(500).optional(),
    consent: z
      .boolean()
      .refine((value) => value === true, { message: 'É necessário aceitar a política de privacidade' })
  })
  .superRefine((data, ctx) => {
    const digitsDocument = data.document.replace(/\D/g, '');
    if (data.personType === 'cpf' && digitsDocument.length !== 11) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['document'], message: 'CPF inválido' });
    }
    if (data.personType === 'cnpj' && digitsDocument.length !== 14) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['document'], message: 'CNPJ inválido' });
    }

    const digitsPhone = data.phone.replace(/\D/g, '');
    if (digitsPhone.length < 10 || digitsPhone.length > 11) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: 'Telefone inválido' });
    }

    if (!data.debtValue.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['debtValue'], message: 'Informe o valor da dívida' });
    }
  });

export const serverFormSchema = z.object({
  personType: personTypeEnum,
  fullName: z.string().min(3),
  document: z.string().min(11),
  email: z.string().email(),
  phone: z.string().min(10),
  debtType: debtTypeEnum,
  debtValue: z.number().nonnegative(),
  creditor: z.string().min(3),
  city: z.string().min(2),
  state: z.enum(brazilStates),
  hasLawsuit: lawsuitEnum,
  preferredContact: preferredContactEnum,
  bestTime: bestTimeEnum,
  additionalInfo: z.string().max(500).optional(),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: 'É necessário aceitar a política de privacidade' })
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type ServerFormValues = z.infer<typeof serverFormSchema>;
