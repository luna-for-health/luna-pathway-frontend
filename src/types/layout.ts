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

export interface MainNavItemProps extends Omit<React.ComponentProps<'a'>, 'href' | 'children'> {
  to: string;
  label: string;
  /**
   * Receives whether this item's route is the active one, so icons whose color depends on
   * nav state (e.g. semantic `IconProps`/`useIcon`-based icons) can react to it. Icons that
   * inherit color via `currentColor` from the surrounding `text-mainnav-*` class can ignore
   * the argument.
   */
  icon: (isActive: boolean) => React.ReactNode;
  /** Full-width vertical layout for the mobile dropdown. Defaults to the desktop pill layout. */
  mobile?: boolean;
}

export type MainNavProps = React.ComponentProps<'div'>;
