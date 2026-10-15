import * as React from 'react';

import { CheckCircleIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { OptionListProps, OptionProps } from '@/types';

/**
 * Padding fix (2026-09-09): Figma's Option spec uses spacing TOKENS whose names are pixel
 * values (spacing-24 = 24px, spacing-40 = 40px, spacing-16 = 16px), but Tailwind's own pl-N/
 * pr-N scale is in units of 0.25rem (4px) — so pl-24/pr-40/pr-16 (the token numbers taken
 * literally) rendered as 96px/160px/64px, four times too large. On the one screen that puts two
 * Options side by side on a narrow (mobile) row (`PatientImaging`'s Oui/Non question), that
 * oversized padding left zero room for the label text, making it invisible. Correct mapping:
 * spacing-24 → pl-6, spacing-40 → pr-10, spacing-16 → pr-4 (see Figma node 7371:4495/7371:4645).
 */
const Option = React.forwardRef<HTMLButtonElement, OptionProps>(function Option(
  { className, label, selected = false, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      role="option"
      aria-selected={selected}
      className={cn(
        'relative flex min-h-12 w-full items-center rounded-lg border bg-white pl-6 text-left text-sm font-medium transition-colors',
        selected
          ? 'bg-option-list-background-selected border-option-list-border-selected text-option-list-label border-2 pr-4'
          : 'border-option-list-border text-option-list-label hover:border-option-list-border-hovered hover:text-option-list-label-hover pr-10',
        className
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
      {selected && (
        <CheckCircleIcon
          aria-hidden="true"
          className="text-option-list-border-selected absolute right-4 size-6 shrink-0"
        />
      )}
    </button>
  );
});

function OptionList({ className, children, ...props }: OptionListProps) {
  return (
    <div role="listbox" className={cn('flex w-full flex-col gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export { Option, OptionList };
