import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, helperText, error, className, children, ...props }, ref) => {
    const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-neutral-700">
          {label}
        </label>
        <div
          className={cn(
            'relative flex items-center rounded-full border bg-white px-4 shadow-sm transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
            error ? 'border-feedback-error' : 'border-neutral-100'
          )}
        >
          <select
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'h-12 w-full appearance-none rounded-full border-none bg-transparent pr-8 text-body text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-0',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <svg
            className="pointer-events-none absolute right-4 h-4 w-4 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
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

Select.displayName = 'Select';
