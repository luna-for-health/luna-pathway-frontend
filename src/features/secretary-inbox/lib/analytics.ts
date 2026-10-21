import type { InboxRequest, InboxRequestStatus } from '@/features/secretary-inbox/types';
import type { InboxRequestTrackingProperties, InboxTabName } from '@/services';

/** Minimum typed characters before a search counts as "launched" (tracking plan). */
export const SEARCH_TRACKING_MIN_LENGTH = 3;

/** Waits for the secretary to stop typing so one search fires one event, not one per key. */
export const SEARCH_TRACKING_DEBOUNCE_MS = 600;

const TAB_TRACKING_NAME: Record<InboxRequestStatus, InboxTabName> = {
  new: 'new',
  reminder: 'callback',
  processed: 'processed',
};

/** The app's tab value → the tracking plan's `tab_name` / `source_tab` enum. */
export function toInboxTabName(status: InboxRequestStatus): InboxTabName {
  return TAB_TRACKING_NAME[status];
}

/** The `request_id` / `request_status` / `source_tab` props shared by request-linked events. */
export function getRequestTrackingProperties(
  request: InboxRequest
): InboxRequestTrackingProperties {
  const tabName = toInboxTabName(request.status);
  return { request_id: request.id, request_status: tabName, source_tab: tabName };
}
