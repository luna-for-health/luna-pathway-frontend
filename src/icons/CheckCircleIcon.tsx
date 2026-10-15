import type * as React from 'react';

/**
 * Inherits its color from the parent's `text-*` class (`currentColor`) — every call site sets
 * one: summary rows / Alert success = green, Option / testimonial / inbox toast = purple.
 */
export function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.6235 4.6235C6.37209 2.8749 8.8971 2 12 2C15.1029 2 17.6279 2.8749 19.3766 4.6235C21.1251 6.37209 22 8.8971 22 12C22 15.1029 21.1251 17.6279 19.3766 19.3766C17.6279 21.1251 15.1029 22 12 22C8.8971 22 6.37209 21.1251 4.6235 19.3766C2.8749 17.6279 2 15.1029 2 12C2 8.8971 2.8749 6.37209 4.6235 4.6235ZM16.1713 9.08989C16.5366 8.75857 16.564 8.19391 16.2327 7.82869C15.9014 7.46346 15.3368 7.43596 14.9715 7.76727C13.7848 8.84384 12.8933 9.81137 12.1408 10.9859C11.5927 11.8413 11.1314 12.7863 10.6796 13.9317L9.06956 12.2713C8.72627 11.9173 8.16101 11.9086 7.80701 12.2519C7.45301 12.5952 7.44431 13.1604 7.78759 13.5144L10.385 16.193C10.6006 16.4154 10.9162 16.5101 11.2187 16.4433C11.5211 16.3764 11.7674 16.1575 11.8692 15.865C12.4695 14.1405 13.0025 12.9511 13.6443 11.9493C14.2827 10.953 15.0528 10.1045 16.1713 9.08989Z"
        fill="currentColor"
      />
    </svg>
  );
}
