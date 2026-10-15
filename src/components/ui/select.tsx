import * as React from 'react';

import { ChevronDownIcon, DangerCircleIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { SelectProps } from '@/types';

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error = false, placeholder, disabled, id, value, defaultValue, children, ...props },
  forwardedRef
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div
      className={cn(
        'flex h-14 w-full items-center gap-1 rounded-md pr-3 pl-6 transition-colors',
        hasError
          ? 'bg-form-field-background-errored border-form-field-border-errored border has-[select:focus]:border-2 has-[select:focus]:shadow-[0_0_0_2px_var(--color-form-field-shadow-errored)]'
          : 'bg-form-field-background border-form-field-border hover:border-form-field-border-hovered has-[select:focus]:border-form-field-border-hovered border has-[select:focus]:border-2 has-[select:focus]:shadow-[0_0_0_2px_var(--color-form-field-border-focused)]',
        'has-[select:disabled]:border-form-field-border-disabled has-[select:disabled]:bg-form-field-background-disabled'
      )}
    >
      <select
        ref={forwardedRef}
        id={selectId}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={hasError || undefined}
        className={cn(
          'text-form-field-text disabled:text-form-field-text-disabled w-full appearance-none bg-transparent text-sm outline-none disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>

      {hasError ? (
        <DangerCircleIcon
          className="text-form-field-text-errored size-6 shrink-0"
          aria-hidden="true"
        />
      ) : (
        <span aria-hidden="true">
          <ChevronDownIcon size={16} fillColor="formFieldIcon" />
        </span>
      )}
    </div>
  );
});

export { Select };
