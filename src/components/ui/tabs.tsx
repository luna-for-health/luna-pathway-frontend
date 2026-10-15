import * as React from 'react';

import { cn } from '@/lib/utils';
import type { TabsItemProps, TabsProps } from '@/types';

const TabsItem = React.forwardRef<HTMLButtonElement, TabsItemProps>(function TabsItem(
  { className, label, active = false, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={active}
      className={cn(
        'flex h-10 items-center justify-center rounded-md px-2 text-base',
        active
          ? 'text-tabs-text-selected flex-col font-bold'
          : 'text-tabs-text hover:text-tabs-text-hovered pb-0.5 font-medium',
        className
      )}
      {...props}
    >
      {active ? (
        <>
          <span className="flex min-h-0 flex-1 items-center justify-center px-2">{label}</span>
          <span className="bg-tabs-text-selected h-0.5 w-full rounded-t-[1px]" aria-hidden="true" />
        </>
      ) : (
        label
      )}
    </button>
  );
});

function Tabs({ className, children, ...props }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex items-start gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsItem };
