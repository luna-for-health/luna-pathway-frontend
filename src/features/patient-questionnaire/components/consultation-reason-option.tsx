import type { ConsultationReasonOptionProps } from '@/features/patient-questionnaire/types';
import { CheckCircleIcon } from '@/icons';
import { cn } from '@/lib/utils';

/**
 * Two-line multi-select option card for "flow / step 1" (Figma node 7245:11386) — reuses the
 * `option-list-*` design tokens the generic `Option` DS primitive is built on, but composes its
 * own title+description layout since the primitive only supports a single-line label.
 */
function ConsultationReasonOption({
  title,
  description,
  selected = false,
  className,
  ...props
}: ConsultationReasonOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex min-h-12 w-full items-start justify-between gap-4 rounded-lg border py-3 pl-6 text-left transition-colors',
        selected
          ? 'bg-option-list-background-selected border-option-list-border-selected border-2 pr-4'
          : 'border-option-list-border hover:border-option-list-border-hovered pr-10',
        className
      )}
      {...props}
    >
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-body-primary text-sm leading-5 font-medium">{title}</span>
        <span className="text-body-secondary text-sm leading-5">{description}</span>
      </span>
      {selected && (
        <CheckCircleIcon
          aria-hidden="true"
          className="text-option-list-border-selected size-6 shrink-0"
        />
      )}
    </button>
  );
}

export { ConsultationReasonOption };
