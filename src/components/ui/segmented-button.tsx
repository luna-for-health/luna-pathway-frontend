import { cn } from '@/lib/utils';
import type { SegmentedButtonProps, SegmentedItemProps } from '@/types';

function SegmentedButton({ className, children, ...props }: SegmentedButtonProps) {
  return (
    <div role="tablist" className={cn('inline-flex items-center gap-1', className)} {...props}>
      {children}
    </div>
  );
}

function SegmentedItem({ label, count, active = false, className, ...props }: SegmentedItemProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        'flex h-8 shrink-0 items-center gap-1 rounded-full px-6 text-sm whitespace-nowrap transition-colors',
        active
          ? 'bg-button-segmented-background-selected text-button-segmented-text-selected font-medium'
          : 'bg-button-segmented-background text-button-segmented-text font-normal',
        className
      )}
      {...props}
    >
      {label}
      {typeof count === 'number' && ` (${count})`}
    </button>
  );
}

export { SegmentedButton, SegmentedItem };
