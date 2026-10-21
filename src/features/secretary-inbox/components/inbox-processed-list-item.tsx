import { Badge } from '@/components/ui';
import { InboxStatusIcon } from '@/features/secretary-inbox/components/inbox-status-icon';
import { getInboxStatusIconClassName } from '@/features/secretary-inbox/lib/inbox-status';
import {
  getInboxProcessReasonBadgeColor,
  getInboxProcessReasonBadgeLabel,
} from '@/features/secretary-inbox/lib/process-reasons';
import type { InboxRequest } from '@/features/secretary-inbox/types';
import { cn } from '@/lib/utils';

interface InboxProcessedListItemProps {
  request: InboxRequest;
  hasDivider?: boolean;
  onClick?: () => void;
}

/**
 * Figma node 7504:7581 ("inbox-list-item-lg", Luna-App file) — a row in the
 * flat, date-grouped processed-requests list. Two variants: a request closed
 * via "RDV validé" shows a green check ("checked", no badge); a request
 * closed via the reason modal shows a gray archive icon plus the reason as a
 * colored badge ("archived"). Clicking the row opens its detail view.
 */
export function InboxProcessedListItem({
  request,
  hasDivider = true,
  onClick,
}: InboxProcessedListItemProps) {
  const [, time] = request.receivedAt.split(' - ');
  const reason = request.processReason;

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
          <InboxStatusIcon
            request={request}
            className={cn('size-6 shrink-0', getInboxStatusIconClassName(request))}
          />
          <span className="text-body-primary truncate text-sm font-medium">
            {request.patientName}
          </span>
        </div>
        {reason && (
          <Badge
            label={getInboxProcessReasonBadgeLabel(reason)}
            color={getInboxProcessReasonBadgeColor(reason)}
            size="md"
          />
        )}
        <span className="text-body-tertiary shrink-0 text-sm">{time}</span>
      </button>
    </div>
  );
}
