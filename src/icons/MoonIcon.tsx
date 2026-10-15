import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function MoonIcon(props: IconProps) {
  const { fillColor, size } = useIcon(props);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M12.2026 1.96411C15.7358 2.93027 18.3335 6.16059 18.3335 10.0002C18.3333 14.6024 14.6026 18.3331 10.0005 18.3333C6.16082 18.3333 2.9305 15.7356 1.96436 12.2024C2.6661 12.3943 3.4039 12.5002 4.1665 12.5002C8.76888 12.5002 12.5005 8.76863 12.5005 4.16626C12.5005 3.40367 12.3945 2.66584 12.2026 1.96411Z"
        fill={fillColor}
      />
    </svg>
  );
}
