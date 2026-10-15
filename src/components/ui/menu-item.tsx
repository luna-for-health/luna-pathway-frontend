import * as React from 'react';

import { cn } from '@/lib/utils';
import type { MenuItemProps, MenuProps } from '@/types';

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  {
    className,
    label,
    color = 'neutral',
    selected = false,
    icon,
    trailingIcon,
    number,
    type = 'button',
    ...props
  },
  ref
) {
  const isDanger = color === 'danger';
  const isSelected = !isDanger && selected;

  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      aria-selected={isDanger ? undefined : selected}
      className={cn(
        'flex h-10 w-full items-center gap-3 rounded-md px-3 text-left transition-colors',
        isDanger
          ? 'text-menu-danger-text hover:bg-menu-danger-background-hovered hover:text-menu-danger-text-hovered'
          : isSelected
            ? 'bg-menu-neutral-background-selected text-menu-neutral-text-selected'
            : 'text-menu-neutral-text hover:bg-menu-neutral-background-hovered hover:text-menu-neutral-text-hovered',
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
      {number && <span className="shrink-0 text-xs font-medium whitespace-nowrap">{number}</span>}
      {trailingIcon && (
        <span
          className="size-6 shrink-0 [&_[fill]]:fill-current [&_[fill]]:transition-colors"
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
});

function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div role="menu" className={cn('flex w-full flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export { Menu, MenuItem };
