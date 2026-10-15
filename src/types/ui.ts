import type * as React from 'react';

import type { buttonVariants } from '@/components/ui/button';

import type { VariantProps } from 'class-variance-authority';

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * Luna DS "Link" (node 12163:4884). Renders as a native `<a>` since it's meant to
 * navigate — pass `href`. `icon` defaults to a `ChevronRightIcon`, matching Figma's
 * demo (which shows chevrons by default on both sides); override or set
 * `iconPosition="none"` to remove.
 */
export interface LinkProps extends Omit<React.ComponentProps<'a'>, 'color'> {
  label: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'both' | 'none';
}

export interface LoaderProps extends React.ComponentProps<'div'> {
  color?: string;
  /** Ring thickness as a percentage of the radius that stays hollow (0-100). Higher = thinner ring. Defaults to 78. */
  thickness?: number;
  variant?: 'arc' | 'spokes';
}

export interface ChipProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  label: string;
  onRemove?: () => void;
}

export interface FilterChipProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  /** Omit to render the icon-only trigger. */
  label?: string;
  state?: 'enabled' | 'activated';
  /** Shown as a badge when `state="activated"`. */
  count?: number;
}

export type BadgeColor =
  'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'neutral';

export interface BadgeProps extends React.ComponentProps<'div'> {
  label: string;
  color?: BadgeColor;
  size?: 'sm' | 'md';
  hasDot?: boolean;
  /** Only rendered when `size="md"`. */
  icon?: React.ReactNode;
}

export interface BadgeNotificationProps extends React.ComponentProps<'div'> {
  color?: 'pink' | 'wireframe';
  count?: number | string;
}
