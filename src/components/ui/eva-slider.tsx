import { Slider as RadixSlider } from 'radix-ui';

import { cn } from '@/lib/utils';
import type { EvaLevel, EvaScoreBarProps, EvaSliderProps } from '@/types';

const EVA_MAX = 10;
const EVA_TICKS = Array.from({ length: EVA_MAX + 1 }, (_, index) => index);

/**
 * Buckets a 0–10 EVA score. Ranges confirmed with the user (2026-10-01): 1–3 légère,
 * 4–7 significative, 8–10 insupportable; 0 means "absent" and shows no label.
 */
function getEvaLevel(value: number): EvaLevel {
  if (value <= 0) return 'none';
  if (value <= 3) return 'low';
  if (value <= 7) return 'medium';
  return 'high';
}

const LEVEL_LABEL: Record<Exclude<EvaLevel, 'none'>, string> = {
  low: 'Légère',
  medium: 'Significative',
  high: 'Insupportable',
};

const LEVEL_SCORE_TEXT: Record<Exclude<EvaLevel, 'none'>, string> = {
  low: 'text-alert-success-text',
  medium: 'text-alert-warning-text',
  high: 'text-alert-danger-text',
};

const LEVEL_RANGE_BG: Record<EvaLevel, string> = {
  none: 'bg-transparent',
  low: 'bg-slider-low',
  medium: 'bg-slider-medium',
  high: 'bg-slider-high',
};

const LEVEL_THUMB_BORDER: Record<EvaLevel, string> = {
  none: 'border-slider-thumb',
  low: 'border-slider-low',
  medium: 'border-slider-medium',
  high: 'border-slider-high',
};

/**
 * "SliderEva" DS component (Figma, used in "step 3 / eva sliders", node 7592:6138) — a symptom
 * title + description header, a colored score/label on the right once the value is > 0, and a
 * 0–10 slider with 11 tick marks and a 0 / 5 / 10 scale underneath.
 *
 * Built on Radix Slider (keyboard + touch + a11y for free). The track is inset by 12px (`mx-3`,
 * Figma's `track-container` `px-12`) so the 24px thumb's center lines up with the track ends —
 * Radix keeps the thumb in-bounds of the root, which puts its center exactly at
 * `12px + pct × (width − 24px)`, the same point the range fill ends at.
 *
 * Distinct from the older `Slider` (`slider.tsx`, a pagination-dots slider, not wired up).
 */
function EvaSlider({
  title,
  description,
  value,
  onValueChange,
  disabled,
  className,
}: EvaSliderProps) {
  const level = getEvaLevel(value);

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <div className="flex min-h-12 w-full items-center gap-3 px-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-primary text-base leading-5 font-medium">{title}</p>
          {description && <p className="text-body-tertiary text-sm leading-5">{description}</p>}
        </div>
        {level !== 'none' && (
          <div
            className={cn(
              'flex shrink-0 flex-col items-center whitespace-nowrap',
              LEVEL_SCORE_TEXT[level]
            )}
            aria-hidden="true"
          >
            <p className="text-2xl leading-7 font-bold">{value}</p>
            <p className="text-xs leading-4 font-medium">{LEVEL_LABEL[level]}</p>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-1">
        <RadixSlider.Root
          className="relative flex h-6 w-full touch-none items-center select-none"
          min={0}
          max={EVA_MAX}
          step={1}
          value={[value]}
          onValueChange={next => onValueChange(next[0] ?? 0)}
          disabled={disabled}
        >
          <RadixSlider.Track className="bg-slider-track relative mx-3 h-2 grow rounded-full">
            <RadixSlider.Range
              className={cn('absolute h-full rounded-full', LEVEL_RANGE_BG[level])}
            />
          </RadixSlider.Track>
          <RadixSlider.Thumb
            className={cn(
              'bg-neutral-white block size-6 cursor-grab rounded-xl border-3 transition-colors outline-none',
              'focus-visible:ring-heading-primary/30 focus-visible:ring-4 active:cursor-grabbing',
              LEVEL_THUMB_BORDER[level]
            )}
            aria-label={title}
            aria-valuetext={
              level === 'none'
                ? `${value} sur 10, absent`
                : `${value} sur 10, ${LEVEL_LABEL[level].toLowerCase()}`
            }
          />
        </RadixSlider.Root>

        <div className="flex w-full flex-col gap-0.5" aria-hidden="true">
          <div className="flex w-full items-center justify-between px-3">
            {EVA_TICKS.map(tick => (
              <span key={tick} className="bg-slider-track h-1 w-px" />
            ))}
          </div>
          <div className="text-body-tertiary flex w-full items-center px-2 text-xs leading-4 font-medium">
            <p className="flex-1">0</p>
            <p className="flex-1 text-center">5</p>
            <p className="flex-1 text-right">10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const LEVEL_DOT_BG: Record<EvaLevel, string> = {
  none: 'bg-slider-thumb',
  low: 'bg-slider-low',
  medium: 'bg-slider-medium',
  high: 'bg-slider-high',
};

/**
 * Read-only "small version" of the EVA slider (Figma "summary" node 7251:12664, "symptom-line"
 * row) — the score number followed by a 100px × 4px bar with a level-colored fill and an 8px
 * dot at the value. Not interactive; used to recap scores, not to edit them.
 */
function EvaScoreBar({ value, className }: EvaScoreBarProps) {
  const level = getEvaLevel(value);
  const percent = Math.min(Math.max(value, 0), EVA_MAX) * (100 / EVA_MAX);

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="img"
      aria-label={`${value} sur ${EVA_MAX}`}
    >
      <span className="text-body-primary text-sm leading-5 whitespace-nowrap">{value}</span>
      <span className="relative h-2 w-25 shrink-0">
        <span className="bg-slider-track absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
        <span
          className={cn(
            'absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full',
            LEVEL_RANGE_BG[level]
          )}
          style={{ width: `${percent}%` }}
        />
        {/* Keeps the 8px dot inside the bar at both ends (centered at 4px … width − 4px). */}
        <span
          className={cn('absolute top-0 size-2 rounded-full', LEVEL_DOT_BG[level])}
          style={{ left: `calc(${percent}% - ${(percent / 100) * 8}px)` }}
        />
      </span>
    </div>
  );
}

export { EvaScoreBar, EvaSlider, getEvaLevel };
