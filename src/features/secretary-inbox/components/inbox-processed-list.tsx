import { InboxProcessedListItem } from '@/features/secretary-inbox/components/inbox-processed-list-item';
import { groupRequestsByDate } from '@/features/secretary-inbox/lib/group-requests-by-date';
import type { InboxRequest } from '@/features/secretary-inbox/types';

interface InboxProcessedListProps {
  requests: InboxRequest[];
  onSelect: (id: string) => void;
}

/**
 * Figma node 7504:7247 ("inbox / view processed", Luna-App file) — the "Traitée"
 * tab replaces the usual list + detail master-detail layout with a flat,
 * full-width history grouped by the date the request was received. Clicking a
 * row opens the detail view (node 7568:622).
 */
export function InboxProcessedList({ requests, onSelect }: InboxProcessedListProps) {
  const groups = groupRequestsByDate(requests);

  return (
    <div className="flex w-full flex-1 flex-col items-start overflow-y-auto">
      {groups.map(group => (
        <div key={group.date} className="flex w-full flex-col items-start">
          <div className="bg-neutral-05 border-neutral-10 flex w-full items-center border-b px-4 pt-4 pb-2">
            <span className="text-body-tertiary text-sm font-medium">{group.date}</span>
          </div>
          <div className="flex w-full flex-col items-start p-1">
            {group.requests.map((request, index) => (
              <InboxProcessedListItem
                key={request.id}
                request={request}
                hasDivider={index < group.requests.length - 1}
                onClick={() => onSelect(request.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
