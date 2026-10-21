import type { TestimonialCardProps } from '@/features/patient-auth/types';
import { CheckCircleIcon } from '@/icons';
import { renderBoldText } from '@/lib/text-formatting';
import { cn } from '@/lib/utils';

function TestimonialCard({ icon, title, description, points, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-cream-10 flex h-117 w-104.5 flex-col items-start rounded-2xl p-8',
        className
      )}
    >
      <span className="text-heading-primary size-12 shrink-0">{icon}</span>

      <p className="font-heading text-heading-primary w-full pt-4 pb-6 text-lg font-bold tracking-[-0.4px]">
        {title}
      </p>

      {description && <p className="text-body-primary w-full pb-6 text-sm">{description}</p>}

      <div className="flex w-full flex-col gap-3">
        {points.map((point, index) => (
          <div key={index} className="flex w-full items-start gap-3">
            <CheckCircleIcon className="text-heading-primary size-6 shrink-0" />
            <p className="text-body-primary flex-1 text-sm">{renderBoldText(point)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TestimonialCard };
