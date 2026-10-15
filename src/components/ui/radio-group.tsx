import { cn } from '@/lib/utils';
import type { RadioGroupProps } from '@/types';

function RadioGroup({ className, children, ...props }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('flex flex-col gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export { RadioGroup };
