import * as React from 'react';

import { cn } from '@/lib/utils';
import type { CardProps } from '@/types';

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, title, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'border-card-border bg-neutral-white flex w-full flex-col items-start gap-6 rounded-2xl border p-8',
        className
      )}
      {...props}
    >
      {title && <p className="text-body-primary w-full text-base font-medium">{title}</p>}
      {children}
    </div>
  );
});

export { Card };
