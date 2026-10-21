import * as React from 'react';

import { SearchBar } from '@/components/ui';
import { InboxListItem } from '@/features/secretary-inbox/components/inbox-list-item';
import {
  SEARCH_TRACKING_DEBOUNCE_MS,
  SEARCH_TRACKING_MIN_LENGTH,
} from '@/features/secretary-inbox/lib/analytics';
import { normalizeSearchText } from '@/features/secretary-inbox/lib/normalize-search-text';
import type { InboxListProps } from '@/features/secretary-inbox/types';
import { AnalyticsEvent, analytics } from '@/services';

export function InboxList({
  requests,
  selectedId,
  onSelect,
  searchValue,
  onSearchChange,
}: InboxListProps) {
  // Filters from the first typed letter, ignoring case and accents.
  const query = normalizeSearchText(searchValue);
  const filteredRequests = query
    ? requests.filter(request => normalizeSearchText(request.patientName).includes(query))
    : requests;
  const hasResults = filteredRequests.length > 0;

  // SEARCH_SECRETARY_INBOX — once the secretary pauses on a query of 3+ characters. Only
  // `has_results` is sent, never the query (it's a patient name). Read through an effect event
  // so a poll refresh changing the matches doesn't count as a new search.
  const trackSearch = React.useEffectEvent(() => {
    analytics.track(AnalyticsEvent.SearchSecretaryInbox, { has_results: hasResults });
  });

  React.useEffect(() => {
    if (query.length < SEARCH_TRACKING_MIN_LENGTH) return;
    const timeout = setTimeout(trackSearch, SEARCH_TRACKING_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="border-neutral-10 flex h-full w-65 shrink-0 flex-col gap-3 border-r p-1">
      <SearchBar
        value={searchValue}
        onChange={event => onSearchChange(event.target.value)}
        className="bg-search-background h-10 gap-3 rounded-lg pr-3 pl-3"
      />
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        {filteredRequests.map(request => (
          <InboxListItem
            key={request.id}
            patientName={request.patientName}
            receivedAt={request.receivedAt}
            active={request.id === selectedId}
            onClick={() => onSelect(request.id)}
          />
        ))}
      </div>
    </div>
  );
}
