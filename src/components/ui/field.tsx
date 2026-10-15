import { cn } from '@/lib/utils';
import type { FieldProps } from '@/types';

function Field({
  className,
  label,
  required = false,
  helperText,
  error = false,
  htmlFor,
  children,
  ...props
}: FieldProps) {
  const hasError = Boolean(error);
  const message = typeof error === 'string' ? error : helperText;

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-form-label-text inline-flex items-center gap-1 text-sm font-medium"
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              className="bg-form-label-mandatory inline-block size-1.5 shrink-0 rounded-full"
            />
          )}
        </label>
      )}

      {children}

      {message && (
        <p
          className={cn(
            'text-sm',
            hasError ? 'text-form-helper-text-danger font-medium' : 'text-form-helper-text'
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export { Field };
