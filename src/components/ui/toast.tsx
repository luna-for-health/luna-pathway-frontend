import * as React from 'react';

import { CrossIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { ToastProps } from '@/types';

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { className, label, onClose, icon, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'border-card-border bg-neutral-white flex w-full max-w-[372px] items-center gap-2 rounded-2xl border p-4 drop-shadow-[0_0_12px_rgba(2,2,48,0.1)]',
        className
      )}
      {...props}
    >
      {icon && <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>}
      <p className="text-body-primary min-w-0 flex-1 text-sm">{label}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="bg-button-neutral-bg text-heading-primary flex h-8 w-12 shrink-0 items-center justify-center rounded-full"
        >
          <CrossIcon className="size-6" />
        </button>
      )}
    </div>
  );
});

export { Toast };
