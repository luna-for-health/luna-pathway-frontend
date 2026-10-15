import { useId } from 'react';
import type * as React from 'react';

export function DangerCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <rect x="11" y="6" width="2" height="8" rx="1" fill="black" />
        <circle cx="12" cy="17" r="1.25" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="10" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
