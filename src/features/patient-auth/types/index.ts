import type * as React from 'react';

export interface OtpInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean | string;
  /** Fired once the error shake animation finishes and the input has reset itself — lets the parent clear its own error state in sync with the visual reset. */
  onErrorTimeout?: () => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  name?: string;
}

export interface LoginFormProps {
  className?: string;
}

export interface TestimonialCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  points: string[];
  className?: string;
}

export interface GdprCardProps {
  icon: React.ReactNode;
  title: string;
  paragraphs: string[];
  backgroundColor?: string | null;
  className?: string;
}

/**
 * Renders a carousel slide whose content is a video rather than an icon/title/paragraphs
 * card. `onboarding`/`gdpr-consent` steps carry a bare `media: string | null` URL with no
 * format metadata — confirmed against the live API (`GET /onboarding`) to be a direct,
 * publicly reachable `.mp4` file (e.g. `.../videos/onboarding/intro_app.MP4`), so a plain
 * `<video>` element is sufficient; no player library needed.
 */
export interface MediaCardProps {
  src: string;
  /** This slide's position in the parent carousel — compared against `selectedIndex` (from `useCarousel`) so only the in-view slide's video plays/has sound. */
  index: number;
  className?: string;
}

export interface BookingStepsCardProps {
  title: string;
  /** Ordered steps — the first one is highlighted (filled badge) since it's the screen that comes next. */
  steps: string[];
  className?: string;
}
