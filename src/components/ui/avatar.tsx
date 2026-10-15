import * as React from 'react';

import { cn } from '@/lib/utils';
import type { AvatarProps } from '@/types';

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { className, src, alt = '', name = 'A', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full',
        !src && 'bg-avatar-background',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <span className="text-avatar-text text-xs font-medium">{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
});

export { Avatar };
