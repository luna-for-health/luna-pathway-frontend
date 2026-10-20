import type { InboxRequest } from '@/features/secretary/types';
import { ClockFastForwardIcon } from '@/icons';
import { cn } from '@/lib/utils';

interface InboxReminderListItemProps {
  request: InboxRequest;
  hasDivider?: boolean;
  onClick?: () => void;
}

/**
 * Figma node 7578:2691 ("inbox-list-item-lg", variant "recall", Luna-App file) —
 * a row of the flat "Rappel" list: clock icon + patient name on the left, the
 * full reception date on the right. No badge and no date grouping, unlike the
 * processed list. Clicking a row opens its detail view (node 7568:622).
 */
export function InboxReminderListItem({
  request,
  hasDivider = true,
  onClick,
}: InboxReminderListItemProps) {
  return (
    <div
      className={cn('flex w-full flex-col items-start', hasDivider && 'border-neutral-10 border-b')}
    >
      <button
        type="button"
        onClick={onClick}
        className="hover:bg-neutral-05 flex w-full items-center gap-3 rounded-sm px-2 py-3 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ClockFastForwardIcon className="text-body-tertiary size-6 shrink-0" />
          <span className="text-body-primary truncate text-sm font-medium">
            {request.patientName}
          </span>
        </div>
        <span className="text-body-tertiary shrink-0 text-sm">{request.receivedAt}</span>
      </button>
    </div>
  );
}
