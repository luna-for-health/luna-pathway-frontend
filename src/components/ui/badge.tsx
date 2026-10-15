import * as React from 'react';

import { cn } from '@/lib/utils';
import type { BadgeColor, BadgeNotificationProps, BadgeProps } from '@/types';

const BADGE_STYLES: Record<BadgeColor, { bg: string; text: string }> = {
  success: { bg: 'bg-badge-success-bg', text: 'text-badge-success-text' },
  info: { bg: 'bg-badge-info-bg', text: 'text-badge-info-text' },
  warning: { bg: 'bg-badge-warning-bg', text: 'text-badge-warning-text' },
  danger: { bg: 'bg-badge-danger-bg', text: 'text-badge-danger-text' },
  primary: { bg: 'bg-badge-primary-bg', text: 'text-heading-primary' },
  secondary: { bg: 'bg-badge-secondary-bg', text: 'text-badge-secondary-text' },
  neutral: { bg: 'bg-badge-neutral-bg', text: 'text-body-primary' },
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { className, label, color = 'success', size = 'sm', hasDot = false, icon, ...props },
  ref
) {
  const { bg, text } = BADGE_STYLES[color];
  const isMd = size === 'md';

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        bg,
        text,
        isMd ? 'h-6 gap-1 px-3' : 'h-5 gap-2 px-2 py-1',
        className
      )}
      {...props}
    >
      {isMd && icon && <span className="size-5 shrink-0">{icon}</span>}
      {hasDot && (
        <span className={cn('size-2 shrink-0 rounded-full', text.replace('text-', 'bg-'))} />
      )}
      <span
        className={cn('font-medium whitespace-nowrap', isMd ? 'text-xs' : 'text-[10px] leading-4')}
      >
        {label}
      </span>
    </div>
  );
});

const BadgeNotification = React.forwardRef<HTMLDivElement, BadgeNotificationProps>(
  function BadgeNotification({ className, color = 'pink', count = 9, ...props }, ref) {
    const isWireframe = color === 'wireframe';

    return (
      <div
        ref={ref}
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-[4px]',
          isWireframe ? 'bg-black text-white' : 'bg-badge-danger-bg text-badge-danger-text',
          className
        )}
        {...props}
      >
        <span className="text-xs font-medium">{count}</span>
      </div>
    );
  }
);

export { Badge, BadgeNotification };
