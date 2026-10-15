import * as React from 'react';

import { cn } from '@/lib/utils';
import type { LoadingOverlayProps } from '@/types';

import { Loader } from './loader';

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay({ visible = true, className, ...props }, ref) {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="loading-overlay"
        className={cn(
          'bg-neutral-white/60 absolute inset-0 z-10 flex items-center justify-center rounded-[inherit]',
          className
        )}
        {...props}
      >
        <Loader className="size-8" thickness={87} />
      </div>
    );
  }
);

export { LoadingOverlay };
