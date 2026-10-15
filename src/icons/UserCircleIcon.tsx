import useIcon from '@/hooks/useIcon';
import type { IconProps } from '@/types';

export function UserCircleIcon(props: IconProps) {
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
        d="M12 21C17.76 21 21 17.76 21 12C21 6.24 17.76 3 12 3C6.24 3 3 6.24 3 12C3 17.76 6.24 21 12 21ZM16.6756 17.8227C16.3483 17.2128 15.9023 16.6684 15.3585 16.2241C14.4107 15.4493 13.2242 15.0261 12.0001 15.0261C10.776 15.0261 9.58949 15.4493 8.64169 16.2241C8.09796 16.6684 7.65197 17.2128 7.32453 17.8227C8.39475 18.592 9.91672 19.0714 12.0001 19.0714C14.0835 19.0714 15.6055 18.592 16.6756 17.8227ZM15.028 9.77416C15.028 11.7126 13.9376 12.803 11.9991 12.803C10.0607 12.803 8.97028 11.7126 8.97028 9.77416C8.97028 7.8357 10.0607 6.74531 11.9991 6.74531C13.9376 6.74531 15.028 7.8357 15.028 9.77416Z"
        fill={fillColor}
      />
    </svg>
  );
}
