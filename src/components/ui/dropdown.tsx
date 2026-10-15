import * as React from 'react';

import { Popover } from 'radix-ui';

import { cn } from '@/lib/utils';
import type { DropdownProps } from '@/types';

/**
 * Luna DS "DropdownMenu" (node 12167:5552 / 12167:5558, DS file) — a popover panel
 * of `MenuItem` rows. The panel's rows are just the already-built `Menu`/`MenuItem`
 * (from the Menu/Search batch): every color/hover/selected token the Figma states
 * table shows (`menu/neutral/text`, `menu/neutral/text-hovered`,
 * `menu/neutral/background-hovered`, `menu/danger/text`) is already in
 * `index.css` — genuine DS-level reuse, not a coincidence. Pass a `<Menu>` of
 * `<MenuItem>`s as `children`.
 *
 * Positioning/portal/dismiss-on-outside-click is delegated to radix-ui's `Popover`
 * (rather than its `DropdownMenu` primitive) so the existing custom `Menu`/
 * `MenuItem` markup and click handling can be reused as-is instead of being
 * rebuilt against radix's own `Item` semantics.
 *
 * The panel shell needs one new token: `--color-dropdown-border` (Figma
 * `card/outline-40`, #949ab8) — distinct from `--color-card-border` (#d0d3e2) even
 * though both are gray borders, because Figma names them as separate variables.
 * The white surface reuses `--color-neutral-white`.
 */
const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  {
    open,
    defaultOpen,
    onOpenChange,
    trigger,
    align = 'start',
    side = 'bottom',
    sideOffset = 8,
    className,
    children,
  },
  ref
) {
  return (
    <Popover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={ref}
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn(
            'border-dropdown-border bg-neutral-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 flex w-fit min-w-45 flex-col gap-1 rounded-lg border p-1 outline-none',
            className
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

export { Dropdown };
