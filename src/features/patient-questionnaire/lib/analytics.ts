/**
 * `crypto.randomUUID()` needs a secure context (HTTPS or `localhost`) — same caveat already
 * documented in `patient-documents.tsx`'s `generateDocumentId`. Falls back to a non-crypto id
 * so tracking still works (with a less collision-resistant id) when testing over plain
 * `http://<lan-ip>` on a phone.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Every `/diagnostic/*` screen calls this with whatever `questionnaireId` it received via
 * route state. Reusing the existing id (when the patient is mid-attempt, including navigating
 * backward — `navigate(-1)` preserves the previous entry's `state`) keeps every
 * `*_PRE_RDV_*` event for one attempt tied together; a missing id (first visit to `intro`, or
 * a direct/reloaded hit with no state) starts a new attempt.
 */
export function getOrCreateQuestionnaireId(existing?: string): string {
  return existing ?? generateId();
}
