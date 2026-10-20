import { EvaScoreBar } from '@/components/ui';
import type { InboxSymptomsProps } from '@/features/secretary/types';

/**
 * "Symptômes" info-card of the request detail (Figma node 7751:9313) — one "symptom-line" per
 * symptom the patient rated above 0: the label on the left, the read-only EVA score bar on the
 * right. Same recap as the patient's own summary screen (`RequestSummary`).
 */
export function InboxSymptoms({ symptoms }: InboxSymptomsProps) {
  return (
    <div className="border-neutral-20 flex w-full flex-col items-start gap-4 border-b py-8">
      <p className="text-body-primary text-base font-medium">Symptômes</p>
      {symptoms.length > 0 ? (
        <ul className="flex w-full flex-col gap-4">
          {symptoms.map(symptom => (
            <li key={symptom.id} className="flex w-full items-center gap-2">
              <span className="text-body-primary min-w-0 flex-1 text-sm">{symptom.label}</span>
              <EvaScoreBar value={symptom.score} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-secondary text-sm">Aucun symptôme signalé.</p>
      )}
    </div>
  );
}
