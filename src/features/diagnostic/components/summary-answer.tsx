import type { SummaryAnswerProps } from '@/features/diagnostic/types';
import { CheckCircleIcon } from '@/icons';

/**
 * "summary" screen (Figma node 7251:12664) answer-card row — used for all four sections
 * (motif de consultation / votre histoire / vos symptômes / vos documents). The card itself applies the
 * `divide-y` border between rows, so this component only renders its own padding/content.
 *
 * Body wrapper is a `<div>` (not a `<p>`, unlike the title) so a section can render more
 * than one line — e.g. "Vos documents" stacking the recent-imaging sentence above the
 * document count (Figma node 7251:12664's "documents" group, gap-16px between lines) —
 * without nesting `<p>` inside `<p>`. A single plain-string answer renders identically
 * either way.
 */
function SummaryAnswer({ title, children }: SummaryAnswerProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4 p-8">
      <div className="flex w-full items-center gap-2">
        <CheckCircleIcon className="text-alert-success-text size-6 shrink-0" />
        <p className="text-body-primary text-base leading-5 font-medium">{title}</p>
      </div>
      <div className="text-body-primary flex w-full flex-col gap-4 text-sm leading-5">
        {children}
      </div>
    </div>
  );
}

export { SummaryAnswer };
