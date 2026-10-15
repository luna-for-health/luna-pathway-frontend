import * as React from 'react';

import { CrossIcon, FilterIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { ChipProps, FilterChipProps } from '@/types';

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, label, onRemove, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onRemove}
      className={cn(
        'border-chip-border bg-neutral-white/60 inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border pr-2 pl-4',
        className
      )}
      {...props}
    >
      <span className="text-body-primary text-sm font-medium whitespace-nowrap">{label}</span>
      <CrossIcon className="text-body-primary size-6" />
    </button>
  );
});

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  { className, label, state = 'enabled', count, type = 'button', ...props },
  ref
) {
  const isActivated = state === 'activated';
  const hasLabel = Boolean(label);

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'bg-button-neutral-bg text-heading-primary inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full',
        isActivated ? 'px-2' : hasLabel ? 'pr-3 pl-2' : 'w-14 px-2',
        className
      )}
      {...props}
    >
      <FilterIcon size={24} color="headingPrimary" />
      {hasLabel && <span className="text-sm font-normal whitespace-nowrap">{label}</span>}
      {isActivated && typeof count === 'number' && (
        <span className="bg-heading-primary text-neutral-white flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
          {count}
        </span>
      )}
    </button>
  );
});

export { Chip, FilterChip };
