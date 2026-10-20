import type { InboxRequest } from '@/features/secretary/types';

export interface InboxDateGroup {
  date: string;
  requests: InboxRequest[];
}

/**
 * Splits requests into the date buckets both processed views render as a
 * sticky-looking group header ("1 septembre 2026"). The day is the leading half
 * of `receivedAt` ("1 septembre 2026 - 12:32").
 */
export function groupRequestsByDate(requests: InboxRequest[]): InboxDateGroup[] {
  const groups = new Map<string, InboxRequest[]>();
  for (const request of requests) {
    const [date] = request.receivedAt.split(' - ');
    const existing = groups.get(date);
    if (existing) {
      existing.push(request);
    } else {
      groups.set(date, [request]);
    }
  }
  return Array.from(groups, ([date, groupRequests]) => ({ date, requests: groupRequests }));
}
