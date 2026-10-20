import * as React from 'react';

import type { OtpInputProps } from '@/features/auth-patient/types';
import { cn } from '@/lib/utils';

const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput(
  {
    length = 6,
    value,
    defaultValue = '',
    onChange,
    onComplete,
    error = false,
    onErrorTimeout,
    disabled = false,
    className,
    autoFocus = false,
    name,
  },
  forwardedRef
) {
  const isControlled = value !== undefined;
  const [innerDigits, setInnerDigits] = React.useState<string[]>(() =>
    Array.from({ length }, (_, i) => defaultValue[i] ?? '')
  );
  const [isShaking, setIsShaking] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = isControlled ? Array.from({ length }, (_, i) => value[i] ?? '') : innerDigits;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  React.useImperativeHandle(forwardedRef, () => inputRefs.current[0] as HTMLInputElement);

  function commit(nextDigits: string[]) {
    if (!isControlled) setInnerDigits(nextDigits);
    const nextValue = nextDigits.join('');
    onChange?.(nextValue);
    if (nextDigits.every(digit => digit !== '')) onComplete?.(nextValue);
  }

  React.useEffect(() => {
    if (!hasError) return;

    setIsShaking(true);
    const shakeTimeout = setTimeout(() => setIsShaking(false), 450);
    const resetTimeout = setTimeout(() => {
      commit(Array.from({ length }, () => ''));
      inputRefs.current[0]?.focus();
      onErrorTimeout?.();
    }, 550);

    return () => {
      clearTimeout(shakeTimeout);
      clearTimeout(resetTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  function handleChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const char = event.target.value.slice(-1);
      if (char && !/^[0-9]$/.test(char)) return;
      const next = [...digits];
      next[index] = char;
      commit(next);
      if (char && index < length - 1) inputRefs.current[index + 1]?.focus();
    };
  }

  function handleKeyDown(index: number) {
    return (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
        event.preventDefault();
        const next = [...digits];
        if (next[index]) {
          next[index] = '';
          commit(next);
        } else if (index > 0) {
          next[index - 1] = '';
          commit(next);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (event.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (event.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    commit(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto">
      <div className={cn('flex w-full gap-1 lg:w-auto', isShaking && 'animate-shake', className)}>
        {digits.map((digit, index) => (
          <div
            key={index}
            className={cn(
              'relative flex aspect-square flex-1 items-center justify-center rounded-lg transition-colors lg:size-12 lg:flex-none lg:shrink-0',
              disabled
                ? 'bg-form-field-background-disabled'
                : hasError
                  ? 'border-form-number-border-errored bg-form-number-background-errored border-2'
                  : cn(
                      digit ? 'bg-form-number-background-populated' : 'bg-form-number-background',
                      'has-[input:focus]:border-form-number-border-focused has-[input:focus]:bg-form-number-background-focused has-[input:focus]:border-2'
                    )
            )}
          >
            {!digit && (
              <span
                aria-hidden="true"
                className="bg-form-number-placeholder pointer-events-none absolute h-0.5 w-4 rounded-full"
              />
            )}
            <input
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste}
              disabled={disabled}
              autoFocus={autoFocus && index === 0}
              aria-label={`Chiffre ${index + 1} sur ${length}`}
              aria-invalid={hasError || undefined}
              className={cn(
                'relative size-full bg-transparent text-center text-base font-normal outline-none disabled:cursor-not-allowed',
                disabled
                  ? 'text-form-field-text-disabled'
                  : hasError
                    ? 'text-form-number-text-errored'
                    : digit
                      ? 'text-form-number-text focus:text-form-number-text-focused'
                      : 'focus:text-form-number-text-focused'
              )}
            />
          </div>
        ))}
      </div>

      {errorMessage && (
        <p className="text-form-number-text-errored w-full text-center text-sm font-medium">
          {errorMessage}
        </p>
      )}

      {name && <input type="hidden" name={name} value={digits.join('')} readOnly />}
    </div>
  );
});

export { OtpInput };
