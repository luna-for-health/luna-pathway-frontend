import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function HomeIcon(props: IconProps) {
  const { size, fillColor } = useIcon(props);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1107 3.34842C12.4418 2.88386 11.5581 2.88386 10.8892 3.34842C7.05247 6.01311 5.25993 8.08987 3.09637 11.6637C3.03187 11.7702 2.9985 11.8927 3.00005 12.0172L3.0686 17.5396C3.06887 17.5614 3.07021 17.5833 3.07262 17.6049C3.25019 19.2038 4.51052 20.4818 6.10135 20.6682C9.87605 21.1105 14.1239 21.1105 17.8986 20.6682C19.4894 20.4818 20.7498 19.2038 20.9273 17.6049C20.9297 17.5833 20.931 17.5614 20.9314 17.5396L21 12.0172C21.0014 11.8927 20.9681 11.7702 20.9036 11.6637C18.74 8.08987 16.9474 6.01311 13.1107 3.34842Z"
        fill={fillColor}
      />
    </svg>
  );
}
