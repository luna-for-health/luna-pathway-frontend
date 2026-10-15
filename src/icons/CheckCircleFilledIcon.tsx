import type * as React from 'react';

/**
 * Solid checkmark-in-circle used for a validated ("RDV validé") entry in the
 * processed-requests list (Figma "calendar-ok" glyph, node 7508:7832 — a filled
 * circle with a white checkmark). Uses `currentColor` for the circle fill so it
 * can be tinted via a text-color className (e.g. `text-badge-success-text`),
 * unlike `CheckCircleIcon` which hardcodes the DS's purple.
 */
export function CheckCircleFilledIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
