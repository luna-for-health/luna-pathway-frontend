import * as React from 'react';

import { ChevronRightIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { LinkProps } from '@/types';

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, label, size = 'md', icon, iconPosition = 'right', ...props },
  ref
) {
  const resolvedIcon =
    iconPosition === 'none'
      ? null
      : (icon ?? (
          <ChevronRightIcon
            aria-hidden="true"
            className={cn('shrink-0', size === 'sm' ? 'size-3.5' : 'size-4')}
          />
        ));
  const showLeft = iconPosition === 'left' || iconPosition === 'both';
  const showRight = iconPosition === 'right' || iconPosition === 'both';

  return (
    <a
      ref={ref}
      className={cn(
        'text-link-text hover:text-link-text-hovered focus:text-link-text-hovered inline-flex items-center gap-1 rounded-md p-1 underline decoration-solid transition-colors outline-none focus:shadow-[0_0_0_1px_white,0_0_0_3px_var(--color-link-focus-ring)]',
        size === 'sm' ? 'text-sm' : 'text-base',
        className
      )}
      {...props}
    >
      {showLeft && resolvedIcon}
      {label}
      {showRight && resolvedIcon}
    </a>
  );
});

export { Link };
