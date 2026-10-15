import * as React from 'react';

import { cn } from '@/lib/utils';
import type { CheckboxProps } from '@/types';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    className,
    label,
    indeterminate = false,
    id,
    checked,
    defaultChecked,
    onChange,
    disabled,
    ...props
  },
  forwardedRef
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const innerRef = React.useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const [isChecked, setIsChecked] = React.useState(Boolean(checked ?? defaultChecked));

  React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

  React.useEffect(() => {
    if (isControlled) setIsChecked(Boolean(checked));
  }, [isControlled, checked]);

  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
    onChange?.(event);
  }

  const isFilled = isChecked || indeterminate;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-3',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <span className="relative flex size-6 shrink-0 items-center justify-center">
        <input
          ref={innerRef}
          id={inputId}
          type="checkbox"
          className="peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'peer-focus-visible:ring-form-checkbox-focus-ring pointer-events-none flex size-5 items-center justify-center rounded-sm border transition-colors peer-focus-visible:ring-2',
            disabled
              ? isFilled
                ? 'bg-form-checkbox-checked-disabled border-transparent'
                : 'border-form-checkbox-border-disabled bg-form-checkbox-background-disabled'
              : isFilled
                ? 'bg-form-checkbox-checked border-transparent'
                : 'border-form-checkbox-border bg-form-checkbox-background peer-hover:border-form-checkbox-border-hovered'
          )}
        >
          {indeterminate ? (
            <span
              className="h-0.5 w-3 rounded-full"
              style={{ backgroundColor: 'var(--color-form-checkbox-checked-icon)' }}
            />
          ) : (
            isChecked && (
              <svg viewBox="0 0 12 10" fill="none" className="h-2.5 w-3">
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="var(--color-form-checkbox-checked-icon)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )
          )}
        </span>
      </span>
      {label && (
        <span
          className={cn(
            'text-sm font-medium',
            disabled ? 'text-form-label-text-disabled' : 'text-form-label-text'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
});

export { Checkbox };
