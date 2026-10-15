import { useId } from 'react';
import type * as React from 'react';

/**
 * "Stop dictation" icon — Figma node 6678:22186 ("step 2 / rec in progress"), the mic button's
 * icon while `PatientStory`'s dictation is active. Figma's exported asset for this glyph
 * couldn't be downloaded (figma.com asset URLs are proxy-blocked in this sandbox, both from the
 * cloud container and the local device shell — see `project_luna_sandbox_limits.md`), so this is
 * a hand-authored reproduction from the design screenshot rather than the literal vector data:
 * a plain filled circle with a small rounded square cut out of its center (classic "stop"
 * glyph). Follows `CheckCircleIcon`'s existing mask pattern in this codebase (single
 * `currentColor` circle, shape masked out rather than hardcoded white) so it recolors correctly
 * wherever it's used, instead of assuming a white background.
 */
export function StopCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <rect x="8" y="8" width="8" height="8" rx="2" fill="black" />
      </mask>
      <circle cx="12" cy="12" r="10" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
