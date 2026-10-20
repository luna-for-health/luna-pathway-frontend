import type { BadgeColor } from '@/types';

export type InboxProcessReason =
  'not-interested' | 'wrong-phone' | 'call-back-later' | 'seen-elsewhere' | 'other';

export interface InboxProcessReasonOption {
  value: InboxProcessReason;
  label: string;
  /** Shorter copy for the reason badge on the processed-requests list (node 7508:7906). */
  badgeLabel: string;
  /**
   * Badge color per reason (Figma node 7504:7247): contact failures are
   * `warning` (orange), dismissals are `neutral` (gray).
   */
  badgeColor: BadgeColor;
}

/**
 * Reasons offered in the "Marquer comme traitée" modal (Figma node 7481:5018,
 * Select field "Choisir une raison"). No backend enum exists yet for this field.
 */
export const INBOX_PROCESS_REASONS: InboxProcessReasonOption[] = [
  {
    value: 'not-interested',
    label: 'La patiente n’est plus intéressée',
    badgeLabel: 'Plus intéressée',
    badgeColor: 'neutral',
  },
  {
    value: 'wrong-phone',
    label: 'Mauvais numéro de téléphone',
    badgeLabel: 'Mauvais numéro',
    badgeColor: 'warning',
  },
  {
    value: 'call-back-later',
    label: 'La patiente rappellera plus tard',
    badgeLabel: 'Rappellera plus tard',
    badgeColor: 'warning',
  },
  {
    value: 'seen-elsewhere',
    label: 'Elle a eu quelqu’un d’autre entre-temps',
    badgeLabel: 'Vue ailleurs',
    badgeColor: 'neutral',
  },
  { value: 'other', label: 'Autre', badgeLabel: 'Autre', badgeColor: 'neutral' },
];

/** Narrows the API's free-form `statusReason` to a reason the inbox knows how to label. */
export function toInboxProcessReason(
  value: string | null | undefined
): InboxProcessReason | undefined {
  return INBOX_PROCESS_REASONS.find(option => option.value === value)?.value;
}

export function getInboxProcessReasonBadgeLabel(reason: InboxProcessReason): string {
  return INBOX_PROCESS_REASONS.find(option => option.value === reason)?.badgeLabel ?? reason;
}

export function getInboxProcessReasonBadgeColor(reason: InboxProcessReason): BadgeColor {
  return INBOX_PROCESS_REASONS.find(option => option.value === reason)?.badgeColor ?? 'neutral';
}
