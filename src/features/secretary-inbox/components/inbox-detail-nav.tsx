import { InboxDetailNavItem } from '@/features/secretary-inbox/components/inbox-detail-nav-item';
import { groupRequestsByDate } from '@/features/secretary-inbox/lib/group-requests-by-date';
import type { InboxRequest } from '@/features/secretary-inbox/types';

interface InboxDetailNavProps {
  requests: InboxRequest[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

/**
 * Figma node 7568:776 ("inbox-list", Luna-App file) — the narrow, date-grouped
 * list shown beside the detail panel once a "Rappel" or "Traitée" request is
 * opened. Unlike the "Nouveau" list it carries no search field.
 */
export function InboxDetailNav({ requests, selectedId, onSelect }: InboxDetailNavProps) {
  const groups = groupRequestsByDate(requests);

  return (
    <div className="border-neutral-10 flex h-full w-65 shrink-0 flex-col items-start overflow-y-auto border-r">
      {groups.map(group => (
        <div key={group.date} className="flex w-full flex-col items-start">
          <div className="bg-neutral-05 border-neutral-10 flex w-full flex-col items-start gap-0.5 border-b px-4 pt-4 pb-2">
            <span className="text-body-tertiary text-xs font-medium">{group.date}</span>
          </div>
          <div className="flex w-full flex-col items-start gap-0.5 p-1">
            {group.requests.map(request => (
              <InboxDetailNavItem
                key={request.id}
                request={request}
                active={request.id === selectedId}
                onClick={() => onSelect(request.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
