import { InboxStatusIcon } from '@/features/secretary/components/inbox-status-icon';
import { getInboxStatusTimestamp } from '@/features/secretary/lib/inbox-status';
import type { InboxRequest } from '@/features/secretary/types';
import { cn } from '@/lib/utils';

interface InboxDetailNavItemProps {
  request: InboxRequest;
  active?: boolean;
  onClick?: () => void;
}

/**
 * Figma node 7568:779 ("inbox-list-item", Luna-App file) — an entry of the
 * narrow list that sits next to the read-only detail panel of the "Rappel" and
 * "Traitée" tabs. Same shape as `InboxListItem` plus a status icon; the accent
 * color marks the selection, not the status (the glyph does that).
 */
export function InboxDetailNavItem({ request, active = false, onClick }: InboxDetailNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={cn(
        'flex w-full flex-col items-start gap-1 rounded-md p-3 text-left',
        active ? 'bg-primary-05' : 'hover:bg-neutral-05 bg-white'
      )}
    >
      <span
        className={cn('text-sm font-medium', active ? 'text-body-accent' : 'text-body-primary')}
      >
        {request.patientName}
      </span>
      <span
        className={cn(
          'flex items-center gap-1',
          active ? 'text-body-accent' : 'text-body-tertiary'
        )}
      >
        <InboxStatusIcon request={request} className="size-4 shrink-0" />
        <span className="text-xs font-medium">{getInboxStatusTimestamp(request)}</span>
      </span>
    </button>
  );
}
