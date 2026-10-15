import * as React from 'react';

import { cn } from '@/lib/utils';
import type { RadioProps } from '@/types';

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, label, id, checked, defaultChecked, onChange, disabled, ...props },
  forwardedRef
) {
  const generatedId = React.useId();
  const radioId = id ?? generatedId;
  const innerRef = React.useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const [isChecked, setIsChecked] = React.useState(Boolean(checked ?? defaultChecked));

  React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

  React.useEffect(() => {
    if (isControlled) setIsChecked(Boolean(checked));
  }, [isControlled, checked]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
    onChange?.(event);
  }

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <span className="relative flex size-6 shrink-0 items-center justify-center">
        <input
          ref={innerRef}
          id={radioId}
          type="radio"
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
            'peer-focus-visible:ring-form-checkbox-focus-ring pointer-events-none flex size-6 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2',
            disabled
              ? isChecked
                ? 'border-form-radio-checked-disabled'
                : 'border-form-radio-border-disabled'
              : isChecked
                ? 'border-form-radio-checked'
                : 'border-form-radio-border peer-hover:border-form-radio-checked'
          )}
        >
          {isChecked && (
            <span
              className={cn(
                'size-2.5 rounded-full',
                disabled ? 'bg-form-radio-checked-disabled' : 'bg-form-radio-checked'
              )}
            />
          )}
        </span>
      </span>
      {label && (
        <span
          className={cn(
            'text-sm',
            disabled ? 'text-form-label-text-disabled' : 'text-form-label-text'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
});

export { Radio };
