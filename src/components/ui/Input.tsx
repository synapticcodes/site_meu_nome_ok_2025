import type { InputHTMLAttributes, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { cn } from '@utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, PropsWithChildren<InputProps>>(
  ({ id, label, helperText, error, className, optional = false, required, ...props }, ref) => {
    const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={id} className="flex items-center justify-between text-sm font-semibold text-neutral-700">
          <span>{label}</span>
          {optional && <span className="text-xs font-medium text-neutral-500">Opcional</span>}
        </label>
        <div
          className={cn(
            'relative flex items-center rounded-full border bg-white px-4 shadow-sm transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
            error ? 'border-feedback-error' : 'border-neutral-100'
          )}
        >
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            required={required && !optional}
            className={cn(
              'peer h-12 w-full rounded-full border-none bg-transparent text-body placeholder:text-neutral-400 focus:outline-none focus:ring-0',
              className
            )}
            {...props}
          />
        </div>
        {helperText && !error && (
          <p id={`${id}-helper`} className="text-xs text-neutral-500">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs font-medium text-feedback-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
