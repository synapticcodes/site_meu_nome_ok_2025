import type { PropsWithChildren } from 'react';
import { Controller, type FieldPath, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { Input } from '@components/ui/Input';

interface TextFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  helperText?: string;
  optional?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  placeholder?: string;
}

export const TextField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  helperText,
  optional,
  type = 'text',
  ...props
}: PropsWithChildren<TextFieldProps<TFieldValues>>) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          id={name}
          label={label}
          helperText={helperText}
          optional={optional}
          error={fieldState.error?.message}
          type={type}
          {...props}
          {...field}
          value={field.value ?? ''}
        />
      )}
    />
  );
};
