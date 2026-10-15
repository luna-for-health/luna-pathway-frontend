import { useId } from 'react';

import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function CloseCircleIcon(props: IconProps) {
  const { fillColor, size } = useIcon(props);
  const maskId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id={maskId}>
        <rect width="16" height="16" fill="white" />
        <path
          d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5"
          stroke="black"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </mask>
      <circle cx="8" cy="8" r="8" fill={fillColor} mask={`url(#${maskId})`} />
    </svg>
  );
}
