import { isInboxRequestTreated } from '@/features/secretary-inbox/lib/inbox-status';
import type { InboxRequest } from '@/features/secretary-inbox/types';
import { CalendarCheckIcon, ClockFastForwardIcon, ProcessedIcon } from '@/icons';

interface InboxStatusIconProps {
  request: InboxRequest;
  className?: string;
}

/**
 * The glyph that tells how a request left the "Nouveau" tab: a clock for one
 * put aside for a callback, an archive box for one closed through the reason
 * modal, a calendar-ok for a validated appointment. Color comes from the caller.
 */
export function InboxStatusIcon({ request, className }: InboxStatusIconProps) {
  if (request.status === 'reminder') return <ClockFastForwardIcon className={className} />;
  if (isInboxRequestTreated(request)) return <ProcessedIcon className={className} />;
  return <CalendarCheckIcon className={className} />;
}
