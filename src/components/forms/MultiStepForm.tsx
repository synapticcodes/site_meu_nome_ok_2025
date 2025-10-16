import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Checkbox } from '@components/ui/Checkbox';
import { cn } from '@utils/cn';
import { formatCurrency, formatDocument, formatPhone, onlyDigits } from '@utils/formatters';
import {
  clientFormSchema,
  brazilStates,
  debtTypeEnum,
  preferredContactEnum,
  bestTimeEnum
} from '@lib/forms/schema';
import type { ClientFormValues } from '@lib/forms/schema';
const schema = clientFormSchema;
export type FormValues = ClientFormValues;

const stepFields: (keyof FormValues)[][] = [
  ['personType', 'fullName', 'document', 'email', 'phone'],
  ['debtType', 'debtValue', 'creditor', 'city', 'state', 'hasLawsuit'],
  ['preferredContact', 'bestTime', 'additionalInfo', 'consent']
];

const debtTypeOptions = debtTypeEnum.options.map((value) => ({
  value,
  label:
    value === 'cartao'
      ? 'Cartão de crédito'
      : value === 'emprestimo'
        ? 'Empréstimo pessoal'
        : value === 'financiamento'
          ? 'Financiamento'
          : value === 'servicos'
            ? 'Serviços essenciais (energia, água, telecom)'
            : value === 'tributos'
              ? 'Tributos / dívidas públicas'
              : 'Outros'
}));

const preferredContactOptions = preferredContactEnum.options.map((value) => ({
  value,
  label:
    value === 'whatsapp'
      ? 'WhatsApp'
      : value === 'telefone'
        ? 'Telefone'
        : 'E-mail'
}));

const bestTimeOptions = bestTimeEnum.options.map((value) => ({
  value,
  label:
    value === 'manha'
      ? 'Manhã'
      : value === 'tarde'
        ? 'Tarde'
        : value === 'noite'
          ? 'Noite'
          : 'Qualquer horário'
}));

const buildInitialValues = (): FormValues => ({
  personType: 'cpf',
  fullName: '',
  document: '',
  email: '',
  phone: '',
  debtType: 'cartao',
  debtValue: '',
  creditor: '',
  city: '',
  state: 'SP',
  hasLawsuit: 'nao',
  preferredContact: 'whatsapp',
  bestTime: 'qualquer',
  additionalInfo: '',
  consent: false
});

export const MultiStepForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildInitialValues()
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const progress = useMemo(() => ((currentStep + 1) / stepFields.length) * 100, [currentStep]);

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(fields, { shouldFocus: true });
    if (!valid) return;
    setCurrentStep((prev) => Math.min(prev + 1, stepFields.length - 1));
    window.scrollTo({ top: (document.getElementById('formulario')?.offsetTop ?? 0) - 120, behavior: 'smooth' });
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setStatus('idle');
    try {
    const payload = {
      ...values,
      document: onlyDigits(values.document),
      phone: onlyDigits(values.phone),
      debtValue: Number(onlyDigits(values.debtValue)) / 100
    };

      const response = await fetch('/api/forms/limpar-nome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o formulário');
      }

      setStatus('success');
      form.reset(buildInitialValues());
      setCurrentStep(0);
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/obrigado?ref=form-limpeza';
        }, 600);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === stepFields.length - 1;

  return (
    <div className="w-full rounded-3xl border border-neutral-100 bg-white p-6 shadow-soft">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">Etapa {currentStep + 1} de {stepFields.length}</span>
          <span className="text-sm text-neutral-500">{Math.round(progress)}% concluído</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-neutral-100">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="personType"
                render={({ field }) => (
                  <Select id="personType" label="Tipo de pessoa" value={field.value} onChange={field.onChange}>
                    <option value="cpf">Pessoa física (CPF)</option>
                    <option value="cnpj">Pessoa jurídica (CNPJ)</option>
                  </Select>
                )}
              />
              <Controller
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <Input
                    id="fullName"
                    label="Nome completo"
                    placeholder="Informe seu nome"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="document"
              render={({ field, fieldState }) => (
                <Input
                  id="document"
                  label={form.watch('personType') === 'cpf' ? 'CPF' : 'CNPJ'}
                  placeholder={form.watch('personType') === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                  error={fieldState.error?.message}
                  value={formatDocument(field.value ?? '', form.watch('personType'))}
                  onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                />
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    id="email"
                    type="email"
                    label="E-mail"
                    placeholder="exemplo@email.com"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Input
                    id="phone"
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    error={fieldState.error?.message}
                    value={formatPhone(field.value ?? '')}
                    onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                  />
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <Controller
              control={form.control}
              name="debtType"
              render={({ field, fieldState }) => (
                <Select
                  id="debtType"
                  label="Tipo de dívida principal"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {debtTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="debtValue"
                render={({ field, fieldState }) => (
                  <Input
                    id="debtValue"
                    label="Valor aproximado da dívida"
                    placeholder="R$ 0,00"
                    error={fieldState.error?.message}
                    value={field.value ? formatCurrency(field.value) : ''}
                    onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="creditor"
                render={({ field, fieldState }) => (
                  <Input
                    id="creditor"
                    label="Credor principal"
                    placeholder="Nome do credor"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Controller
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <Input
                    id="city"
                    label="Cidade"
                    placeholder="Informe a cidade"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <Select
                    id="state"
                    label="Estado"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  >
                    {brazilStates.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={form.control}
                name="hasLawsuit"
                render={({ field }) => (
                  <Select id="hasLawsuit" label="Existe ação judicial?" value={field.value} onChange={field.onChange}>
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </Select>
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="preferredContact"
                render={({ field }) => (
                  <Select
                    id="preferredContact"
                    label="Canal preferido para contato"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {preferredContactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={form.control}
                name="bestTime"
                render={({ field }) => (
                  <Select id="bestTime" label="Melhor horário" value={field.value} onChange={field.onChange}>
                    {bestTimeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="additionalInfo"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label htmlFor="additionalInfo" className="text-sm font-semibold text-neutral-700">
                    Informações adicionais (opcional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    className={cn(
                      'w-full rounded-3xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
                      fieldState.error && 'border-feedback-error'
                    )}
                    placeholder="Compartilhe detalhes que possam ajudar na negociação"
                    {...field}
                  />
                  {fieldState.error && (
                    <p className="text-xs font-medium text-feedback-error">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="consent"
              render={({ field, fieldState }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  label="Autorizo o uso dos meus dados para análise e contato"
                  description="Seus dados são protegidos pela LGPD e usados apenas para a negociação das dívidas."
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        )}

        {status === 'success' && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-feedback-success/40 bg-feedback-success/10 p-4 text-sm text-feedback-success"
          >
            Recebemos seu formulário! Um especialista entrará em contato em até 24 horas úteis.
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-feedback-error/40 bg-feedback-error/10 p-4 text-sm text-feedback-error"
          >
            Não foi possível enviar o formulário. Tente novamente ou fale com a nossa equipe pelo WhatsApp 0800 123 4567.
          </div>
        )}

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={currentStep === 0 || isSubmitting}
            onClick={previousStep}
          >
            Voltar
          </Button>
          {isLastStep ? (
            <Button type="submit" loading={isSubmitting}>
              Enviar formulário
            </Button>
          ) : (
            <Button type="button" onClick={nextStep}>
              Avançar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
