import * as React from 'react';

import { cn } from '@/lib/utils';
import type { SwitchProps } from '@/types';

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    className,
    checked,
    defaultChecked,
    onCheckedChange,
    label,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isControlled = checked !== undefined;
  const [isChecked, setIsChecked] = React.useState(Boolean(checked ?? defaultChecked));

  React.useEffect(() => {
    if (isControlled) setIsChecked(Boolean(checked));
  }, [isControlled, checked]);

  function handleClick() {
    const next = !isChecked;
    if (!isControlled) setIsChecked(next);
    onCheckedChange?.(next);
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-4',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      {label && (
        <span
          className={cn(
            'flex-1 text-sm',
            disabled ? 'text-form-label-text-disabled' : 'text-form-label-text'
          )}
        >
          {label}
        </span>
      )}
      <button
        ref={ref}
        type={type}
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative h-6 w-12 shrink-0 rounded-full transition-[background-color,box-shadow] disabled:cursor-not-allowed',
          disabled
            ? 'bg-form-switch-background-disabled'
            : isChecked
              ? 'bg-form-switch-background-on hover:shadow-[0_0_0_2px_var(--color-form-field-border-focused)]'
              : 'bg-form-switch-background hover:shadow-[0_0_0_2px_var(--color-form-field-border-focused)]'
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'bg-neutral-white absolute top-0.5 left-0.5 size-5 rounded-full transition-transform',
            isChecked && 'translate-x-[24px]'
          )}
        />
      </button>
    </label>
  );
});

export { Switch };
