import { InboxReminderListItem } from '@/features/secretary-inbox/components/inbox-reminder-list-item';
import type { InboxRequest } from '@/features/secretary-inbox/types';

interface InboxReminderListProps {
  requests: InboxRequest[];
  onSelect: (id: string) => void;
}

/**
 * Figma node 7578:2715 ("inbox / view recall", Luna-App file) — the "Rappel"
 * tab replaces the usual list + detail master-detail layout with a flat,
 * full-width list of the requests put aside for a callback.
 */
export function InboxReminderList({ requests, onSelect }: InboxReminderListProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-start overflow-y-auto p-1">
      {requests.map((request, index) => (
        <InboxReminderListItem
          key={request.id}
          request={request}
          hasDivider={index < requests.length - 1}
          onClick={() => onSelect(request.id)}
        />
      ))}
    </div>
  );
}
