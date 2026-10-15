import * as React from 'react';

import { ChevronRightIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { ListItemProps, ListProps } from '@/types';

const ListItem = React.forwardRef<HTMLButtonElement, ListItemProps>(function ListItem(
  { className, label, danger = false, icon, hasArrow = true, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
        danger
          ? 'text-list-text-danger hover:bg-list-background-danger-hover'
          : 'text-list-text hover:bg-list-background-hover hover:text-option-list-label-hover',
        className
      )}
      {...props}
    >
      {icon && (
        <span
          className="size-6 shrink-0 [&_[fill]]:fill-current [&_[fill]]:transition-colors"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate text-sm font-medium">{label}</span>
      {hasArrow && <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0" />}
    </button>
  );
});

function List({ className, children, ...props }: ListProps) {
  return (
    <div role="list" className={cn('flex w-full flex-col', className)} {...props}>
      {children}
    </div>
  );
}

export { List, ListItem };
