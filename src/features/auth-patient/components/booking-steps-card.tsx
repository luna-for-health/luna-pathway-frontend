import type { BookingStepsCardProps } from '@/features/auth-patient/types';
import { cn } from '@/lib/utils';

function BookingStepsCard({ title, steps, className }: BookingStepsCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-cream-10 flex w-full flex-col gap-6 rounded-3xl p-5 lg:min-h-112.5 lg:w-100 lg:p-8',
        className
      )}
    >
      <h2 className="font-heading text-heading-primary text-lg leading-6 font-medium tracking-[-0.4px] lg:text-xl lg:leading-7">
        {title}
      </h2>

      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                index === 0
                  ? 'bg-heading-primary text-neutral-white'
                  : 'bg-neutral-white text-heading-primary'
              )}
            >
              {index + 1}
            </span>
            <p className="text-body-primary pt-1.5 text-sm lg:text-base lg:leading-5">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export { BookingStepsCard };
