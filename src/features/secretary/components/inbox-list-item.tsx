import type { InboxListItemProps } from '@/features/secretary/types';
import { cn } from '@/lib/utils';

export function InboxListItem({
  patientName,
  receivedAt,
  active = false,
  onClick,
}: InboxListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={cn(
        'flex w-full flex-col items-start gap-1 rounded-md p-3 text-left',
        active ? 'bg-neutral-05' : 'hover:bg-neutral-05 bg-white'
      )}
    >
      <span className="text-body-primary text-sm font-medium">{patientName}</span>
      <span className="text-body-tertiary text-xs font-medium">{receivedAt}</span>
    </button>
  );
}
