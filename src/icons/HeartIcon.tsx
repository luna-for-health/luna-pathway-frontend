import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function HeartIcon(props: IconProps) {
  const { fillColor, size } = useIcon(props);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M19.268 8.32848C14.5035 4.23024 7.31839 4.7736 3.22431 9.54144C-0.864649 14.3035 -0.322089 21.4779 4.43631 25.5712L23.8208 42.2453L23.9729 42.4224L23.9998 42.3992L24.0267 42.4224L24.1789 42.2453L43.5635 25.571C48.3221 21.4779 48.8645 14.3035 44.7755 9.54144C40.6814 4.77344 33.4963 4.23024 28.7318 8.32848L24 12.3989L19.268 8.32848Z"
        fill={fillColor}
      />
    </svg>
  );
}
