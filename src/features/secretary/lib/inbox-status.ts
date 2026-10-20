import type { InboxRequest } from '@/features/secretary/types';

/** Closed through "Traitée" — by the API's `treated` status or a local reason pick. */
export function isInboxRequestTreated(request: InboxRequest): boolean {
  return request.outcome === 'treated' || Boolean(request.processReason);
}

/** When the request left the "Nouveau" tab, falling back to its reception date. */
export function getInboxStatusTimestamp(request: InboxRequest): string {
  return request.processedAt ?? request.receivedAt;
}

/**
 * The status line shown under "Demande reçue le …" on the read-only detail
 * panel (Figma node 7568:622), and the wording shared with the detail nav.
 */
export function getInboxStatusLabel(request: InboxRequest): string {
  const at = getInboxStatusTimestamp(request);
  if (request.status === 'reminder') return `Mise en rappel le ${at}`;
  return isInboxRequestTreated(request) ? `Traité le ${at}` : `RDV validé le ${at}`;
}

/** Green for a validated appointment, muted for a callback or an archived request. */
export function getInboxStatusIconClassName(request: InboxRequest): string {
  return request.status === 'processed' && !isInboxRequestTreated(request)
    ? 'text-badge-success-text'
    : 'text-body-tertiary';
}
