import type { GdprCardProps } from '@/features/patient-auth/types';
import { renderBoldText } from '@/lib/text-formatting';
import { cn } from '@/lib/utils';

function GdprCard({ icon, title, paragraphs, backgroundColor, className }: GdprCardProps) {
  return (
    <div
      className={cn(
        'flex h-108 w-85 flex-col items-start gap-4 rounded-2xl p-8 lg:h-98 lg:w-124.5',
        className
      )}
      style={{ backgroundColor: backgroundColor ?? '#ffedcc' }}
    >
      <span className="text-heading-primary size-12 shrink-0">{icon}</span>

      <div className="flex w-full flex-col items-start">
        <div className="flex w-full items-center justify-center pb-4">
          <p className="font-heading text-body-primary flex-1 text-lg font-medium tracking-[-0.4px]">
            {title}
          </p>
        </div>

        <div className="text-body-primary flex w-full flex-col gap-3">
          {paragraphs.map(paragraph => (
            <p key={paragraph} className="text-sm">
              {renderBoldText(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GdprCard };
