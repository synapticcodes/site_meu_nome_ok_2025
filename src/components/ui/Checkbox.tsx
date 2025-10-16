import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm',
          error && 'border-feedback-error/60',
          className
        )}
      >
        <label className="flex items-start gap-3">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-neutral-300 transition checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              {...props}
            />
            <svg
              className="absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M4.5 10.5 7.8 14l7.7-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="text-sm font-semibold text-neutral-800">{label}</span>
            {description && <p className="text-xs text-neutral-500">{description}</p>}
          </span>
        </label>
        {error && <p className="text-xs font-medium text-feedback-error">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
