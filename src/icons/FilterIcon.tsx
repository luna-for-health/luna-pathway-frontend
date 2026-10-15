import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function FilterIcon(props: IconProps) {
  const { color, size } = useIcon(props);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 6h16M7.5 12h9M11 18h2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
