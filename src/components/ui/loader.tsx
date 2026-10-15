import * as React from 'react';

import { cn } from '@/lib/utils';
import type { LoaderProps } from '@/types';

const SPOKES_PATH =
  'M12.9636 3.9638C12.9636 3.43124 12.5319 2.99951 11.9994 2.99951C11.4668 2.99951 11.0351 3.43124 11.0351 3.9638V5.81904C11.0351 6.3516 11.4668 6.78333 11.9994 6.78333C12.5319 6.78333 12.9636 6.3516 12.9636 5.81904V3.9638ZM6.99407 5.63052C6.6175 5.25393 6.00695 5.25393 5.63036 5.63051C5.25379 6.00708 5.25378 6.61763 5.63035 6.99421L6.94137 8.30524C7.31795 8.68183 7.9285 8.68183 8.30507 8.30525C8.68166 7.92868 8.68166 7.31813 8.30509 6.94155L6.99407 5.63052ZM3.96331 11.0359C3.43075 11.0359 2.99902 11.4676 2.99902 12.0001C2.99902 12.5327 3.43075 12.9644 3.96331 12.9644H5.81853C6.35108 12.9644 6.78281 12.5327 6.78281 12.0001C6.78281 11.4676 6.35108 11.0359 5.81853 11.0359H3.96331ZM8.30507 15.6946C8.68166 16.0712 8.68166 16.6817 8.30509 17.0583L6.99407 18.3693C6.6175 18.7459 6.00695 18.7459 5.63036 18.3693C5.25379 17.9927 5.25378 17.3823 5.63035 17.0057L6.94137 15.6946C7.31795 15.318 7.9285 15.318 8.30507 15.6946ZM18.181 11.0359C17.6484 11.0359 17.2167 11.4676 17.2167 12.0001C17.2167 12.5327 17.6484 12.9644 18.181 12.9644H20.0363C20.5688 12.9644 21.0006 12.5327 21.0006 12.0001C21.0006 11.4676 20.5688 11.0359 20.0363 11.0359H18.181ZM15.6943 15.6946C16.0709 15.318 16.6815 15.318 17.058 15.6946L18.3691 17.0057C18.7457 17.3823 18.7457 17.9927 18.3691 18.3693C17.9925 18.7459 17.3819 18.7459 17.0053 18.3693L15.6943 17.0583C15.3177 16.6817 15.3177 16.0712 15.6943 15.6946ZM12.9636 18.1813C12.9636 17.6488 12.5319 17.2171 11.9994 17.2171C11.4668 17.2171 11.0351 17.6488 11.0351 18.1813V20.0366C11.0351 20.5692 11.4668 21.0009 11.9994 21.0009C12.5319 21.0009 12.9636 20.5692 12.9636 20.0366V18.1813ZM18.3691 5.63051C18.7457 6.00708 18.7457 6.61763 18.3691 6.99421L17.058 8.30524C16.6815 8.68183 16.0709 8.68183 15.6943 8.30525C15.3177 7.92868 15.3177 7.31813 15.6943 6.94155L17.0053 5.63052C17.3819 5.25393 17.9925 5.25393 18.3691 5.63051Z';

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  { className, color, thickness = 78, variant = 'arc', style, ...props },
  ref
) {
  const hollow = `${thickness}%`;

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Chargement"
      data-slot="loader"
      className={cn('relative size-16 shrink-0 animate-spin', className)}
      style={{ ...style, ['--loader-color' as string]: color ?? 'var(--color-heading-primary)' }}
      {...props}
    >
      {variant === 'spokes' ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <path fillRule="evenodd" clipRule="evenodd" d={SPOKES_PATH} fill="var(--loader-color)" />
        </svg>
      ) : (
        <>
          <div
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_225deg,transparent_0deg,var(--loader-color)_225deg,transparent_225deg)]"
            style={{
              maskImage: `radial-gradient(closest-side, transparent ${hollow}, #000 ${hollow})`,
              WebkitMaskImage: `radial-gradient(closest-side, transparent ${hollow}, #000 ${hollow})`,
            }}
          />
          <span className="absolute top-[47%] left-[95%] size-[11%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--loader-color)" />
        </>
      )}
    </div>
  );
});

export { Loader };
