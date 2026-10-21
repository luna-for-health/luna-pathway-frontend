import { WebHeader } from '@/components/layout';

import { Confirmation } from '../components';

/**
 * No `onBack` here — Figma's header for this node (7380:5187, "conclusion") has no back arrow,
 * unlike every other `/diagnostic/*` screen. See `Confirmation`'s doc comment for why.
 *
 * `min-h-dvh`, not `min-h-screen` (2026-09-09 fix) — this is the one `/diagnostic/*` screen
 * whose content is genuinely vertically centered on the page (every other screen is
 * top-aligned with a fixed-bottom CTA, so this never mattered there — see
 * feedback_header_content_spacing.md). `min-h-screen` is `100vh`, a static value mobile
 * Chrome/Safari compute against the viewport WITHOUT the address bar, i.e. taller than what's
 * actually visible on load; centering `Confirmation`'s content inside that oversized box then
 * pushed it below the fold of the real (shorter, address-bar-visible) viewport — user-reported
 * as "content isn't vertically centered" on a real Android phone. `min-h-dvh` (`100dvh`, dynamic
 * viewport height — supported out of the box in this project's Tailwind v4, no config needed)
 * tracks the actual visible viewport instead, including as the address bar shows/hides.
 */
export default function ConfirmationScreen() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <WebHeader />
      <Confirmation />
    </div>
  );
}
