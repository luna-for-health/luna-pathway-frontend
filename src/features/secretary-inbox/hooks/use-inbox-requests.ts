import { useQueries, useQueryClient } from '@tanstack/react-query';

import { getConsultationRequests } from '@/features/secretary-inbox/api';
import type { ConsultationRequestStatus } from '@/features/secretary-inbox/api';
import { mapConsultationRequest } from '@/features/secretary-inbox/lib/map-consultation-request';
import type { InboxRequest, InboxRequestStatus } from '@/features/secretary-inbox/types';

import type { UseQueryResult } from '@tanstack/react-query';

/** How often the "new" list re-fetches while the inbox tab is visible. */
const NEW_REQUESTS_POLL_MS = 15_000;

const QUERY_KEY_PREFIX = ['secretary', 'consultation-requests'] as const;

/** One API call per status filter, tagged with the tab it feeds. */
const TAB_QUERIES: { tab: InboxRequestStatus; status: ConsultationRequestStatus }[] = [
  { tab: 'new', status: 'new' },
  { tab: 'reminder', status: 'reminder' },
  { tab: 'processed', status: 'validated' },
  { tab: 'processed', status: 'treated' },
];

interface InboxRequestsResult {
  data: InboxRequest[];
  isPending: boolean;
}

/** Merges the per-status query results into one flat list for the inbox. */
function combineInboxResults(results: UseQueryResult<InboxRequest[]>[]): InboxRequestsResult {
  return {
    data: results.flatMap(result => result.data ?? []),
    isPending: results.some(result => result.isPending),
  };
}

export function useInboxRequests() {
  const queryClient = useQueryClient();

  /** Re-fetches the lists behind one tab — called when the secretary clicks that tab. */
  const refetchTab = (tab: InboxRequestStatus) =>
    Promise.all(
      TAB_QUERIES.filter(query => query.tab === tab).map(({ status }) =>
        queryClient.refetchQueries({ queryKey: [...QUERY_KEY_PREFIX, status] })
      )
    );

  const inbox = useQueries({
    queries: TAB_QUERIES.map(({ tab, status }) => ({
      queryKey: [...QUERY_KEY_PREFIX, status],
      queryFn: async () => {
        const response = await getConsultationRequests({ status });
        return response.data.map(resource => mapConsultationRequest(resource, tab));
      },
      // New requests show up without a page reload: poll only the "new" list (paused while the
      // browser tab is hidden) and refresh when the secretary comes back to the browser tab.
      // The other lists refresh when their inbox tab is clicked (see `refetchTab`).
      refetchInterval: status === 'new' ? NEW_REQUESTS_POLL_MS : undefined,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
    })),
    combine: combineInboxResults,
  });

  return { ...inbox, refetchTab };
}
