import * as React from 'react';

import { CheckCircleIcon, DangerCircleIcon, InfoIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { AlertProps, AlertType } from '@/types';

const ALERT_STYLES: Record<
  AlertType,
  { bg: string; text: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  success: { bg: 'bg-alert-success-bg', text: 'text-alert-success-text', Icon: CheckCircleIcon },
  info: { bg: 'bg-alert-info-bg', text: 'text-alert-info-text', Icon: InfoIcon },
  warning: { bg: 'bg-alert-warning-bg', text: 'text-alert-warning-text', Icon: DangerCircleIcon },
  danger: { bg: 'bg-alert-danger-bg', text: 'text-alert-danger-text', Icon: DangerCircleIcon },
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, type = 'success', title, description, children, ...props },
  ref
) {
  const { bg, text, Icon } = ALERT_STYLES[type];

  return (
    <div
      ref={ref}
      className={cn('flex w-full items-start gap-4 rounded-xl p-6', bg, text, className)}
      {...props}
    >
      <Icon className="size-6 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="w-full text-base font-bold">{title}</p>}
        {description && <p className="w-full text-sm">{description}</p>}
        {children}
      </div>
    </div>
  );
});

export { Alert };
