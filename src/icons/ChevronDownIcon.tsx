import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function ChevronDownIcon(props: IconProps) {
  const { size, fillColor } = useIcon(props);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 6L8 10.5L12.5 6"
        stroke={fillColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
