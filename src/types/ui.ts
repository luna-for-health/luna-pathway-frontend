import type * as React from 'react';

import type { buttonVariants } from '@/components/ui/button';

import type { VariantProps } from 'class-variance-authority';

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string;
  icon?: React.ReactNode;
  error?: boolean | string;
  type?: React.HTMLInputTypeAttribute;
}

/**
 * Luna DS "Form/Textarea" primitive (node 12232:3792, DS file) — just the multiline
 * field itself. `children` renders in the same rounded container below the field
 * (Figma's own "slot" region), for callers that need to attach actions like
 * `SymptomComposer`'s mic/skip/submit row — not baked into this shared component,
 * since the DS's base Textarea has no such row itself.
 */
export interface TextareaProps extends React.ComponentProps<'textarea'> {
  error?: boolean | string;
}

/**
 * Luna DS "Form/Field" primitive (node 12232:3466, DS file) — generic label + helper
 * caption wrapper around a form control passed as `children`. Doesn't reimplement
 * Figma's per-variant switch (textfield/select/segmented/password); callers compose
 * it with `Textarea`, `Input`, etc.
 */
export interface FieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label?: string;
  /** Renders the mandatory dot next to the label. */
  required?: boolean;
  htmlFor?: string;
  /** Neutral caption shown below the field. Overridden by a string `error`. */
  helperText?: string;
  error?: boolean | string;
  children: React.ReactNode;
}

/**
 * Luna DS "SearchBar" (node 12224:693, DS file). Structurally close to `Input`
 * (same `h-14`/`rounded-lg`/`gap-3` field-box proportions) but with a fixed
 * leading search icon instead of a configurable one, and no label/error states.
 */
export type SearchBarProps = Omit<React.ComponentProps<'input'>, 'type'>;

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

/**
 * Luna DS "Radio" (node 12232:4303, DS file). The ring/dot are plain CSS (border +
 * inner circle), not a ported SVG — Figma's traced ring asset is proxy-blocked here
 * like every other icon in this doc, and a two-tone ring is trivial to build without
 * one. `--color-form-radio-border`/`-border-disabled` are therefore a visual estimate
 * from the screenshot (matching `Checkbox`'s analogous unchecked/disabled border
 * values), not a hex confirmed via `get_design_context` — flagged in COMPONENTS.md.
 */
export interface RadioProps extends Omit<React.ComponentProps<'input'>, 'type' | 'size'> {
  label?: React.ReactNode;
}

export type RadioGroupProps = React.ComponentProps<'div'>;

/**
 * Luna DS "Switch" (node 12232:3691, DS file). Figma renders the toggle itself as a
 * `<button>`, not a checkbox input — ported the same way, as `role="switch"` with
 * `aria-checked`, controlled/uncontrolled via `checked`/`onCheckedChange` (not a
 * native `onChange` event, since there's no underlying `<input>`).
 */
export interface SwitchProps extends Omit<React.ComponentProps<'button'>, 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

/**
 * Luna DS "Select" (node 12312:1153, DS file) — the field/trigger only, wrapping a
 * native `<select>` (same "wrap a native form control" approach as `Input`/
 * `Textarea`). Figma's custom option-list panel (avatar/badge-decorated rows, its
 * own open/close overlay) is **not** built here — deferred to the future "Dialog /
 * Sheet / Dropdown components" task, which owns shared overlay/portal logic.
 */
export interface SelectProps extends Omit<React.ComponentProps<'select'>, 'size'> {
  error?: boolean | string;
  placeholder?: string;
}

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type' | 'size'> {
  label?: React.ReactNode;
  indeterminate?: boolean;
}

export interface LoaderProps extends React.ComponentProps<'div'> {
  color?: string;
  /** Ring thickness as a percentage of the radius that stays hollow (0-100). Higher = thinner ring. Defaults to 78. */
  thickness?: number;
  variant?: 'arc' | 'spokes';
}

export interface AvatarProps extends React.ComponentProps<'div'> {
  /** Profile photo URL. Falls back to `name`'s initial when omitted. */
  src?: string;
  alt?: string;
  /** Used for the initials fallback (first character rendered). Defaults to "A". */
  name?: string;
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
