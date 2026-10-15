import type * as React from 'react';

export type WebHeaderProps = React.ComponentProps<'header'> & {
  /** Shows a back icon button on the left, mobile only (`lg:hidden`) — desktop headers never show one. */
  onBack?: () => void;
  /**
   * Shows a hamburger menu-toggle icon button on the left, mobile only (`lg:hidden`).
   * Ignored when `onBack` is also passed — a screen only ever needs one of the two.
   */
  onMenuToggle?: () => void;
  /**
   * Renders centered between the logo and a matching-width spacer, desktop only
   * (`lg:flex`) — e.g. a "Étape 1/3" step indicator (Figma node 7245:11388's "slot").
   * No mobile equivalent has been designed yet, so this is hidden below `lg`.
   */
  centerContent?: React.ReactNode;
};
