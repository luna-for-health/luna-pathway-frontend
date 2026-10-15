import * as React from 'react';

import { CloseCircleIcon, SearchIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { SearchBarProps } from '@/types';

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { className, placeholder = 'Rechercher', id, value, defaultValue, onChange, disabled, ...props },
  forwardedRef
) {
  const generatedId = React.useId();
  const searchId = id ?? generatedId;
  const innerRef = React.useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = React.useState(Boolean(value ?? defaultValue));
  const isControlled = value !== undefined;

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

  return (
    <div
      className={cn(
        'group bg-search-background flex h-14 w-full items-center gap-3 rounded-lg pr-3 pl-6 transition-colors',
        'hover:border-search-border-hovered has-[input:focus]:border-search-border-hovered border-transparent hover:border has-[input:focus]:border-2 has-[input:focus]:shadow-[0_0_0_2px_var(--color-form-field-border-focused)]',
        'has-[input:disabled]:hover:border-transparent'
      )}
    >
      <SearchIcon
        aria-hidden="true"
        className="text-search-placeholder group-hover:text-search-border-hovered group-has-[input:focus]:text-search-border-hovered size-6 shrink-0 transition-colors"
      />

      <input
        ref={innerRef}
        id={searchId}
        type="search"
        data-slot="search-bar"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={cn(
          'text-search-text placeholder:text-search-placeholder disabled:text-form-field-text-disabled disabled:placeholder:text-form-field-text-disabled w-full min-w-0 bg-transparent text-base transition-colors outline-none disabled:cursor-not-allowed lg:text-sm [&::-webkit-search-cancel-button]:hidden',
          className
        )}
        {...props}
      />

      {hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 outline-none"
          tabIndex={-1}
          aria-label="Effacer la recherche"
        >
          <CloseCircleIcon size={16} fillColor="bodyPrimary" />
        </button>
      )}
    </div>
  );
});

export { SearchBar };
