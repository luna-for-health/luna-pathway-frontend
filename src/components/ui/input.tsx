import * as React from 'react';

import { CloseCircleIcon, DangerCircleIcon, EyeIcon, EyeOffIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { InputProps } from '@/types';

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type = 'text',
    label,
    icon,
    error = false,
    id,
    value,
    defaultValue,
    onChange,
    disabled,
    ...props
  },
  forwardedRef
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const innerRef = React.useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = React.useState(Boolean(value ?? defaultValue));
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const isControlled = value !== undefined;
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

  React.useEffect(() => {
    if (isControlled) setHasValue(Boolean(value));
  }, [isControlled, value]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHasValue(Boolean(event.target.value));
    onChange?.(event);
  }

  function handleClear() {
    const el = innerRef.current;
    if (!el) return;
    setNativeInputValue(el, '');
    el.focus();
    setHasValue(false);
  }

  const showClear = hasValue && !disabled && !hasError;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-body-primary text-sm font-medium">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-14 w-full items-center gap-3 rounded-lg pr-3 pl-6 backdrop-blur-xs transition-colors',
          hasError
            ? 'bg-form-field-background-errored hover:border-form-field-border-errored has-[input:focus]:border-form-field-border-errored hover:border has-[input:focus]:border-2 has-[input:focus]:hover:border-2'
            : 'bg-neutral-05 hover:border-form-field-border-hovered has-[input:focus]:border-form-field-border-hovered hover:border has-[input:focus]:border-2 has-[input:focus]:hover:border-2',
          'has-[input:disabled]:border-form-field-border-disabled has-[input:disabled]:bg-form-field-background-disabled has-[input:disabled]:hover:border-form-field-border-disabled has-[input:disabled]:border'
        )}
      >
        {icon && (
          <span
            className={cn(
              'size-6 shrink-0',
              hasError
                ? 'text-form-field-text-errored'
                : disabled
                  ? 'text-form-field-text-disabled'
                  : 'text-form-field-icon'
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          ref={innerRef}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          data-slot="input"
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={hasError || undefined}
          className={cn(
            'placeholder:text-form-field-placeholder disabled:text-form-field-text-disabled disabled:placeholder:text-form-field-text-disabled w-full min-w-0 bg-transparent text-base transition-colors outline-none disabled:cursor-not-allowed lg:text-sm',
            hasError ? 'text-form-field-text-errored' : 'text-form-field-text',
            className
          )}
          {...props}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(shown => !shown)}
            className="shrink-0 outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <EyeOffIcon size={24} color="formFieldIcon" />
            ) : (
              <EyeIcon size={24} color="formFieldIcon" />
            )}
          </button>
        )}

        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 outline-none"
            tabIndex={-1}
            aria-label="Effacer"
          >
            <CloseCircleIcon size={16} fillColor="formFieldIcon" />
          </button>
        )}

        {hasError && (
          <DangerCircleIcon
            className="text-form-field-text-errored size-6 shrink-0"
            aria-hidden="true"
          />
        )}
      </div>

      {errorMessage && (
        <p className="text-form-field-text-errored text-sm font-medium">{errorMessage}</p>
      )}
    </div>
  );
});

export { Input };
