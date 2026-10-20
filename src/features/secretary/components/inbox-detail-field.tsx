import type { InboxDetailFieldProps } from '@/features/secretary/types';

export function InboxDetailField({ label, value }: InboxDetailFieldProps) {
  return (
    <div className="border-neutral-20 flex w-full flex-col items-start gap-4 border-b py-8">
      <p className="text-body-primary text-base font-medium">{label}</p>
      <p className="text-body-secondary text-sm">{value}</p>
    </div>
  );
}
